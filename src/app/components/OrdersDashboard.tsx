"use client";

import { useSearchParams, usePathname } from "next/navigation";
import OrdersTable, { Order } from "./OrdersTable";
import Link from "next/link";

interface Props {
  initialOrders: Order[];
}

export default function OrdersDashboard({ initialOrders }: Props) {
  const searchParams = useSearchParams();
  const statusFilter = searchParams.get("status") || "all";
  const path = usePathname();

  // Filter once on the client
  const orders =
    statusFilter === "all"
      ? initialOrders
      : initialOrders.filter((o) => o.status === statusFilter);

  // Pre‑compute counts for tabs
  const counts = {
    all: initialOrders.length,
    pending: initialOrders.filter((o) => o.status === "pending").length,
    delivered: initialOrders.filter((o) => o.status === "delivered").length,
    returned: initialOrders.filter((o) => o.status === "returned").length,
    cancelled: initialOrders.filter((o) => o.status === "cancelled").length,
  };

  const tabs: { label: string; status: string }[] = [
    { label: `All (${counts.all})`, status: "all" },
    { label: `Pending (${counts.pending})`, status: "pending" },
    { label: `Delivered (${counts.delivered})`, status: "delivered" },
    { label: `Returned (${counts.returned})`, status: "returned" },
    { label: `Cancelled (${counts.cancelled})`, status: "cancelled" },
  ];

  return (
    <div className="flex">
      {/* Sidebar */}
      <nav className="w-48 bg-gray-100 h-full p-4">
        <ul className="space-y-2">
          {tabs.map((tab) => {
            const href = `/dashboard?status=${tab.status}`;
            const isActive = path === href;
            return (
              <li key={tab.status}>
                <Link
                  href={href}
                  className={`block px-3 py-2 rounded-md hover:bg-gray-200 ${
                    isActive ? "bg-white shadow font-medium" : ""
                  }`}
                >
                  {tab.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Main content */}
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">
          {tabs.find((t) => t.status === statusFilter)!.label.split(" ")[0]}{" "}
          Orders
        </h1>
        <OrdersTable orders={orders} />
      </main>
    </div>
  );
}
