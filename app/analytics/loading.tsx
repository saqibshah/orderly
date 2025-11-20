import React from "react";
import { Container, Flex, Table, Text } from "@radix-ui/themes";
import Skeleton from "../components/Skeleton";
import AnalyticsFilter from "./AnalyticsFilter";

const OrdersLoading = () => {
  const sortedStats = [1, 2, 3, 4, 5];
  return (
    <Container mt="8">
      <AnalyticsFilter />
      <Text size="6" weight="bold">
        Analytics
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
