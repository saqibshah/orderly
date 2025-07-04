import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const orders = await prisma.order.findMany();
  return Response.json(orders);
}
