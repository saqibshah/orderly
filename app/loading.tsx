import { Card, Container, Flex, Grid, Heading, Text } from "@radix-ui/themes";
import Skeleton from "@/app/components/Skeleton";
import React from "react";
import Link from "next/link";

const LoadingHome = () => {
  const todaysContainers = [
    { label: "Fulfilled Orders", value: 1, link: "pending" },
    { label: "Delivered Orders", value: 1, link: "delivered" },
    { label: "Returned Orders", value: 1, link: "returned" },
    { label: "Cancelled Orders", value: 1, link: "cancelled" },
  ];

  const containers = [
    { label: "All Orders", value: 1, link: "" },
    { label: "Pending Orders", value: 1, link: "pending" },
    { label: "Delivered Orders", value: 1, link: "delivered" },
    { label: "Returned Orders", value: 1, link: "returned" },
    { label: "Cancelled Orders", value: 1, link: "cancelled" },
  ];

  return (
    <Container className="mt-5">
      <Grid columns={{ initial: "1", md: "2" }} gap="5">
        <Flex direction="column" gap="3">
          <Heading size="5">Today&apos;s Orders</Heading>
          <Flex gap="4">
            {todaysContainers.map((container) => (
              <Card key={container.label}>
                <Flex direction="column" gap="1">
                  <Link
                    className="text-sm font-medium"
                    href={`/orders/${container.link}`}
                  >
                    {container.label}
                  </Link>
                  <Text size="5" className="font-bold">
                    <Skeleton width="3rem" />
                  </Text>
                </Flex>
              </Card>
            ))}
          </Flex>

          <Heading size="5">All Orders</Heading>
          <Flex gap="2" justify="between">
            {containers.map((container) => (
              <Card key={container.label} className="w-26">
                <Flex
                  direction="column"
                  gap="1"
                  justify="between"
                  height="100%"
                >
                  <Link
                    className="text-sm font-medium"
                    href={`/orders/${container.link}`}
                  >
                    {container.label}
                  </Link>
                  <Text size="5" className="font-bold">
                    <Skeleton width="3rem" />
                  </Text>
                </Flex>
              </Card>
            ))}
          </Flex>

          <Heading size="5">
            <Skeleton width="7rem" />
          </Heading>
          <Flex gap="2" justify="between">
            {containers.map((container) => (
              <Card key={container.label} className="w-26">
                <Flex
                  direction="column"
                  gap="1"
                  justify="between"
                  height="100%"
                >
                  <Link
                    className="text-sm font-medium"
                    href={`/orders/${container.link}`}
                  >
                    {container.label}
                  </Link>
                  <Text size="5" className="font-bold">
                    <Skeleton width="3rem" />
                  </Text>
                </Flex>
              </Card>
            ))}
          </Flex>

          <Heading size="5">
            <Skeleton width="7rem" />
          </Heading>
          <Flex gap="2" justify="between">
            {containers.map((container) => (
              <Card key={container.label} className="w-26">
                <Flex
                  direction="column"
                  gap="1"
                  justify="between"
                  height="100%"
                >
                  <Link
                    className="text-sm font-medium"
                    href={`/orders/${container.link}`}
                  >
                    {container.label}
                  </Link>
                  <Text size="5" className="font-bold">
                    <Skeleton width="3rem" />
                  </Text>
                </Flex>
              </Card>
            ))}
          </Flex>
        </Flex>
      </Grid>
    </Container>
  );
};

export default LoadingHome;
