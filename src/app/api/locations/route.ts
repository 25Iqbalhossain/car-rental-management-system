import { NextResponse } from "next/server";
import { MOCK_LOCATIONS } from "@/data/mockData";
import { LOCATIONS } from "@/data/locations";

export const dynamic = "force-dynamic";

export async function GET() {
  const locations = MOCK_LOCATIONS?.length ? MOCK_LOCATIONS : LOCATIONS;
  return NextResponse.json({
    source: "Locations API",
    total: locations.length,
    locations,
  });
}

