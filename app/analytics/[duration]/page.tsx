// app/analytics/[duration]/page.tsx
import { prisma } from "@/prisma/client";
import { Container, Flex, Table, Text } from "@radix-ui/themes";
import { getDateRange } from "@/app/lib/getDateRange";
import AnalyticsFilter from "../AnalyticsFilter";

interface Props {
  params: { duration: string };
  searchParams: Record<string, string>;
}

const AnalyticsPage = async ({ params, searchParams }: Props) => {
  // -------------------------
  // DEFAULT = this-month
  // -------------------------
  const duration = (await params).duration ?? "this-month";

  // Get date range
  const { start, end } = getDateRange(duration, searchParams);

  // Format heading date
  const monthName = start.toLocaleString("en-US", { month: "long" });
  const year = start.getFullYear();

  // Fetch all items within date range
  const items = await prisma.orderItem.findMany({
    where: {
      order: {
        orderDate: {
          gte: start,
          lte: end,
        },
      },
    },
    select: {
      productName: true,
      quantity: true,
      price: true,
      discount: true,
      order: { select: { status: true } },
    },
  });

  // Aggregate per product
  const productStats: Record<
    string,
    {
      ordered: number;
      delivered: number;
      returned: number;
      pending: number;
      revenue: number;
    }
  > = {};

  items.forEach((item) => {
    const stats = productStats[item.productName] || {
      ordered: 0,
      delivered: 0,
      returned: 0,
      pending: 0,
      revenue: 0,
    };

    stats.ordered += item.quantity;

    switch (item.order.status) {
      case "DELIVERED":
        stats.delivered += item.quantity;
        stats.revenue += item.price * item.quantity - item.discount;
        break;

      case "CANCELLED":
      case "RETURNED":
        stats.returned += item.quantity;
        break;

      case "PENDING":
        stats.pending += item.quantity;
        break;
    }

    productStats[item.productName] = stats;
  });

  const sortedStats = Object.entries(productStats)
    .map(([productName, stats]) => {
      const deliveryPercentage = stats.ordered
        ? ((stats.delivered / stats.ordered) * 100).toFixed(2)
        : "0.00";

      const formattedRevenue = stats.revenue.toLocaleString("en-US", {
        style: "currency",
        currency: "PKR",
        minimumFractionDigits: 2,
      });

      return {
        productName,
        ...stats,
        deliveryPercentage: `${deliveryPercentage}%`,
        formattedRevenue,
      };
    })
    .sort((a, b) => b.revenue - a.revenue);

  return (
    <Container mt="8">
      <AnalyticsFilter />
      {/* ------------------------------ */}
      {/* Dynamic Heading w/ Month + Year */}
      {/* ------------------------------ */}
      <Text size="6" weight="bold">
        Analytics — {duration.replace("-", " ").toUpperCase()} ({monthName}{" "}
        {year})
      </Text>

      <Table.Root variant="surface" mt="4">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Product</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Ordered</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Delivered</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Returned</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Pending</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Revenue</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {sortedStats.map((stats) => (
            <Table.Row key={stats.productName}>
              <Table.Cell>{stats.productName}</Table.Cell>
              <Table.Cell>{stats.ordered}</Table.Cell>

              <Table.Cell>
                <Flex direction="column" gap="2">
                  <Text>{stats.delivered}</Text>
                  <Text>{stats.deliveryPercentage}</Text>
                </Flex>
              </Table.Cell>

              <Table.Cell>{stats.returned}</Table.Cell>
              <Table.Cell>{stats.pending}</Table.Cell>
              <Table.Cell>{stats.formattedRevenue}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Container>
  );
};

export const dynamic = "force-dynamic";
export default AnalyticsPage;
