export const dynamic = "force-dynamic";

import OrderStatusPage from "@/app/components/OrderStatusPage";

export default function ReturnedPage() {
  return <OrderStatusPage status="returned" title="Returned Orders" />;
}
