// app/analytics/[duration]/page.tsx
import AnalyticsSummary from "@/app/AnalyticsSummary";
import { getDateRange } from "@/app/lib/getDateRange";
import { prisma } from "@/prisma/client";
import { Container, Flex, Table, Text } from "@radix-ui/themes";
import AnalyticsFilter from "../AnalyticsFilter";
import { OrderStatus } from "@prisma/client";

interface Props {
  params: { duration: string };
  searchParams: Record<string, string>;
}

const AnalyticsPage = async ({ params, searchParams }: Props) => {
  // ----------------------------
  // Duration (default = this-month)
  // ----------------------------
  const duration = (await params).duration ?? "this-month";

  // Date range helper
  const { start, end } = getDateRange(duration, searchParams);

  const monthName = start.toLocaleString("en-US", { month: "long" });
  const year = start.getFullYear();

  // -----------------------------------------------------
  // Get all items inside date-range (single DB call)
  // -----------------------------------------------------
  const items = await prisma.orderItem.findMany({
    where: {
      order: {
        orderDate: { gte: start, lte: end },
      },
    },
    select: {
      productName: true,
      quantity: true,
      price: true,
      discount: true,
      order: {
        select: {
          status: true,
          courierDeliveryCharge: true,
        },
      },
    },
  });

  // -----------------------------------------------------
  // Aggregate Stats Per Product
  // -----------------------------------------------------
  type ProductStats = {
    ordered: number;
    delivered: number;
    returned: number;
    pending: number;
    revenue: number;
    deliveryCharges: number;
  };

  const productStats: Record<string, ProductStats> = {};

  for (const item of items) {
    if (!productStats[item.productName]) {
      productStats[item.productName] = {
        ordered: 0,
        delivered: 0,
        returned: 0,
        pending: 0,
        revenue: 0,
        deliveryCharges: 0,
      };
    }

    const stats = productStats[item.productName];

    stats.ordered += item.quantity;

    const charge = item.order.courierDeliveryCharge ?? 0;

    switch (item.order.status) {
      case OrderStatus.DELIVERED:
        stats.delivered += item.quantity;
        stats.revenue += item.price * item.quantity - item.discount;
        stats.deliveryCharges += charge;
        break;

      case OrderStatus.RETURNED:
      case OrderStatus.CANCELLED:
        stats.returned += item.quantity;
        stats.deliveryCharges += charge;
        break;

      case OrderStatus.PENDING:
        stats.pending += item.quantity;
        stats.deliveryCharges += charge;
        break;
    }
  }

  // -----------------------------------------------------
  // Convert -> Array + computed fields + sort by revenue
  // -----------------------------------------------------
  const sortedStats = Object.entries(productStats)
    .map(([productName, stats]) => {
      const deliveryPercentage = stats.ordered
        ? ((stats.delivered / stats.ordered) * 100).toFixed(2)
        : "0.00";

      return {
        productName,
        ...stats,
        deliveryPercentage: `${deliveryPercentage}%`,
        formattedRevenue: stats.revenue.toLocaleString("en-US", {
          style: "currency",
          currency: "PKR",
        }),
        formattedDeliveryCharges: stats.deliveryCharges.toLocaleString("en-US"),
      };
    })
    .sort((a, b) => b.revenue - a.revenue);

  // -----------------------------------------------------
  // TOTALS (across all products)
  // -----------------------------------------------------
  const totals = sortedStats.reduce(
    (acc, item) => ({
      ordered: acc.ordered + item.ordered,
      delivered: acc.delivered + item.delivered,
      returned: acc.returned + item.returned,
      pending: acc.pending + item.pending,
      revenue: acc.revenue + item.revenue,
      deliveryCharges: acc.deliveryCharges + item.deliveryCharges,
    }),
    {
      ordered: 0,
      delivered: 0,
      returned: 0,
      pending: 0,
      revenue: 0,
      deliveryCharges: 0,
    }
  );

  const totalFormattedRevenue = totals.revenue.toLocaleString("en-US");
  const totalFormattedDeliveryCharges =
    totals.deliveryCharges.toLocaleString("en-US");

  // -----------------------------------------------------
  // RENDER
  // -----------------------------------------------------
  return (
    <Container mt="8">
      <AnalyticsFilter />

      <Text size="6" weight="bold">
        Analytics — {duration.replace("-", " ").toUpperCase()} ({monthName}{" "}
        {year})
      </Text>

      <Flex direction="column" gap="3" mt="3" width="80%">
        <AnalyticsSummary
          all={totals.ordered}
          pending={totals.pending}
          delivered={totals.delivered}
          returned={totals.returned}
          revenue={totalFormattedRevenue}
          deliveryCharges={totalFormattedDeliveryCharges}
        />
      </Flex>

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
