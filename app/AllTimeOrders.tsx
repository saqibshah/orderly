import { prisma } from "@/prisma/client";
import { Flex, Heading } from "@radix-ui/themes";
import OrderSummary from "./OrderSummary";

const AllTimeOrders = async () => {
  const counts = await prisma.order.groupBy({
    by: ["status"],
    where: {
      orderDate: {
        gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1)), // last 1 year
      },
    },
    _count: { _all: true },
  });

  const all = counts.reduce((sum, c) => sum + c._count._all, 0);
  const pending = counts.find((c) => c.status === "PENDING")?._count._all ?? 0;
  const delivered =
    counts.find((c) => c.status === "DELIVERED")?._count._all ?? 0;
  const returned =
    counts.find((c) => c.status === "RETURNED")?._count._all ?? 0;
  const cancelled =
    counts.find((c) => c.status === "CANCELLED")?._count._all ?? 0;

  return (
    <Flex direction="column" gap="3">
      <Heading size="5">12 Months Orders</Heading>
      <OrderSummary
        all={all}
        pending={pending}
        delivered={delivered}
        returned={returned}
        cancelled={cancelled}
      />
    </Flex>
  );
};

export default AllTimeOrders;
