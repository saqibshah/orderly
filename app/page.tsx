import { prisma } from "@/prisma/client";
import { Container, Flex, Grid } from "@radix-ui/themes";
// import LatestIssues from './LatestIssues';
import OrderSummary from "./OrderSummary";

export default async function Home() {
  // const all = await prisma.order.count();
  // const pending = await prisma.order.count({
  //   where: { status: "PENDING" },
  // });
  // const delivered = await prisma.order.count({
  //   where: { status: "DELIVERED" },
  // });
  // const returned = await prisma.order.count({
  //   where: { status: "RETURNED" },
  // });
  // const cancelled = await prisma.order.count({
  //   where: { status: "CANCELLED" },
  // });

  const counts = await prisma.order.groupBy({
    by: ["status"],
    _count: { _all: true },
  });

  const all = counts.reduce((sum, c) => sum + c._count._all, 0);
  const pending = counts.find((c) => c.status === "PENDING")?._count._all ?? 0;
  const delivered =
    counts.find((c) => c.status === "DELIVERED")?._count._all ?? 0;
  const returned =
    counts.find((c) => c.status === "RETURNED")?._count._all ?? 0;
  const cancelled =
    counts.find((c) => c.status === "CANCELLED")?._count._all ?? 0;

  return (
    <Container className="mt-5">
      <Grid columns={{ initial: "1", md: "2" }} gap="5">
        <Flex direction="column" gap="5">
          <OrderSummary
            all={all}
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

export const dynamic = "force-dynamic";
