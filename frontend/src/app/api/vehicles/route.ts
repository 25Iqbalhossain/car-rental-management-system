import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
import { Vehicle } from "@/types/dashboard";
import { getVehicleModels } from "@/services/nhtsaApi";
import { MOCK_VEHICLES } from "@/data/mockData";

const VEHICLE_IMAGES = [
  "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=400",
];

const POPULAR_MAKES = ["TESLA", "PORSCHE", "HONDA", "BMW"];

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const requestedBrand = searchParams.get("brand");
  const searchQuery = searchParams.get("search")?.toLowerCase() || "";

  try {
    const vehicles: Vehicle[] = [];
    const makesToFetch = requestedBrand ? [requestedBrand] : POPULAR_MAKES;

    for (let idx = 0; idx < makesToFetch.length; idx++) {
      const brand = makesToFetch[idx];
      try {
        const models = await Promise.race([
          getVehicleModels(brand, "2024"),
          new Promise<any[]>((_, reject) => setTimeout(() => reject(new Error("Timeout")), 1500))
        ]);
        const topModels = (models || []).slice(0, 2);

        topModels.forEach((m, mIdx) => {
          const modelName = m.Model_Name;
          const fullName = `${brand} ${modelName}`;
          const isSuv = modelName.toLowerCase().includes("suv") || modelName.toLowerCase().includes("x") || modelName.toLowerCase().includes("y");
          const isCoupe = modelName.toLowerCase().includes("911") || modelName.toLowerCase().includes("coupe") || modelName.toLowerCase().includes("r8");

          const category = isSuv ? "Luxury SUV" : isCoupe ? "Sports Coupe" : "Sedan";
          const dailyRate = Math.floor(180 + ((mIdx + idx) * 35) % 250);
          const bookingsCount = Math.floor(50 + ((mIdx + idx) * 123) % 400);

          vehicles.push({
            id: `nhtsa-${m.Model_ID || `${brand}-${mIdx}`}`,
            name: fullName,
            brand: brand,
            category,
            dailyRate,
            bookingsCount,
            revenue: bookingsCount * dailyRate,
            image: VEHICLE_IMAGES[(idx * 3 + mIdx) % VEHICLE_IMAGES.length],
            status: (mIdx + idx) % 2 === 0 ? "Available" : "Rented",
            rating: Number((4.6 + ((idx + mIdx) % 4) * 0.1).toFixed(1)),
            modelYear: "2024",
            nhtsaSpecs: {
              manufacturer: brand,
              modelYear: "2024",
              bodyClass: category,
            },
          });
        });
      } catch (err) {
        // Fallback for individual brand fetch error
      }
    }

    const fleetList = vehicles.length > 0 ? vehicles : MOCK_VEHICLES;

    const filteredVehicles = fleetList.filter(
      (v) =>
        v.name.toLowerCase().includes(searchQuery) ||
        v.brand.toLowerCase().includes(searchQuery) ||
        v.category.toLowerCase().includes(searchQuery)
    );

    return NextResponse.json({
      source: "NHTSA vPIC Vehicle API",
      total: filteredVehicles.length,
      vehicles: filteredVehicles,
    });
  } catch (error) {
    console.error("NHTSA Vehicles API Route Error:", error);
    return NextResponse.json({
      source: "Mock Fleet Fallback",
      total: MOCK_VEHICLES.length,
      vehicles: MOCK_VEHICLES,
    });
  }
}

