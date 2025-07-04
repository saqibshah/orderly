'use client';

import { orders } from '@/app/data/orders';
import OrdersTable from '@/app/components/OrdersTable';

export default function AllOrdersPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">All Orders</h1>
      <OrdersTable orders={orders} />
    </div>
  );
}
