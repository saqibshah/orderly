// src/app/api/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json(); // parse JSON payload from webhook

    console.log("🔔 Webhook received:", body);

    // Optionally: validate signature here if coming from Shopify or other
    // Optionally: save to DB or queue

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ Error processing webhook:", err);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
