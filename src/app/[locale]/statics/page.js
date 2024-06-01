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
import { useTranslations } from "next-intl";
import Pagination from "@/components/Pagination";

export default function StaticsPage() {
  const t = useTranslations("statics");
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const { loading, data: profile } = useProfile();
  const [startDate, setStartDate] = useState(new Date('2023-01-01'));
  const [endDate, setEndDate] = useState(new Date());
  const [paginatedOrders, setPaginatedOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; 

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    fetchOrders(startDate, endDate);
  };

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
          const end = endDate.getTime();
          filteredOrders = allOrders.filter((order) => {
            if (!order.createdAt) {
              return false;
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
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        setPaginatedOrders(filteredOrders.slice(start, end));
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
            <div className="mx-4 mt-2">
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                dateFormat="dd/MM/yyyy"
              />
            </div>
          </div>
          <div className="flex p-2 items-center border rounded-full">
            <h1 className="flex m-2 p-2">{t("end")} </h1>
            <div className="mx-4 mt-2">
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                dateFormat="dd/MM/yyyy"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-md mt-4 mx-auto">
        <button onClick={handleFillClick} className="bg-primary text-white">
          {t("fill")}
        </button>
      </div>
      <div className="mt-8">
      {paginatedOrders?.length > 0 ? (
      paginatedOrders.map((order) => (
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
        <Pagination
        currentPage={currentPage}
        handlePageChange={handlePageChange}
        items={orders}
        itemsPerPage={itemsPerPage}
      />
      </div>
    </section>
  );
}
