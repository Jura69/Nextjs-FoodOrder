import {isAdmin} from "@/app/api/auth/[...nextauth]/route";
import {User} from "@/models/User";
import {UserInfo} from "@/models/UserInfo";
import mongoose from "mongoose";

export async function GET() {
  mongoose.connect(process.env.MONGO_URL);

  if (await isAdmin()) {
    const users = await User.find().lean();
    const usersWithInfo = await Promise.all(users.map(async user => {
      const userInfo = await UserInfo.findOne({email: user.email}).lean();
      return {...user, userInfo};
    }));

    return Response.json(usersWithInfo);
  } else {
    return Response.json([]);
  }
}