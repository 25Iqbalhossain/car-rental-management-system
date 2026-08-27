import { NextResponse } from "next/server";
import { TESTIMONIALS } from "@/data/testimonials";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    source: "Testimonials API",
    total: TESTIMONIALS.length,
    testimonials: TESTIMONIALS,
  });
}
