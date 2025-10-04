import { prisma } from "@/prisma/client";
import { Flex, Table, Text } from "@radix-ui/themes";
import { format } from "date-fns";
import Sidebar from "./components/Sidebar";
import TableHeader from "./components/TableHeader";
import Pagination from "../components/Pagination";
import { PAGE_SIZE } from "../components/constants";

interface Props {
  searchParams: Promise<{ page: string }>;
}

const OrdersPage = async ({ searchParams }: Props) => {
  const params = await searchParams;
  const page = parseInt(params.page) || 1;
  const pageSize = PAGE_SIZE;

  const orders = await prisma.order.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  const ordersCount = await prisma.order.count();

  return (
    <div className="flex">
      <Sidebar />
      <div className="grow">
        <Table.Root variant="surface">
          <TableHeader />
          <Table.Body>
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
                    ? format(
                        new Date(order.concludedAt),
                        "do MMM yyyy, hh:mm a"
                      )
                    : ""}
                </Table.Cell>
                <Table.Cell>{order.remarks}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
        <Pagination
          pageSize={pageSize}
          currentPage={page}
          itemCount={ordersCount}
        />
      </div>
    </div>
  );
};

export default OrdersPage;
