export const dynamic = "force-dynamic";

import OrderStatusPage from "@/app/components/OrderStatusPage";

export default function CancelledPage() {
  return <OrderStatusPage status="cancelled" title="Cancelled Orders" />;
}
