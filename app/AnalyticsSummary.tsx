import { Card, Flex, Text } from "@radix-ui/themes";

interface Props {
  all: number;
  pending: number;
  delivered: number;
  returned: number;
  revenue: string;
}

const AnalyticsSummary = ({
  all,
  pending,
  delivered,
  returned,
  revenue,
}: Props) => {
  const containers: {
    label: string;
    value: string | number;
  }[] = [
    { label: "Ordered", value: all },
    { label: "Delivered", value: delivered },
    { label: "Returned", value: returned },
    { label: "Pending", value: pending },
    { label: "Revenue", value: revenue },
  ];

  return (
    <Flex gap="2" justify="between">
      {containers.map((container) => (
        <Card key={container.label} style={{ flex: 1 }}>
          <Flex direction="column" gap="4" justify="between" height="100%">
            {container.label}
            <Text size="3" className="font-bold">
              {container.value}
            </Text>
          </Flex>
        </Card>
      ))}
    </Flex>
  );
};

export default AnalyticsSummary;
