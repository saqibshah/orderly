import React from "react";
import { Card, Container, Flex, Table, Text } from "@radix-ui/themes";
import Skeleton from "../components/Skeleton";
import AnalyticsFilter from "./AnalyticsFilter";

const OrdersLoading = () => {
  const sortedStats = [1, 2, 3, 4, 5];

  const containers: {
    label: string;
    value: number;
  }[] = [
    { label: "Ordered", value: 1 },
    { label: "Delivered", value: 1 },
    { label: "Returned", value: 1 },
    { label: "Pending", value: 1 },
    { label: "Revenue", value: 1 },
    { label: "Courier Charges", value: 1 },
  ];

  return (
    <Container mt="8">
      <AnalyticsFilter />
      <Text size="6" weight="bold">
        Analytics
      </Text>

      <Flex direction="column" gap="3" mt="3" width="80%">
        <Flex gap="2" justify="between">
          {containers.map((container) => (
            <Card key={container.label} style={{ flex: 1 }}>
              <Flex direction="column" gap="4" justify="between" height="100%">
                {container.label}
                <Text size="3" className="font-bold">
                  <Skeleton width="3rem" />
                </Text>
              </Flex>
            </Card>
          ))}
        </Flex>
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
            <Table.Row key={stats}>
              <Table.Cell>
                <Skeleton />
              </Table.Cell>
              <Table.Cell>
                <Skeleton />
              </Table.Cell>
              <Table.Cell>
                <Flex direction="column" gap="2">
                  <Skeleton count={2} />
                </Flex>
              </Table.Cell>
              <Table.Cell>
                <Skeleton />
              </Table.Cell>
              <Table.Cell>
                <Skeleton />
              </Table.Cell>
              <Table.Cell>
                <Skeleton />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Container>
  );
};

export default OrdersLoading;
