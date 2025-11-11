// app/analytics/DailyProductAnalytics.tsx
import { prisma } from "@/prisma/client";
import React from "react";
import { Container, Flex, Table, Text } from "@radix-ui/themes";

const DailyProductAnalytics = async () => {
  // Fetch all order items for today
  const items = await prisma.orderItem.findMany({
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

  // Convert object to array, add delivery % and formatted revenue, then sort by ordered descending
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
    .sort((a, b) => b.ordered - a.ordered);

  return (
    <Container mt="8">
      <Table.Root variant="surface">
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

export default DailyProductAnalytics;
