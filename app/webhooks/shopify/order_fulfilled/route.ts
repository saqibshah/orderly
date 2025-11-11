import { shopifyOrderSchema } from "@/app/validationSchema";
import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import * as Sentry from "@sentry/nextjs";

type DiscountAllocation = {
  amount: string;
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = shopifyOrderSchema.safeParse(body);

    if (!validation.success) {
      console.log(JSON.stringify(validation.error, null, 2));

      Sentry.captureException(new Error("Shopify webhook validation failed"), {
        extra: {
          validationErrors: z.treeifyError(validation.error),
          requestPreview: JSON.stringify(body).slice(0, 500), // renamed key
        },
      });

      return NextResponse.json(z.treeifyError(validation.error), {
        status: 400,
      });
    }

    const order = await prisma.order.findUnique({
      where: { tracking: body.fulfillments?.[0]?.tracking_number },
    });

    if (order) {
      Sentry.captureException(new Error("Shopify webhook validation failed"), {
        extra: {
          errors: "Already Exists",
        },
      });

      return NextResponse.json({ error: "Already exists" }, { status: 404 });
    }

    const newOrder = await prisma.order.create({
      data: {
        orderNumber: body.order_number,
        tracking:
          body.fulfillments?.[0]?.tracking_number ??
          `NO_TRACK_${body.order_number}`,
        trackingCompany:
          body.fulfillments?.[0]?.tracking_company ?? "NO_COMPANY",
        customerName:
          body.customer?.first_name || body.customer?.last_name
            ? `${body.customer?.first_name ?? ""} ${
                body.customer?.last_name ?? ""
              }`.trim()
            : "No Name",
        address: body.shipping_address?.address1 ?? "No address provided",
        productOrdered: body.line_items
          .map(
            (item: { name: string; quantity: number }) =>
              `${item.name} * ${item.quantity}`
          )
          .join(", "),
        orderAmount: parseFloat(body.total_price),
        orderDate: new Date(body.created_at),
        // rawPayload: body,

        // Nested create for related payload
        rawPayload: {
          create: {
            data: body,
          },
        },

        // Nested create for order items
        items: {
          create: body.line_items.map(
            (item: {
              name: string;
              quantity: number;
              price: string;
              discount_allocations?: DiscountAllocation[];
            }) => ({
              productName: item.name,
              quantity: item.quantity,
              price: parseFloat(item.price),
              discount: item.discount_allocations
                ? item.discount_allocations.reduce(
                    (sum, d) => sum + parseFloat(d.amount),
                    0
                  )
                : 0,
            })
          ),
        },
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
