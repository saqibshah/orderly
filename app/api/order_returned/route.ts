import { verifyReturnSchema } from "@/app/validationSchema";
import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = verifyReturnSchema.safeParse(body);

  if (!validation.success)
    return NextResponse.json(z.treeifyError(validation.error), { status: 400 });

  const order = await prisma.order.findUnique({
    where: { tracking: body.tracking },
  });

  if (!order)
    return NextResponse.json({ error: "Invalid order" }, { status: 404 });

  const updatedOrder = await prisma.order.update({
    where: { tracking: body.tracking },
    data: {
      status: "RETURNED",
    },
  });

  return NextResponse.json(updatedOrder);
}
