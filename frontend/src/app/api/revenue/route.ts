import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
import { MOCK_REVENUE_DATA } from "@/data/mockData";

export async function GET(request: NextRequest) {
  const period = (request.nextUrl.searchParams.get("period") as "weekly" | "monthly" | "yearly") || "monthly";
  return NextResponse.json(MOCK_REVENUE_DATA[period] || MOCK_REVENUE_DATA.monthly);
}
