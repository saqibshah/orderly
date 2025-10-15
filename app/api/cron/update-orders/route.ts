import { prisma } from "@/prisma/client";
import { OrderStatus } from "@prisma/client";
import axios from "axios";
import { NextResponse } from "next/server";

type CourierSuccessResult = {
  tracking: string;
  success: true;
  courierStatus: string;
};

type CourierErrorResult = {
  tracking: string;
  success: false;
  error: string;
  details: Record<string, string[]>; // e.g. { tracking_number: ["Invalid ID"] }
};

type CourierResult = CourierSuccessResult | CourierErrorResult;

export async function GET() {
  const pendingOrders = await prisma.order.findMany({
    where: { status: OrderStatus.PENDING },
    select: { id: true, tracking: true, trackingCompany: true },
  });

  if (pendingOrders.length === 0) {
    return NextResponse.json({ success: true, message: "No pending orders." });
  }

  // Split by courier
  const traxOrders = pendingOrders.filter(
    (o) => o.trackingCompany.toLowerCase() === "trax"
  );
  const postexOrders = pendingOrders.filter(
    (o) => o.trackingCompany.toLowerCase() === "postex"
  );

  const results: CourierResult[] = [];

  // ---- TRAX: single requests ----
  if (traxOrders.length > 0) {
    for (const order of traxOrders) {
      try {
        const { data } = await axios.get(process.env.TRAX_STATUS!, {
          headers: {
            Authorization: process.env.TRAX_API,
          },
          params: {
            tracking_number: order.tracking,
            type: 0,
          },
        });

        // 3. Check courier API status
        if (data.status === 0 && typeof data.current_status === "string") {
          let newStatus: OrderStatus | undefined = undefined;
          if (data.current_status === "Shipment - Delivered") {
            newStatus = OrderStatus.DELIVERED;
          }

          await prisma.order.update({
            where: { tracking: order.tracking },
            data: {
              courierStatus: data.current_status,
              status: newStatus,
            },
          });

          results.push({
            tracking: order.tracking,
            success: true,
            courierStatus: data.current_status,
          });
        } else {
          results.push({
            tracking: order.tracking,
            success: false,
            error: data.message || "Invalid courier response",
            details: data.errors || null,
          });
        }
      } catch (error) {
        console.error(`Courier API failed for order ${order.id}:`, error);
        results.push({
          tracking: order.tracking,
          success: false,
          error: "Invalid courier response",
          details: {}, // must provide something, even empty {}
        });
      }
    }
  }

  if (postexOrders.length > 0) {
    const trackingNumbers = postexOrders.map((o) => o.tracking).join(",");
    try {
      const { data } = await axios.get(process.env.POSTEX_BULK_TRACK!, {
        headers: {
          token: process.env.POSTEX_API!,
        },
        params: {
          TrackingNumbers: trackingNumbers,
        },
      });

      if (
        data.statusCode === "200" &&
        Array.isArray(data.dist) &&
        data.dist.length > 0
      ) {
        for (const item of data.dist) {
          const trackingNum = item.trackingNumber;
          const trackingData = item.trackingResponse;
          const courierStatus =
            trackingData?.transactionStatus || "Unknown Status";

          let newStatus: OrderStatus | undefined = undefined;
          if (data.current_status === "Delivered") {
            newStatus = OrderStatus.DELIVERED;
          }

          await prisma.order.update({
            where: { tracking: trackingNum },
            data: {
              courierStatus,
              status: newStatus,
            },
          });

          results.push({
            tracking: trackingNum,
            success: true,
            courierStatus,
          });
        }
      } else {
        results.push({
          tracking: "POSTEX_BULK",
          success: false,
          error: "Invalid PostEx response structure",
          details: data,
        });
      }
    } catch (error) {
      console.error("PostEx bulk API error:", error);
      results.push({
        tracking: "POSTEX_BULK",
        success: false,
        error: "PostEx bulk tracking failed",
        details: {},
      });
    }
  }

  return NextResponse.json({
    success: true,
    totalPending: pendingOrders.length,
    traxPending: traxOrders.length,
    postExPending: postexOrders.length,
    results,
  });
}
