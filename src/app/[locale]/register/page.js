"use client";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useTranslations } from "next-intl";

export default function RegisterPage() {
  const t = useTranslations("register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [creatingUser, setCreatingUser] = useState(false);
  const [userCreated, setUserCreated] = useState(false);
  const [error, setError] = useState(false);
  async function handleFormSubmit(ev) {
    ev.preventDefault();
    setCreatingUser(true);
    setError(false);
    setUserCreated(false);
    const response = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
      setUserCreated(true);
    } else {
      setError(true);
    }
    setCreatingUser(false);
  }
  return (
    <section className="mt-8">
      <h1 className="text-center text-primary text-4xl mb-4">
        {t("register")}
      </h1>
      {userCreated && (
        <div className="my-4 text-center">
          {t("user_create")}
          <br />
          {t("now")}{" "}
          <Link className="underline" href={"/login"}>
            {t("login")} &raquo;
          </Link>
        </div>
      )}
      {error && (
        <div className="my-4 text-center">
          {t("error")}
          <br />
          {t("try_again")}
        </div>
      )}
      <form className="block max-w-xs mx-auto" onSubmit={handleFormSubmit}>
        <input
          type="email"
          placeholder={t("email")}
          value={email}
          disabled
          onChange={(ev) => setEmail(ev.target.value)}
        />
        <input
          type="password"
          placeholder={t("password")}
          value={password}
          disabled
          onChange={(ev) => setPassword(ev.target.value)}
        />
        <button type="submit-1" disabled>
          {t("register")}
        </button>
        <div className="my-4 text-center text-gray-500">{t("provider")}</div>
        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="flex gap-4 justify-center"
        >
          <Image src={"/google.png"} alt={""} width={24} height={24} />
          {t("google")}
        </button>
        <div className="mt-4">
          <button
            disabled
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="flex gap-4 bg-slate-200 justify-center text-slate-500"
          >
            <Image src={"/facebook.png"} alt={""} width={24} height={24} />
            {t("facebook")}
          </button>
        </div>
        <div className="text-center my-4 text-gray-500 border-t pt-4">
          {t("existing")}{" "}
          <Link className="underline" href={"/login"}>
            {t("login_here")} &raquo;
          </Link>
        </div>
      </form>
    </section>
  );
}

