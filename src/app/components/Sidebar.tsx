// src/app/components/Sidebar.tsx
import { prisma } from "@/lib/prisma";
import SidebarClient from "./SidebarClient"; // new client wrapper

export default async function Sidebar() {
  const [pending, delivered, returned, cancelled] = await Promise.all([
    prisma.order.count({ where: { status: "pending" } }),
    prisma.order.count({ where: { status: "delivered" } }),
    prisma.order.count({ where: { status: "returned" } }),
    prisma.order.count({ where: { status: "cancelled" } }),
  ]);

  const all = pending + delivered + returned + cancelled;

  const tabs = [
    { label: "All", count: all, href: "/dashboard/all" },
    { label: "Pending", count: pending, href: "/dashboard/pending" },
    { label: "Delivered", count: delivered, href: "/dashboard/delivered" },
    { label: "Returned", count: returned, href: "/dashboard/returned" },
    { label: "Cancelled", count: cancelled, href: "/dashboard/cancelled" },
  ];

  return <SidebarClient tabs={tabs} />;
}
