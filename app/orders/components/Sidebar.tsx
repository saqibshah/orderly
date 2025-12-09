"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const Sidebar = () => {
  const pathname = usePathname();

  const menu = [
    { name: "Pending", href: "/orders?status=pending" },
    { name: "Delivered", href: "/orders?status=delivered" },
    { name: "Returned", href: "/orders?status=returned" },
    { name: "Cancelled", href: "/orders?status=cancelled" },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col">
      <div className="p-6 font-bold text-xl border-b border-gray-700">
        Orders
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {menu.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`block rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-700 ${
              pathname === item.href ? "bg-gray-800" : "text-gray-300"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
