'use client';
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";

export default function LoginPage() {
  const t = useTranslations('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginInProgress, setLoginInProgress] = useState(false);

  async function handleFormSubmit(ev) {
    ev.preventDefault();
    setLoginInProgress(true);

    await signIn('credentials', { email, password, callbackUrl: '/' });

    setLoginInProgress(false);
  }
  return (
    <section className="mt-8">
      <h1 className="text-center text-primary text-4xl mb-4">
        {t('login')}
      </h1>
      <form className="max-w-xs mx-auto" onSubmit={handleFormSubmit}>
        <input type="email" name="email" placeholder={t('email')} value={email}
          disabled
          onChange={ev => setEmail(ev.target.value)} />
        <input type="password" name="password" placeholder={t('password')} value={password}
          disabled
          onChange={ev => setPassword(ev.target.value)} /> 
        <button disabled type="submit-1">{t('login')}</button>
        <div className="my-4 text-center text-gray-500">
          {t('provider')}
        </div>
        <div>
          <button type="button" onClick={() => signIn('google', { callbackUrl: '/' })}
            className="flex gap-4 justify-center">
            <Image src={'/google.png'} alt={''} width={24} height={24} />
            {t('google')}
          </button>
        </div>
        <div className="mt-4">
          <button disabled type="button" onClick={() => signIn('google', { callbackUrl: '/' })}
            className="flex gap-4 bg-slate-200 justify-center text-slate-500">
            <Image src={'/facebook.png'} alt={''} width={24} height={24} />
            {t('facebook')}
          </button>
        </div>
      </form>
    </section>
  );
}