export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import OrdersTable from "@/app/components/OrdersTable";

type OrderStatus = "pending" | "delivered" | "cancelled" | "returned";

export default async function AllOrdersPage() {
  const rawOrders = await prisma.order.findMany({
    orderBy: { date: "desc" },
  });

  const orders = rawOrders.map((o) => ({
    id: o.id,
    trackingNumber: o.trackingNumber,
    status: o.status as OrderStatus,
    date: o.date.toISOString(), // 👈 convert Date to string
    address: o.address,
    productInfo: o.productInfo,
    customerName: o.customerName,
    courier: o.courier,
  }));

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">All Orders</h1>
      <OrdersTable orders={orders} />
    </div>
  );
}
