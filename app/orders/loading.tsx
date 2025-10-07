import React from "react";
import Sidebar from "./components/Sidebar";
import { Flex, Table } from "@radix-ui/themes";
import TableHeader from "./components/TableHeader";
import Skeleton from "../components/Skeleton";

const OrdersLoading = () => {
  const orders = [1, 2, 3, 4, 5];
  return (
    <div className="flex">
      <Sidebar />
      <div className="grow">
        <Table.Root variant="surface">
          <TableHeader />
          <Table.Body>
            {orders.map((order) => (
              <Table.Row key={order}>
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
                <Table.Cell>
                  <Flex direction="column" gap="2">
                    <Skeleton count={2} />
                  </Flex>
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
      </div>
    </div>
  );
};

export default OrdersLoading;
