export const dynamic = "force-dynamic";

import OrderStatusPage from "@/app/components/OrderStatusPage";

export default function DeliveredPage() {
  return <OrderStatusPage status="delivered" title="Delivered Orders" />;
}
