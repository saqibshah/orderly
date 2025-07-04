"use client";

import OrderStatusPage from "@/app/components/OrderStatusPage";

export default function CancelledPage() {
  return <OrderStatusPage status="cancelled" title="Cancelled Orders" />;
}
