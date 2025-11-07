import { NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { markOrderAsPaidOnShopify } from "@/app/lib/shopifySync.js";

export const dynamic = "force-dynamic"; // ensures it always runs fresh

export async function GET() {
  const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

  if (!SHOPIFY_ACCESS_TOKEN) {
    return NextResponse.json(
      { error: "Missing Shopify access token" },
      { status: 500 }
    );
  }

  try {
    // Get all delivered orders not yet synced with Shopify
    const orders = await prisma.order.findMany({
      where: {
        status: "DELIVERED",
        syncedWithShopify: false,
      },
      select: {
        id: true,
        orderNumber: true,
        rawPayload: true,
      },
      orderBy: { orderDate: "desc" },
    });

    if (!orders.length) {
      return NextResponse.json({ message: "No orders to sync" });
    }

    const results = [];

    for (const order of orders) {
      const shopifyOrderId =
        order.rawPayload?.data?.admin_graphql_api_id ||
        `gid://shopify/Order/${order.rawPayload?.data?.id}`;
      try {
        const syncedOrder = await markOrderAsPaidOnShopify(
          shopifyOrderId,
          SHOPIFY_ACCESS_TOKEN
        );

        if (syncedOrder) {
          await prisma.order.update({
            where: { id: order.id },
            data: {
              syncedWithShopify: true,
              shopifySyncStatus: "DELIVERED",
              shopifyLastSyncAt: new Date(),
            },
          });

          results.push({
            orderNumber: order.orderNumber,
            shopifyOrder: syncedOrder.name,
            status: "Synced",
          });
        }
      } catch (err) {
        results.push({
          orderNumber: order.orderNumber,
          error: err.message,
        });
      }
    }

    return NextResponse.json({
      message: "Sync complete",
      results,
    });
  } catch (err) {
    console.error("Sync error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
