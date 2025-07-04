"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { orders } from "@/app/data/orders";

export default function Sidebar() {
  const path = usePathname();

  const tabs = useMemo(() => {
    const tabConfig = [
      { label: "All", status: "all" },
      { label: "Pending", status: "pending" },
      { label: "Delivered", status: "delivered" },
      { label: "Returned", status: "returned" },
      { label: "Cancelled", status: "cancelled" },
    ] as const;

    return tabConfig.map(({ label, status }) => {
      const count =
        status === "all"
          ? orders.length
          : orders.filter((o) => o.status === status).length;

      return {
        label: `${label} (${count})`,
        href: `/dashboard/${status}`,
      };
    });
  }, []);

  return (
    <nav className="w-48 bg-gray-100 h-full p-4">
      <ul className="space-y-2">
        {tabs.map((tab) => {
          const isActive = path === tab.href;
          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
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
  );
}
