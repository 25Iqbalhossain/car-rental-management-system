import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
import { MOCK_TRANSACTIONS } from "@/data/mockData";

export async function GET() {
  return NextResponse.json({ transactions: MOCK_TRANSACTIONS });
}
