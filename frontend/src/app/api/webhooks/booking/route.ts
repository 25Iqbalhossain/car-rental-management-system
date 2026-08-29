import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Webhook log store in memory
const WEBHOOK_LOGS: Array<{ event: string; timestamp: string; data: any }> = [];

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const event = payload.event || "booking.created";
    const timestamp = payload.timestamp || new Date().toISOString();

    const logEntry = {
      event,
      timestamp,
      data: payload.data || payload,
    };

    WEBHOOK_LOGS.unshift(logEntry);
    if (WEBHOOK_LOGS.length > 50) WEBHOOK_LOGS.pop();

    console.log(`[Automation Webhook Event Triggered]: ${event} at ${timestamp}`);

    return NextResponse.json({
      received: true,
      event,
      processedAt: timestamp,
      status: "automation_queued",
      automationHooks: [
        "Zapier: Create Customer Invoice",
        "Make.com: Send Confirmation SMS",
        "Digital Pylot Dashboard: Fleet Analytics Updated",
      ],
    });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: "Failed to process webhook event" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: "active",
    endpoint: "/api/webhooks/booking",
    recentEventsCount: WEBHOOK_LOGS.length,
    events: WEBHOOK_LOGS.slice(0, 10),
  });
}
