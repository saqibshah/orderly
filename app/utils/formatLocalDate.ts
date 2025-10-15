import { formatInTimeZone } from "date-fns-tz";

export function formatLocalDate(
  date: string | Date,
  pattern = "do MMM yyyy, hh:mm a"
) {
  const d = typeof date === "string" ? new Date(date) : date;
  return formatInTimeZone(d, "Asia/Karachi", pattern);
}
