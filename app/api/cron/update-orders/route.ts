import { prisma } from "@/prisma/client";
import { OrderStatus } from "@prisma/client";
import axios from "axios";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 1. Get all pending orders from DB
    const pendingOrders = await prisma.order.findMany({
      where: { status: OrderStatus.PENDING },
      select: { id: true, tracking: true },
    });

    if (pendingOrders.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No pending orders.",
      });
    }

    const results: any[] = [];

    // 2. Loop through each pending order
    for (const order of pendingOrders) {
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
        });
      }
    }

    // 4. Return summary
    return NextResponse.json({
      success: true,
      checked: pendingOrders.length,
      results,
    });
  } catch (error) {
    console.log(error);
  }
}
