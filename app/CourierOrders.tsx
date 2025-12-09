import { prisma } from "@/prisma/client";
import { Flex, Heading } from "@radix-ui/themes";
import OrderSummary from "./OrderSummary";

type CourierStats = {
  all: number;
  pending: number;
  delivered: number;
  returned: number;
  cancelled: number;
};

type CourierMap = Record<string, CourierStats>;

const CourierOrders = async () => {
  const counts = await prisma.order.groupBy({
    by: ["trackingCompany", "status"],
    where: {
      orderDate: {
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // last 30 days including today
      },
    },
    _count: { _all: true },
  });

  const couriers = counts.reduce((acc, row) => {
    const courier = row.trackingCompany;

    if (!acc[courier]) {
      acc[courier] = {
        all: 0,
        pending: 0,
        delivered: 0,
        returned: 0,
        cancelled: 0,
      };
    }

    acc[courier].all += row._count._all;

    if (row.status === "PENDING") acc[courier].pending = row._count._all;
    if (row.status === "DELIVERED") acc[courier].delivered = row._count._all;
    if (row.status === "RETURNED") acc[courier].returned = row._count._all;
    if (row.status === "CANCELLED") acc[courier].cancelled = row._count._all;

    return acc;
  }, {} as CourierMap);

  return (
    <>
      {Object.entries(couriers).map(([courier, summary]) => (
        <Flex direction="column" gap="3" key={courier}>
          <Heading size="5">{courier} - 30 Days</Heading>
          <OrderSummary
            all={summary.all}
            pending={summary.pending}
            delivered={summary.delivered}
            returned={summary.returned}
            cancelled={summary.cancelled}
          />
        </Flex>
      ))}
    </>
  );
};

export default CourierOrders;
