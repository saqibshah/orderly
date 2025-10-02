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
      where: { tracking: body.fulfillments?.[0]?.tracking_number },
    });

    if (order)
      return NextResponse.json({ error: "Already exists" }, { status: 404 });

    // const newOrder = await prisma.order.create({
    //   data: {
    //     tracking: body.fulfillments?.[0]?.tracking_number || "N/A",
    //     orderNumber: body.order_number, // Shopify sends "order_number"
    //     customerName:
    //       body.customer?.first_name + " " + body.customer?.last_name,
    //     address: body.shipping_address
    //       ? `${body.shipping_address.address1}, ${body.shipping_address.city}, ${body.shipping_address.country}`
    //       : "N/A",
    //     productOrdered: body.line_items
    //       ?.map((item: any) => item.name)
    //       .join(", "),
    //     orderAmount: body.total_price ? parseFloat(body.total_price) : 0,
    //     orderDate: new Date(body.created_at),
    //     concludedAt: null,
    //     rawPayload: body,
    //   },
    // });

    const newOrder = await prisma.order.create({
      data: {
        tracking:
          body.fulfillments?.[0]?.tracking_number ??
          `NO_TRACK_${body.order_number}`,
        orderNumber: body.order_number,
        customerName: `${body.customer?.first_name ?? ""} ${
          body.customer?.last_name ?? ""
        }`.trim(),
        address: body.shipping_address?.address1 ?? "No address provided",
        productOrdered: body.line_items
          .map(
            (item: { name: string; quantity: number; price: number }) =>
              `${item.name} * ${item.quantity}`
          )
          .join(", "),
        orderAmount: parseFloat(body.total_price),
        orderDate: new Date(body.created_at),
        rawPayload: body,
      },
    });

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error("Shopify webhook error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process order" },
      { status: 500 }
    );
  }
}
