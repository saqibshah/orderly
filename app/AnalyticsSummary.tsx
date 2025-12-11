import { Card, Flex, Text } from "@radix-ui/themes";

interface Props {
  all: number;
  pending: number;
  delivered: number;
  returned: number;
  revenue: string;
  deliveryCharges: string;
}

const AnalyticsSummary = ({
  all,
  pending,
  delivered,
  returned,
  revenue,
  deliveryCharges,
}: Props) => {
  // Helper to calculate percentages safely
  const percent = (value: number) => {
    if (!all || all === 0) return "0%";
    return ((value / all) * 100).toFixed(1) + "%";
  };

  const containers: {
    label: string;
    value: string | number;
    percentage?: string;
  }[] = [
    { label: "Ordered", value: all, percentage: "100%" },
    { label: "Delivered", value: delivered, percentage: percent(delivered) },
    { label: "Returned", value: returned, percentage: percent(returned) },
    { label: "Pending", value: pending, percentage: percent(pending) },
    { label: "Revenue", value: revenue },
    { label: "Courier Charges", value: deliveryCharges },
  ];

  return (
    <Flex gap="2" justify="between">
      {containers.map((c) => (
        <Card key={c.label} style={{ flex: 1 }}>
          <Flex direction="column" gap="2" justify="between" height="100%">
            <Text size="2" className="text-gray-600">
              {c.label}
            </Text>
            <Text size="3" className="font-bold">
              {c.value}
            </Text>

            {c.percentage && (
              <Text size="1" className="text-gray-500">
                {c.percentage}
              </Text>
            )}
          </Flex>
        </Card>
      ))}
    </Flex>
  );
};

export default AnalyticsSummary;
