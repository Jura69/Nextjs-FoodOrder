'use client';
import { CartContext } from "@/components/AppContext";
import Bars2 from "@/components/icons/Bars2";
import ShoppingCart from "@/components/icons/ShoppingCart";
import { signOut, useSession } from "next-auth/react";
import {Link} from "../../navigation";
import { useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from '@/navigation';
import { useTranslations } from 'next-intl';
import LanguageChanger from './LanguageChange';

function AuthLinks({ status, userName}) {
  const t = useTranslations('components.layout.Header');
  if (status === 'authenticated') {
    return (
      <>
        <Link href={'/profile'} className="whitespace-nowrap">
          <>
          {t('hello')} {userName}
          </>
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="bg-primary rounded-full text-white px-8 py-2">
          {t('logout')}
        </button>
      </>
    );
  }
  if (status === 'unauthenticated') {
    return (
      <>
        <Link href={'/login'}>{t('login')}</Link>
        <Link href={'/register'} className="bg-primary rounded-full text-white px-8 py-2">
          {t('register')}
        </Link>
      </>
    );
  }
}

export default function Header() {

  const t = useTranslations('components.layout.Header');
  const session = useSession();
  const status = session?.status;
  const userData = session.data?.user;
  let userName = userData?.name || userData?.email;
  const { cartProducts } = useContext(CartContext);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  if (userName && userName.includes(' ')) {
    userName = userName.split(' ')[0];
  }

  return (
    <header>
      <div className="flex items-center md:hidden justify-between">
        <Link className="text-primary font-semibold text-2xl" href={'/'}>
          Food Lover
        </Link>
        <div className="flex gap-8 items-center">
          <Link href={'/cart'} className="relative">
            <ShoppingCart />
            {cartProducts?.length > 0 && (
              <span className="absolute -top-2 -right-4 bg-primary text-white text-xs py-1 px-1 rounded-full leading-3">
                {cartProducts.length}
              </span>
            )}
          </Link>
          <button
            className="p-1 border"
            onClick={() => setMobileNavOpen(prev => !prev)}>
            <Bars2 />
          </button>
        </div>
      </div>
      {mobileNavOpen && (
        <div
          onClick={() => setMobileNavOpen(false)}
          className="md:hidden p-4 bg-gray-200 rounded-lg mt-2 flex flex-col gap-2 text-center">
          <Link href={'/'}>{t('home')}</Link>
          <Link href={'/menu'}>Menu</Link>
          <Link href={'/#about'}>{t('about')}</Link>
          <Link href={'/#contact'}>{t('contact')}</Link>
          <LanguageChanger />
          <AuthLinks status={status} userName={userName} />
        </div>
      )}
      <div className="hidden md:flex items-center justify-between">
        <nav className="flex items-center gap-8 text-gray-500 font-semibold">
          <Link className="text-primary font-semibold text-2xl" href={'/'}>
            FoodLover
          </Link>
          <Link className="whitespace-nowrap" href={'/'}>{t('home')}</Link>
          <Link className="whitespace-nowrap" href={'/menu'}>Menu</Link>
          <Link className="whitespace-nowrap" href={'/#about'}>{t('about')}</Link>
          <Link className="whitespace-nowrap" href={'/#contact'}>{t('contact')}</Link>
          <LanguageChanger />
        </nav>
        <nav className="flex items-center gap-4 text-gray-500 font-semibold">
          <AuthLinks status={status} userName={userName}/>
          <Link href={'/cart'} className="relative">
            <ShoppingCart />
            {cartProducts?.length > 0 && (
              <span className="absolute -top-2 -right-4 bg-primary text-white text-xs py-1 px-1 rounded-full leading-3">
                {cartProducts.length}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}