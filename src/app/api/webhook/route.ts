// src/app/api/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json(); // parse JSON payload from webhook

    // console.log("🔔 Webhook received:", body);

    console.log(body.current_total_price);
    console.log(body.updated_at);
    console.log(body.billing_address.address1);
    // console.log(body.line_items);

    body.line_items.forEach((element: { name: any; quantity: any }) => {
      console.log(element.name, element.quantity);
    });

    console.log(body.customer.first_name, body.customer.last_name);

    // Optionally: validate signature here if coming from Shopify or other
    // Optionally: save to DB or queue

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ Error processing webhook:", err);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
