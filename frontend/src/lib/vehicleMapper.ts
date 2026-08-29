import { Vehicle } from "@/types/dashboard";
import { CustomerVehicle } from "@/data/vehicles";

export function toCustomerVehicle(v: Vehicle): CustomerVehicle {
  const category = (v.category || "").toLowerCase();
  const isSuv = category.includes("suv");
  const isCoupe = category.includes("coupe") || category.includes("sports");
  const fuelType = v.nhtsaSpecs?.fuelType || (v.brand === "TESLA" ? "Electric" : "Gasoline");

  return {
    ...v,
    transmission: "Automatic",
    seats: isCoupe ? 2 : isSuv ? 7 : 5,
    doors: isCoupe ? 2 : 4,
    pricePerDay: v.dailyRate,
    available: v.status === "Available",
    fuelType,
  };
}

export function toCustomerVehicles(list: Vehicle[] = []): CustomerVehicle[] {
  return list.map(toCustomerVehicle);
}
