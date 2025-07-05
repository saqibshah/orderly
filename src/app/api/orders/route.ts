import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ITEMS_PER_PAGE } from "@/config";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || undefined;
  const q = searchParams.get("q")?.trim() || undefined;
  const page = parseInt(searchParams.get("page") || "1", 10);
  const take = ITEMS_PER_PAGE;
  const skip = (page - 1) * take;

  const where: Record<string, any> = {};
  if (status && status !== "all") where.status = status;
  if (q) {
    where.OR = [
      { customerName: { contains: q, mode: "insensitive" } },
      { trackingNumber: { contains: q } },
      { productInfo: { contains: q, mode: "insensitive" } },
    ];
  }

  const [total, items] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.findMany({
      where,
      orderBy: { date: "desc" },
      skip,
      take,
    }),
  ]);

  return NextResponse.json({ total, items });
}
