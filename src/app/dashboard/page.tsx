import { prisma } from "@/lib/prisma";
import OrdersDashboard from "@/app/components/OrdersDashboard";
import type { Order, OrderStatus } from "@/app/components/OrdersTable";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  // 1. Fetch raw results from Prisma
  const rawOrders = await prisma.order.findMany({
    orderBy: { date: "desc" },
  });

  // 2. Map them into your Order type
  const initialOrders: Order[] = rawOrders.map((o) => ({
    id: o.id,
    trackingNumber: o.trackingNumber,
    status: o.status as OrderStatus, // cast to the literal union
    date: o.date.toISOString(), // convert Date → string
    address: o.address,
    productInfo: o.productInfo,
    customerName: o.customerName,
    courier: o.courier,
  }));

  // 3. Pass the properly typed array
  return <OrdersDashboard initialOrders={initialOrders} />;
}
