import Badge from "@/app/components/Badge";
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
  createdAt: string | Date;
  orderDate: string | Date;
  updatedAt?: string | Date | null;
  remarks: string[];
  syncedWithShopify?: boolean;
  courierDeliveryCharge: number;
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
              <Text>{order.trackingCompany}</Text>
            </Flex>
          </Table.Cell>
          <Table.Cell>
            <Flex direction="column" gap="2">
              <Text>{order.courierStatus}</Text>
              <Text>
                <Badge status={order.status} />
              </Text>
              <Text>{order.syncedWithShopify ? "Shopify - Synced" : ""}</Text>
            </Flex>
          </Table.Cell>
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
              <Text>Courier Charges: {order.courierDeliveryCharge}</Text>
            </Flex>
          </Table.Cell>

          <Table.Cell>
            <Flex direction="column" gap="2">
              <Text>
                Order At: {formatLocalDate(order.orderDate, "do MMM yyyy")}
              </Text>
              <Text>
                Fulfilled At: {formatLocalDate(order.createdAt, "do MMM yyyy")}
              </Text>
              <Text>
                Last Updated At:{" "}
                {order.updatedAt ? formatLocalDate(order.updatedAt) : ""}
              </Text>
            </Flex>
          </Table.Cell>
          {/* <Table.Cell>
            {order.updatedAt ? formatLocalDate(order.updatedAt) : ""}
          </Table.Cell> */}

          <Table.Cell>{order.remarks}</Table.Cell>
        </Table.Row>
      ))}
    </Table.Body>
  );
};

export default TableBody;
