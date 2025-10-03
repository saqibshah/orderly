import { prisma } from "@/prisma/client";
import { Flex, Table, Text } from "@radix-ui/themes";
import { format } from "date-fns";
import React from "react";

const PendingOrders = async () => {
  const orders = await prisma.order.findMany({
    where: { status: "PENDING" },
  });

  return (
    <>
      {orders.map((order) => (
        <Table.Row key={order.id}>
          <Table.Cell>
            <Flex direction="column" gap="2">
              <Text>{order.tracking}</Text>
              <Text>{order.orderNumber}</Text>
            </Flex>
          </Table.Cell>
          <Table.Cell>{order.courierStatus}</Table.Cell>
          <Table.Cell>{order.status}</Table.Cell>
          <Table.Cell>
            <Flex direction="column" gap="2">
              <Text>{order.customerName}</Text>
              <Text>{order.address}</Text>
            </Flex>
          </Table.Cell>
          <Table.Cell>
            <Flex direction="column" gap="2">
              <Text>{order.productOrdered}</Text>
              <Text>{order.orderAmount}</Text>
            </Flex>
          </Table.Cell>
          <Table.Cell>
            {format(new Date(order.orderDate), "do MMM yyyy")}
          </Table.Cell>
          <Table.Cell>
            {order.concludedAt
              ? format(new Date(order.concludedAt), "do MMM yyyy, hh:mm a")
              : ""}
          </Table.Cell>
          <Table.Cell>{order.remarks}</Table.Cell>
        </Table.Row>
      ))}
    </>
  );
};

export default PendingOrders;
