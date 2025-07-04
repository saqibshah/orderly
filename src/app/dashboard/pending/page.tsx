export const dynamic = "force-dynamic";

import OrderStatusPage from "@/app/components/OrderStatusPage";

export default function PendingPage() {
  return <OrderStatusPage status="pending" title="Pending Orders" />;
}
