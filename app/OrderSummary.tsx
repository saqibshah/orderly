import { Card, Flex, Text } from "@radix-ui/themes";
import Link from "next/link";

interface Props {
  pending: number;
  delivered: number;
  returned: number;
  cancelled: number;
}

const IssueSummary = ({ pending, delivered, returned, cancelled }: Props) => {
  const containers: {
    label: string;
    value: number;
    link: string;
  }[] = [
    { label: "Pending Orders", value: pending, link: "pending" },
    { label: "Delivered Orders", value: delivered, link: "delivered" },
    { label: "Returned Orders", value: returned, link: "returned" },
    { label: "Cancelled Orders", value: cancelled, link: "cancelled" },
  ];

  return (
    <Flex gap="4">
      {containers.map((container) => (
        <Card key={container.label}>
          <Flex direction="column" gap="1">
            <Link
              className="text-sm font-medium"
              href={`/orders/${container.link}`}
            >
              {container.label}
            </Link>
            <Text size="5" className="font-bold">
              {container.value}
            </Text>
          </Flex>
        </Card>
      ))}
    </Flex>
  );
};

export default IssueSummary;
