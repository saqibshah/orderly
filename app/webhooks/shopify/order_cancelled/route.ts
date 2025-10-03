import { shopifyOrderSchema } from "@/app/validationSchema";
import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = shopifyOrderSchema.safeParse(body);

    if (!validation.success)
      return NextResponse.json(z.treeifyError(validation.error), {
        status: 400,
      });

    const order = await prisma.order.findUnique({
      where: { orderNumber: body.order_number },
    });

    if (!order)
      return NextResponse.json({ error: "Invalid Order" }, { status: 404 });

    const updateOrder = await prisma.order.update({
      where: { orderNumber: body.order_number },
      data: {
        status: "CANCELLED",
      },
    });

    return NextResponse.json(updateOrder, { status: 201 });
  } catch (error) {
    console.error("Shopify webhook error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process order" },
      { status: 500 }
    );
  }
}
