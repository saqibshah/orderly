// src/app/dashboard/page.tsx
export const dynamic = "force-dynamic";

import OrdersDashboard from "@/app/components/OrdersDashboard";

export default function DashboardPage() {
  // No data fetched here; client will use /api/orders?page=1&status=all
  return <OrdersDashboard />;
}
