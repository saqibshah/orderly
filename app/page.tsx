import { Container, Flex, Grid } from "@radix-ui/themes";
import AllTimeOrders from "./AllTimeOrders";
import TodaysOrders from "./TodaysOrders";
import CourierOrders from "./CourierOrders";

export default async function Home() {
  return (
    <Container mt="5" pb="5">
      <Grid columns={{ initial: "1", md: "2" }} gap="5">
        <Flex direction="column" gap="5">
          <TodaysOrders />
          <AllTimeOrders />
          <CourierOrders />
        </Flex>
      </Grid>
    </Container>
  );
}

export const dynamic = "force-dynamic";
