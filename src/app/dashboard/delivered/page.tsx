// src/app/dashboard/delivered/page.tsx

import OrderStatusPage from "@/app/components/OrderStatusPage";

export default function DeliveredPage() {
  return <OrderStatusPage status="delivered" title="Delivered Orders" />;
}
