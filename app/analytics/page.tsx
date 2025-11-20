import { redirect } from "next/navigation";

export default function AnalyticsIndex() {
  redirect("/analytics/this-month");
}
