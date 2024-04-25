"use client";
import { cartProductPrice } from "@/components/AppContext";
import UserTabs from "@/components/layout/UserTabs";
import { useProfile } from "@/components/UseProfile";
import { dbTimeForHumanMonth } from "@/libs/datetime";
import { useEffect, useState } from "react";
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

export default function StaticsPage() {
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const currentYear = new Date().getFullYear();
    const years = Array.from(
        { length: currentYear - 2023 + 1 },
        (_, i) => 2023 + i
    );
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const { loading, data: profile } = useProfile();

    useEffect(() => {
        fetchOrders(selectedYear);
    }, [selectedYear]);

    function fetchOrders(year) {
        setLoadingOrders(true);
        fetch("/api/orders").then((res) => {
            res.json().then((allOrders) => {
                const ordersInSelectedYear = allOrders.filter((order) => {
                    const date = new Date(order.createdAt);
                    return date.getFullYear() === year;
                });
                setOrders(ordersInSelectedYear.reverse());
                setLoadingOrders(false);
            });
        });
    }

    const handleYearChange = (event) => {
        const year = parseInt(event.target.value, 10);
        setSelectedYear(year);
        fetchOrders(year);
    };

    orders.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    const chartData = orders.reduce((acc, order) => {
        const date = dbTimeForHumanMonth(order.createdAt);
        const count = order.paid ? 1 : 0;
        if (!acc[date]) {
            acc[date] = { date, orders: 0 };
        }
        acc[date].orders += count;
        return acc;
    }, {});

    const chartDataArray1 = Object.values(chartData);

    const chartData2 = orders.reduce((acc, order) => {
        const date = new Date(order.createdAt);
        const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;

        let orderTotal = 0;
        if (order.cartProducts && order.paid) {
            // Check if the order is paid
            for (const product of order.cartProducts) {
                orderTotal += cartProductPrice(product);
            }
        }

        if (!acc[monthYear]) {
            acc[monthYear] = { date: monthYear, revenue: 0 };
        }
        acc[monthYear].revenue += orderTotal;

        return acc;
    }, {});

    // Convert the chartData object to an array
    const chartDataArray2 = Object.values(chartData2);

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

            <div className="mt-8 content-center">
                <div className="mt-8 mx-auto max-w-fit flex flex-row items-center">
                    <h1 className="mb-2 pr-2">Year: </h1>
                    <select value={selectedYear} onChange={handleYearChange}>
                        {years.map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex col-3 mx-5 gap-10 justify-center">
                    <div className="flex-1 p-5 m-5 text-center rounded-md bg-slate-200">
                        <h1>Total Revenue:</h1>
                        <h1 className="p-5" style={{ fontSize: "2em", fontWeight: "bold" }}>
                            {totalRevenue}$
                        </h1>
                    </div>
                    <div className="flex-1 p-5 m-5 text-center rounded-md bg-slate-200">
                        <h1>Total Orders:</h1>
                        <h1 className="p-5" style={{ fontSize: "2em", fontWeight: "bold" }}>
                            {totalPaidOrders}
                        </h1>
                    </div>
                </div>
                <div className="mx-auto text-center bg-slate-200 rounded-lg content-center">
                    <BarChart
                        width={720}
                        height={400}
                        data={chartDataArray1}
                        margin={{
                            top: 20,
                            right: 130,
                            left: 20,
                            bottom: 20,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date">
                            <Label
                                value="Month/Year"
                                offset={-10}
                                position="insideBottom"
                                dy={-45}
                                dx={320}
                            />
                        </XAxis>
                        <YAxis>
                            <Label
                                value="Orders"
                                offset={15}
                                angle={0}
                                position="insideLeft"
                                dy={-175}
                                dx={-15}
                            />
                        </YAxis>
                        <Tooltip />
                        <Legend
                            verticalAlign="top"
                            align="end"
                            wrapperStyle={{ fontSize: "18px" }}
                        />
                        <Bar dataKey="orders" fill="#8884d8" />
                    </BarChart>
                    <h1 className="mx-auto py-5">Orders Over Time</h1>
                </div>

                <div className="mt-10 mx-auto text-center bg-slate-200 rounded-lg">
                    <LineChart
                        width={720}
                        height={400}
                        data={chartDataArray2}
                        margin={{
                            top: 20,
                            right: 130,
                            left: 20,
                            bottom: 20,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date">
                            <Label
                                value="Month/Year"
                                offset={-10}
                                position="insideBottom"
                                dy={-45}
                                dx={320}
                            />
                        </XAxis>
                        <YAxis>
                            <Label
                                value="Revenue (USD)"
                                offset={15}
                                angle={0}
                                position="insideLeft"
                                dy={-175}
                                dx={-15}
                            />
                        </YAxis>
                        <Tooltip />
                        <Legend
                            verticalAlign="top"
                            align="end"
                            wrapperStyle={{ fontSize: "18px" }}
                        />
                        <Line
                            type="monotone"
                            dataKey="revenue"
                            stroke="#8884d8"
                            activeDot={{ r: 8 }}
                        />
                    </LineChart>
                    <h1 className="mx-auto py-5">Revenue Over Time</h1>
                </div>
            </div>
        </section>
    );
}
