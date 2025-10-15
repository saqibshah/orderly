import { formatLocalDate } from "@/app/utils/formatLocalDate";
import { OrderStatus } from "@prisma/client";
import { Flex, Table, Text } from "@radix-ui/themes";

type Order = {
  id: number;
  tracking: string;
  trackingCompany: string;
  orderNumber: number;
  courierStatus: string;
  status: OrderStatus;
  customerName: string;
  address: string;
  productOrdered: string;
  orderAmount: number;
  orderDate: string | Date;
  updatedAt?: string | Date | null;
  remarks: string[];
};

interface Props {
  orders: Order[];
}

const TableBody = ({ orders }: Props) => {
  return (
    <Table.Body>
      {orders.map((order) => (
        <Table.Row key={order.id}>
          <Table.Cell>
            <Flex direction="column" gap="2">
              <Text>{order.tracking}</Text>
              <Text>{order.orderNumber}</Text>
            </Flex>
          </Table.Cell>
          <Table.Cell>{order.trackingCompany}</Table.Cell>
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
            {formatLocalDate(order.orderDate, "do MMM yyyy")}
          </Table.Cell>
          <Table.Cell>
            {order.updatedAt ? formatLocalDate(order.updatedAt) : ""}
          </Table.Cell>
          <Table.Cell>{order.remarks}</Table.Cell>
        </Table.Row>
      ))}
    </Table.Body>
  );
};

export default TableBody;
