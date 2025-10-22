import { OrderStatus } from "@prisma/client";
import { Badge } from "@radix-ui/themes";

const statusMap: Record<
  OrderStatus,
  { label: string; color: "yellow" | "green" | "blue" | "red" }
> = {
  PENDING: { label: "PENDING", color: "yellow" },
  DELIVERED: { label: "DELIVERED", color: "green" },
  RETURNED: { label: "RETURNED", color: "blue" },
  CANCELLED: { label: "CANCELLED", color: "red" },
};

const StatusBadge = ({ status }: { status: OrderStatus }) => {
  return (
    <Badge color={statusMap[status].color}>{statusMap[status].label}</Badge>
  );
};

export default StatusBadge;
