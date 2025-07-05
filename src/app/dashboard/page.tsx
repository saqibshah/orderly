// Force dynamic so we always fetch live data on request
export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import OrdersDashboard from "@/app/components/OrdersDashboard";
import type { OrderStatus } from "@/app/components/OrdersTable";

export default async function DashboardPage() {
  // 1️⃣ Fetch ALL orders once on the server
  const rawOrders = await prisma.order.findMany({
    orderBy: { date: "desc" },
  });

  // 2️⃣ Normalize to our client Order type
  type Raw = (typeof rawOrders)[number];
  type OrderType = {
    id: number;
    trackingNumber: string;
    status: OrderStatus;
    date: string;
    address: string;
    productInfo: string;
    customerName: string;
    courier: string;
  };

  const initialOrders: OrderType[] = rawOrders.map((o) => ({
    id: o.id,
    trackingNumber: o.trackingNumber,
    status: o.status as OrderStatus,
    date: o.date.toISOString(),
    address: o.address,
    productInfo: o.productInfo,
    customerName: o.customerName,
    courier: o.courier,
  }));

  // 3️⃣ Render the client dashboard
  return <OrdersDashboard initialOrders={initialOrders} />;
}
