import { NextRequest, NextResponse } from "next/server";
import { CustomerVehicle } from "@/data/vehicles";
import { MOCK_VEHICLES } from "@/data/mockData";
import { toCustomerVehicles } from "@/lib/vehicleMapper";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const prompt = (body.prompt || body.query || "").toLowerCase();
    const passengers = body.passengers ? Number(body.passengers) : undefined;
    const maxPrice = body.maxPrice ? Number(body.maxPrice) : undefined;
    const category = body.category ? String(body.category).toLowerCase() : undefined;

    const origin = request.nextUrl.origin;
    let fleet: CustomerVehicle[] = [];

    try {
      const res = await fetch(`${origin}/api/vehicles`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        fleet = toCustomerVehicles(data.vehicles || []);
      }
    } catch {
      fleet = [];
    }

    if (fleet.length === 0) {
      fleet = toCustomerVehicles(MOCK_VEHICLES);
    }

    const recommendations: Array<{ vehicle: CustomerVehicle; matchScore: number; reason: string }> = [];

    fleet.forEach((v) => {
      let score = 70;
      const reasons: string[] = [];

      // Check passengers count requirement
      if (passengers) {
        if (v.seats >= passengers) {
          score += 15;
          reasons.push(`Fits ${v.seats} passengers comfortably`);
        } else {
          score -= 30;
        }
      } else if (prompt.includes("family") || prompt.includes("4 people") || prompt.includes("5 people") || prompt.includes("group")) {
        if (v.seats >= 5) {
          score += 20;
          reasons.push(`Spacious 5-seater ideal for groups`);
        }
      }

      // Budget preference
      if (maxPrice) {
        if (v.pricePerDay <= maxPrice) {
          score += 15;
          reasons.push(`Within daily budget (£${v.pricePerDay}/day)`);
        } else {
          score -= 20;
        }
      } else if (prompt.includes("economical") || prompt.includes("cheap") || prompt.includes("budget")) {
        if (v.pricePerDay <= 100) {
          score += 25;
          reasons.push(`Budget-friendly rate (£${v.pricePerDay}/day)`);
        }
      } else if (prompt.includes("luxury") || prompt.includes("premium") || prompt.includes("sports")) {
        if (v.category.toLowerCase().includes("luxury") || v.category.toLowerCase().includes("sports")) {
          score += 25;
          reasons.push(`Premium luxury experience`);
        }
      }

      // Electric / Hybrid preference
      if (prompt.includes("electric") || prompt.includes("ev") || prompt.includes("tesla")) {
        if (v.fuelType === "Electric" || v.brand === "TESLA") {
          score += 30;
          reasons.push(`100% Electric EV with zero emissions`);
        }
      }

      // Category matching
      if (category && category !== "all") {
        if (v.category.toLowerCase().includes(category)) {
          score += 20;
          reasons.push(`Matches requested ${v.category} category`);
        }
      }

      if (reasons.length === 0) {
        reasons.push(`Reliable ${v.category} • Automatic • Highly rated (${v.rating}★)`);
      }

      recommendations.push({
        vehicle: v,
        matchScore: Math.min(Math.max(score, 50), 99),
        reason: reasons.join(" • "),
      });
    });

    // Sort by match score descending
    recommendations.sort((a, b) => b.matchScore - a.matchScore);

    return NextResponse.json({
      success: true,
      query: prompt || "Custom preferences",
      recommendations: recommendations.slice(0, 3),
    });
  } catch (error) {
    console.error("AI Recommendation API Error:", error);
    return NextResponse.json({ error: "Failed to generate AI vehicle recommendations" }, { status: 500 });
  }
}
