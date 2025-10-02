import { createOrderSchema } from "@/app/validationSchema";
import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = createOrderSchema.safeParse(body);

  if (!validation.success)
    return NextResponse.json(z.treeifyError(validation.error), { status: 400 });

  const order = await prisma.order.findUnique({
    where: { tracking: body.tracking },
  });

  if (order)
    return NextResponse.json({ error: "Already exists" }, { status: 404 });

  const newOrder = await prisma.order.create({
    data: {
      tracking: body.tracking,
      orderNumber: body.orderNumber,
      status: body.status ?? undefined, // fallback to Prisma default
      courierStatus: body.courierStatus ?? undefined, // fallback to Prisma default
      orderDate: new Date(body.orderDate),
      address: body.address,
      concludedAt: body.concludedAt ? new Date(body.concludedAt) : undefined,
      customerName: body.customerName,
      productOrdered: body.productOrdered,
      orderAmount: body.orderAmount,
      remarks: body.remarks ?? [], // default empty array
      rawPayload: body,
    },
  });

  return NextResponse.json(newOrder, { status: 201 });
}
