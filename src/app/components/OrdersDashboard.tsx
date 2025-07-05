"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import OrdersTable, { Order } from "./OrdersTable";

interface OrdersDashboardProps {
  initialOrders: Order[];
}

export default function OrdersDashboard({
  initialOrders,
}: OrdersDashboardProps) {
  const searchParams = useSearchParams();
  const path = usePathname();

  // 1. Local state for status filter
  const [status, setStatus] = useState<string>(
    () => searchParams.get("status") || "all"
  );

  // 2. Sync state when user uses browser back/forward
  useEffect(() => {
    const urlStatus = searchParams.get("status") || "all";
    if (urlStatus !== status) {
      setStatus(urlStatus);
    }
  }, [searchParams]);

  // 3. Filter in‑memory instantly
  const filtered = useMemo(() => {
    return status === "all"
      ? initialOrders
      : initialOrders.filter((o) => o.status === status);
  }, [status, initialOrders]);

  // 4. Pre-compute counts
  const counts = useMemo(
    () => ({
      all: initialOrders.length,
      pending: initialOrders.filter((o) => o.status === "pending").length,
      delivered: initialOrders.filter((o) => o.status === "delivered").length,
      returned: initialOrders.filter((o) => o.status === "returned").length,
      cancelled: initialOrders.filter((o) => o.status === "cancelled").length,
    }),
    [initialOrders]
  );

  const tabs = [
    { label: "All", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Delivered", value: "delivered" },
    { label: "Returned", value: "returned" },
    { label: "Cancelled", value: "cancelled" },
  ] as const;

  // 5. Click handler: update state, then URL via history.replaceState
  const handleTabClick = (value: string) => {
    setStatus(value);

    // Build new URL with or without ?status=
    const qp = new URLSearchParams();
    if (value !== "all") qp.set("status", value);
    const newUrl = `${path}${qp.toString() ? `?${qp}` : ""}`;

    // Replace URL without navigation
    window.history.replaceState({}, "", newUrl);
  };

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <nav className="w-48 bg-gray-100 p-4">
        <ul className="space-y-2">
          {tabs.map((tab) => {
            const isActive = status === tab.value;
            return (
              <li key={tab.value}>
                <button
                  onClick={() => handleTabClick(tab.value)}
                  className={`w-full text-left px-3 py-2 rounded-md hover:bg-gray-200 ${
                    isActive ? "bg-white shadow font-medium" : ""
                  }`}
                >
                  {tab.label} ({counts[tab.value]})
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-auto">
        <h1 className="text-2xl font-bold mb-4">
          {tabs.find((t) => t.value === status)?.label} Orders
        </h1>
        {/* Keyed by status to reset pagination */}
        <OrdersTable key={status} orders={filtered} />
      </main>
    </div>
  );
}
