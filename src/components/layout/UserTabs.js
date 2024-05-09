'use client';
import Link from "next/link";
import {usePathname} from "next/navigation";
import {useTranslations} from "next-intl";

export default function UserTabs({isAdmin}) {
  const t = useTranslations('components.layout.UserTabs');
  const path = usePathname();
  return (
    <div className="flex mx-auto gap-2 tabs justify-center flex-wrap">
      <Link
        className={path === '/profile' ? 'active' : ''}
        href={'/profile'}
      >
        {t('profile')}
      </Link>
      {isAdmin && (
        <>
          <Link
            href={'/categories'}
            className={path === '/categories' ? 'active' : ''}
          >
            {t('categories')}
          </Link>
          <Link
            href={'/menu-items'}
            className={path.includes('menu-items') ? 'active' : ''}
          >
            {t('menu_items')}
          </Link>
          <Link
            className={path.includes('/users') ? 'active' : ''}
            href={'/users'}
          >
            {t('users')}
          </Link>
          <Link
            className={path.includes('/statics') ? 'active' : ''}
            href={'/statics'}
          >
            {t('statics')}
          </Link>
        </>
      )}
      <Link
        className={path === '/orders' ? 'active' : ''}
        href={'/orders'}
      >
        {t('orders')}
      </Link>
    </div>
  );
}