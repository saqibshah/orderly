import { PAGE_SIZE } from "@/app/components/constants";
import Pagination from "@/app/components/Pagination";
import { prisma } from "@/prisma/client";
import { OrderStatus } from "@prisma/client";
import { Table } from "@radix-ui/themes";
import Sidebar from "../components/Sidebar";
import TableBody from "../components/TableBody";
import TableHeader from "../components/TableHeader";

interface Props {
  searchParams: Promise<{ page: string }>;
}

const PendingOrders = async ({ searchParams }: Props) => {
  const where = { status: OrderStatus.PENDING };

  const params = await searchParams;
  const page = parseInt(params.page) || 1;
  const pageSize = PAGE_SIZE;

  const orders = await prisma.order.findMany({
    where,
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: { updatedAt: "desc" },
  });

  const ordersCount = await prisma.order.count({ where });

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

export default PendingOrders;
