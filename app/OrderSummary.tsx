import { Card, Flex, Text } from "@radix-ui/themes";
import Link from "next/link";

interface Props {
  all: number;
  pending: number;
  delivered: number;
  returned: number;
  cancelled: number;
}

const IssueSummary = ({
  all,
  pending,
  delivered,
  returned,
  cancelled,
}: Props) => {
  const deliveredPercentage =
    all > 0 ? ((delivered / all) * 100).toFixed(2) : "0";

  const containers: {
    label: string;
    value: number;
    extra?: string;
    link: string;
  }[] = [
    { label: "All Orders", value: all, link: "" },
    { label: "Pending Orders", value: pending, link: "pending" },
    {
      label: "Delivered Orders",
      value: delivered,
      extra: `${deliveredPercentage}%`,
      link: "delivered",
    },
    { label: "Returned Orders", value: returned, link: "returned" },
    { label: "Cancelled Orders", value: cancelled, link: "cancelled" },
  ];

  return (
    <Flex gap="2" justify="between">
      {containers.map((container) => (
        <Card key={container.label} className="w-26">
          <Flex direction="column" gap="1" justify="between" height="100%">
            <Link
              className="text-sm font-medium"
              href={`/orders/${container.link}`}
            >
              {container.label}
            </Link>
            {container.extra && <Text size="2">{container.extra}</Text>}
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
