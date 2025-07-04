import { prisma } from "@/lib/prisma";
import OrdersTable, { Order, OrderStatus } from "@/app/components/OrdersTable";

interface OrderStatusPageProps {
  status: OrderStatus;
  title: string;
}

export default async function OrderStatusPage({
  status,
  title,
}: OrderStatusPageProps) {
  const rawOrders = await prisma.order.findMany({
    where: { status },
    orderBy: { date: "desc" },
  });

  // Convert DB objects to OrdersTable format
  const orders: Order[] = rawOrders.map((o) => ({
    id: o.id,
    trackingNumber: o.trackingNumber,
    status: o.status as OrderStatus,
    date: o.date.toISOString(),
    address: o.address,
    productInfo: o.productInfo,
    customerName: o.customerName,
    courier: o.courier,
  }));

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{title}</h1>
      <OrdersTable orders={orders} />
    </div>
  );
}
