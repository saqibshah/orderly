"use client";

import { Table } from "@radix-ui/themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const OrdersLayout = ({ children }: Props) => {
  const pathname = usePathname();

  const menu = [
    { name: "Pending", href: "/orders/pending" },
    { name: "Delivered", href: "/orders/delivered" },
    { name: "Returned", href: "/orders/returned" },
    { name: "Cancelled", href: "/orders/cancelled" },
  ];

  return (
    <div className="flex">
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
      <div className="grow">
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Tracking</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Courier Status</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Customer</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Product Ordered</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Order Date</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Concluded At</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>remarks</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>{children}</Table.Body>
        </Table.Root>
      </div>
    </div>
  );
};

export default OrdersLayout;
