import { prisma } from "@/prisma/client";
import { Container, Flex, Grid } from "@radix-ui/themes";
// import LatestIssues from './LatestIssues';
import OrderSummary from "./OrderSummary";

export default async function Home() {
  const pending = await prisma.order.count({
    where: { status: "PENDING" },
  });
  const delivered = await prisma.order.count({
    where: { status: "DELIVERED" },
  });
  const returned = await prisma.order.count({
    where: { status: "RETURNED" },
  });
  const cancelled = await prisma.order.count({
    where: { status: "CANCELLED" },
  });

  return (
    <Container className="mt-5">
      <Grid columns={{ initial: "1", md: "2" }} gap="5">
        <Flex direction="column" gap="5">
          <OrderSummary
            pending={pending}
            delivered={delivered}
            returned={returned}
            cancelled={cancelled}
          />
        </Flex>
      </Grid>
    </Container>
  );
}
