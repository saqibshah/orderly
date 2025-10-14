import { prisma } from "@/prisma/client";
import { Table } from "@radix-ui/themes";
import Pagination from "../components/Pagination";
import { PAGE_SIZE } from "../components/constants";
import Sidebar from "./components/Sidebar";
import TableBody from "./components/TableBody";
import TableHeader from "./components/TableHeader";
import { orderSelect } from "../lib/prismaSelects";

interface Props {
  searchParams: Promise<{ page: string }>;
}

const OrdersPage = async ({ searchParams }: Props) => {
  const params = await searchParams;
  const page = parseInt(params.page) || 1;
  const pageSize = PAGE_SIZE;

  const orders = await prisma.order.findMany({
    select: orderSelect,
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: { orderDate: "desc" },
  });

  const ordersCount = await prisma.order.count();

  return (
    <div className="flex">
      <Sidebar />
      <div className="grow">
        <Table.Root variant="surface">
          <TableHeader />
          <TableBody orders={orders} />
        </Table.Root>
        <Pagination
          pageSize={pageSize}
          currentPage={page}
          itemCount={ordersCount}
        />
      </div>
    </div>
  );
};

export const dynamic = "force-dynamic";

export default OrdersPage;
