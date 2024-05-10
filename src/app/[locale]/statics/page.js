"use client";
import { cartProductPrice } from "@/components/AppContext";
import SectionHeaders from "@/components/layout/SectionHeaders";
import { useProfile } from "@/components/UseProfile";
import { dbTimeForHuman, dbTimeForHumanDay } from "@/libs/datetime";
import Link from "next/link";
import { useEffect, useState } from "react";
import UserTabs from "@/components/layout/UserTabs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  BarChart,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Label,
  Bar,
} from "recharts";
import { useTranslations } from "next-intl";

export default function StaticsPage() {
  const t = useTranslations("statics");
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const { loading, data: profile } = useProfile();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const handleFillClick = () => {
    fetchOrders(startDate, endDate);
  };

  useEffect(() => {
    fetchOrders();
  }, []);
  function fetchOrders(startDate, endDate) {
    setLoadingOrders(true);
    fetch("/api/orders").then((res) => {
      res.json().then((allOrders) => {
        let filteredOrders;
        if (startDate && endDate) {
          const start = startDate.getTime(); // convert to timestamp
          const end = endDate.getTime(); // convert to timestamp
          console.log("startDate:", startDate.toLocaleDateString("en-GB"));
          console.log("endDate:", endDate.toLocaleDateString("en-GB"));
          filteredOrders = allOrders.filter((order) => {
            if (!order.createdAt) {
              return false; // skip this order if it has no date
            }
            const orderDateStr = dbTimeForHumanDay(order.createdAt);
            const [day, month, year] = orderDateStr.split("/");
            const orderDate = new Date(year, month - 1, day).getTime(); // convert to timestamp
            return orderDate >= start && orderDate <= end;
          });
        } else {
          filteredOrders = allOrders;
        }
        setOrders(filteredOrders.reverse());
        setLoadingOrders(false);
      });
    });
  }
  const totalRevenue = orders.reduce((total, order) => {
    let orderTotal = 0;
    if (order.cartProducts && order.paid) {
      // Check if the order is paid
      for (const product of order.cartProducts) {
        orderTotal += cartProductPrice(product);
      }
    }
    return total + orderTotal;
  }, 0);

  const totalPaidOrders = orders.filter((order) => order.paid).length;

  return (
    <section className="mt-8 max-w-3xl mx-auto">
      <UserTabs isAdmin={profile.admin} />
      {loadingOrders && <div>Loading statics...</div>}

      <div className="flex col-3 mx-5 gap-10 justify-center">
        <div className="flex-1 p-5 m-5 text-center rounded-md bg-slate-200">
          <h1>{t("total_rev")}</h1>
          <h1 className="p-5" style={{ fontSize: "2em", fontWeight: "bold" }}>
            {totalRevenue}$
          </h1>
        </div>
        <div className="flex-1 p-5 m-5 text-center rounded-md bg-slate-200">
          <h1>{t("total_ord")}</h1>
          <h1 className="p-5" style={{ fontSize: "2em", fontWeight: "bold" }}>
            {totalPaidOrders}
          </h1>
        </div>
      </div>
      <div className="mt-8 content-center">
        <div className="flex mx-auto gap-2 flex-wrap justify-center">
          <div className="flex p-2 items-center border rounded-full">
            <h1 className="flex m-2 p-2 ">{t("start")} </h1>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="dd/MM/yyyy"
            />
          </div>
          <div className="flex p-2 items-center border rounded-full">
            <h1 className="flex m-2 p-2">{t("end")} </h1>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              dateFormat="dd/MM/yyyy"
            />
          </div>
          <div className="mt-4">
            <button onClick={handleFillClick} className="bg-primary text-white">
              {t("fill")}
            </button>
          </div>
        </div>
      </div>
      <div className="mt-8">
        {orders?.length > 0 ? (
          orders.map((order) => (
            <div
              key={order._id}
              className="bg-gray-100 mb-2 p-4 rounded-lg flex flex-col md:flex-row items-center gap-6"
            >
              <div className="grow flex flex-col md:flex-row items-center gap-6">
                <div>
                  <div
                    className={
                      (order.paid ? "bg-green-500" : "bg-red-400") +
                      " p-2 rounded-md text-white w-24 text-center"
                    }
                  >
                    {order.paid ? <>{t("paid")}</> : <>{t("not_paid")}</>}
                  </div>
                </div>
                <div className="grow">
                  <div className="flex gap-2 items-center mb-1">
                    <div className="grow">{order.userEmail}</div>
                    <div className="text-gray-500 text-sm">
                      {dbTimeForHuman(order.createdAt)}
                    </div>
                  </div>
                  <div className="text-gray-500 text-xs">
                    {order.cartProducts.map((p) => p.name).join(", ")}
                  </div>
                </div>
              </div>
              <div className="justify-end flex gap-2 items-center whitespace-nowrap">
                <Link href={"/orders/" + order._id} className="button">
                  {t("show")}
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div>{t("not_found")}</div>
        )}
      </div>
    </section>
  );
}
