"use client";

import { Button, Flex, Popover } from "@radix-ui/themes";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DateRange, DayPicker } from "react-day-picker";

export default function AnalyticsFilter() {
  const router = useRouter();

  const [range, setRange] = useState<DateRange | undefined>();
  const [open, setOpen] = useState(false);

  const navigate = (duration: string) => {
    router.push(`/analytics/${duration}`);
  };

  const applyCustomRange = () => {
    if (range?.from && range?.to) {
      router.push(
        `/analytics/custom?start=${format(
          range.from,
          "yyyy-MM-dd"
        )}&end=${format(range.to, "yyyy-MM-dd")}`
      );
      setOpen(false);
    }
  };

  return (
    <Flex align="center" gap="3" mb="5" wrap="wrap">
      <Button onClick={() => navigate("this-month")}>This Month</Button>
      <Button onClick={() => navigate("last-month")}>Last Month</Button>
      <Button onClick={() => navigate("this-year")}>This Year</Button>
      <Button onClick={() => navigate("last-year")}>Last Year</Button>

      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger>
          <Button variant="soft">Custom Range</Button>
        </Popover.Trigger>
        <Popover.Content maxWidth="360px">
          <div className="mt-4">
            <DayPicker
              mode="range"
              selected={range}
              onSelect={setRange}
              pagedNavigation
              numberOfMonths={1}
              disabled={{ after: new Date() }}
              endMonth={new Date()}
            />
          </div>

          <Flex justify="end" gap="3" mt="4">
            <Button variant="soft" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={!range?.from || !range?.to}
              onClick={applyCustomRange}
            >
              Apply
            </Button>
          </Flex>
        </Popover.Content>
      </Popover.Root>
    </Flex>
  );
}
