'use client';

import OrdersTable, { Order } from '@/app/components/OrdersTable';
import { orders } from '@/app/data/orders';

interface OrderStatusPageProps {
  status: Order['status'];
  title: string;
}

export default function OrderStatusPage({ status, title }: OrderStatusPageProps) {
  // Filter the shared orders by the given status
  const filtered = orders.filter((o) => o.status === status);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{title}</h1>
      <OrdersTable orders={filtered} />
    </div>
  );
}
