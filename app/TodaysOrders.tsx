import { prisma } from "@/prisma/client";
import { Card, Flex, Heading, Text } from "@radix-ui/themes";
import { formatLocalDate } from "./utils/formatLocalDate";
import Link from "next/link";

const TodaysOrders = async () => {
  const todayPK = formatLocalDate(new Date(), "yyyy-MM-dd");

  // Convert that date to UTC start and end of day boundaries
  const startOfDayPK = new Date(`${todayPK}T00:00:00+05:00`);
  const endOfDayPK = new Date(`${todayPK}T23:59:59.999+05:00`);

  // --- 1️⃣ Pending + Cancelled (created today)
  const createdCounts = await prisma.order.groupBy({
    by: ["status"],
    where: {
      status: { in: ["PENDING", "CANCELLED"] },
      createdAt: {
        gte: startOfDayPK,
        lte: endOfDayPK,
      },
    },
    _count: { _all: true },
  });

  // --- 2️⃣ Delivered + Returned (updated today)
  const updatedCounts = await prisma.order.groupBy({
    by: ["status"],
    where: {
      status: { in: ["DELIVERED", "RETURNED"] },
      updatedAt: {
        gte: startOfDayPK,
        lte: endOfDayPK,
      },
    },
    _count: { _all: true },
  });

  // --- 3️⃣ Merge results
  const allCounts = [...createdCounts, ...updatedCounts];

  // --- 4️⃣ Totals
  const all = allCounts.reduce((sum, c) => sum + c._count._all, 0);
  const pending =
    allCounts.find((c) => c.status === "PENDING")?._count._all ?? 0;
  const delivered =
    allCounts.find((c) => c.status === "DELIVERED")?._count._all ?? 0;
  const returned =
    allCounts.find((c) => c.status === "RETURNED")?._count._all ?? 0;
  const cancelled =
    allCounts.find((c) => c.status === "CANCELLED")?._count._all ?? 0;

  const containers = [
    { label: "Today's Orders", value: pending, link: "pending" },
    { label: "Delivered Orders", value: delivered, link: "delivered" },
    { label: "Returned Orders", value: returned, link: "returned" },
    { label: "Cancelled Orders", value: cancelled, link: "cancelled" },
  ];

  return (
    <>
      <Heading>Today's Orders</Heading>
      <Flex gap="4">
        {containers.map((container) => (
          <Card key={container.label}>
            <Flex direction="column" gap="1">
              <Link
                className="text-sm font-medium"
                href={`/orders/${container.link}`}
              >
                {container.label}
              </Link>
              <Text size="5" className="font-bold">
                {container.value}
              </Text>
            </Flex>
          </Card>
        ))}
      </Flex>
    </>
  );
};

export default TodaysOrders;
