import { Container, Flex, Grid } from "@radix-ui/themes";
import AllTimeOrders from "./AllTimeOrders";
import TodaysOrders from "./TodaysOrders";

export default async function Home() {
  return (
    <Container className="mt-5">
      <Grid columns={{ initial: "1", md: "2" }} gap="5">
        <Flex direction="column" gap="5">
          <TodaysOrders />
          <AllTimeOrders />
        </Flex>
      </Grid>
    </Container>
  );
}

export const dynamic = "force-dynamic";
