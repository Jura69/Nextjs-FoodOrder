'use client';
import Right from "@/components/icons/Right";
import UserTabs from "@/components/layout/UserTabs";
import {useProfile} from "@/components/UseProfile";
import Image from "next/image";
import Link from "next/link";
import {useEffect, useState} from "react";
import {useTranslations} from "next-intl";
import Pagination from "@/components/Pagination";

export default function MenuItemsPage() {
  const t = useTranslations('menu-items.page');
  const [menuItems, setMenuItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage,] = useState(6);
  const {loading, data} = useProfile();

  useEffect(() => {
    fetch('/api/menu-items').then(res => {
      res.json().then(menuItems => {
        setMenuItems(menuItems);
      });
    })
  }, []);

  // Tính toán các mục cho trang hiện tại
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = menuItems.slice(indexOfFirstItem, indexOfLastItem);

  // Cập nhật trang hiện tại
  const handlePageChange = pageNumber => setCurrentPage(pageNumber);

  if (loading) {
    return 'Loading user info...';
  }

  if (!data.admin) {
    return 'Not an admin.';
  }

  return (
    <section className="mt-8 max-w-2xl mx-auto">
      <UserTabs isAdmin={true} />
      <div className="mt-8">
        <Link
          className="button flex"
          href={'/menu-items/new'}>
          <span>{t('create_new')}</span>
          <Right />
        </Link>
      </div>
      <div>
        <h2 className="text-sm text-gray-500 mt-8">{t('edit_menu')}</h2>
        <div className="grid grid-cols-3 gap-2">
          {currentItems?.length > 0 && currentItems.map(item => (
            <Link
              key={item._id}
              href={'/menu-items/edit/'+item._id}
              className="bg-gray-200 rounded-lg p-4"
            >
              <div className="relative">
                <Image
                  className="rounded-md"
                  src={item.image} alt={''} width={200} height={200} />
              </div>
              <div className="text-center">
                {item.name}
              </div>
            </Link>
          ))}
        </div>
        <Pagination
          currentPage={currentPage}
          handlePageChange={handlePageChange}
          items={menuItems}
          itemsPerPage={itemsPerPage}
        />
      </div>
    </section>
  );
}