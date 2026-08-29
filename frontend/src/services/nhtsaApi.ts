// =============================================================================
// NHTSA vPIC Vehicle API Service
// Reusable API service for all NHTSA requests (Requirement 4 & 7)
// Base URL configured via environment variable (Requirement 4)
// =============================================================================

export interface NhtsaMake {
  MakeId: number;
  MakeName: string;
  VehicleTypeId?: number;
  VehicleTypeName?: string;
}

export interface NhtsaModel {
  Make_ID: number;
  Make_Name: string;
  Model_ID: number;
  Model_Name: string;
}

export interface NhtsaVinDecodeResult {
  vin: string;
  make: string;
  model: string;
  modelYear: string;
  vehicleType: string;
  bodyClass: string;
  fuelTypePrimary: string;
  engineCylinders: string;
  displacementL: string;
  transmissionStyle: string;
  driveType: string;
  manufacturer: string;
  plantCity?: string;
  plantCountry?: string;
  errorCode?: string;
  errorText?: string;
  raw?: Record<string, unknown>;
}

// Environment-based base URL (Requirement 4)
const BASE_URL =
  process.env.NEXT_PUBLIC_NHTSA_API_BASE_URL ||
  "https://vpic.nhtsa.dot.gov/api/vehicles";

// ---------------------------------------------------------------------------
// Caching layer (Requirement 8: request caching & prevent duplicate requests)
// ---------------------------------------------------------------------------

const CACHE_TTL = 1000 * 60 * 30; // 30 minutes for makes

const makesCache: { data: NhtsaMake[] | null; timestamp: number } = {
  data: null,
  timestamp: 0,
};
const modelsCache = new Map<string, { data: NhtsaModel[]; timestamp: number }>();
const vinCache = new Map<string, NhtsaVinDecodeResult | null>();

// In-flight request deduplication (Requirement 8: prevent duplicate API requests)
const inflightMakes: { promise: Promise<NhtsaMake[]> | null } = { promise: null };
const inflightModels = new Map<string, Promise<NhtsaModel[]>>();
const inflightVin = new Map<string, Promise<NhtsaVinDecodeResult | null>>();

// ---------------------------------------------------------------------------
// Fetch passenger-car brands from NHTSA API (Requirement 1)
// Endpoint: GET /GetMakesForVehicleType/car?format=json
// ---------------------------------------------------------------------------
export async function getVehicleMakes(): Promise<NhtsaMake[]> {
  const now = Date.now();
  if (makesCache.data && now - makesCache.timestamp < CACHE_TTL) {
    return makesCache.data;
  }

  // Deduplicate concurrent requests
  if (inflightMakes.promise) {
    return inflightMakes.promise;
  }

  const doFetch = async (): Promise<NhtsaMake[]> => {
    try {
      const response = await fetch(
        `${BASE_URL}/GetMakesForVehicleType/car?format=json`
      );

      if (!response.ok) {
        throw new Error(`Unable to load vehicle brands (Status ${response.status})`);
      }

      const data = await response.json();
      if (!data.Results || !Array.isArray(data.Results)) {
        throw new Error("Invalid response format for vehicle brands");
      }

      // Requirement 1: Remove duplicates using MakeId as key
      const uniqueMakesMap = new Map<number | string, NhtsaMake>();
      for (const item of data.Results) {
        if (item && item.MakeName) {
          const cleanName = item.MakeName.trim();
          const key = item.MakeId || cleanName.toUpperCase();
          if (!uniqueMakesMap.has(key)) {
            uniqueMakesMap.set(key, {
              MakeId: item.MakeId,
              MakeName: cleanName,
              VehicleTypeId: item.VehicleTypeId,
              VehicleTypeName: item.VehicleTypeName,
            });
          }
        }
      }

      // Requirement 1: Sort brands alphabetically
      const sortedMakes = Array.from(uniqueMakesMap.values()).sort((a, b) =>
        a.MakeName.localeCompare(b.MakeName)
      );

      makesCache.data = sortedMakes;
      makesCache.timestamp = Date.now();
      return sortedMakes;
    } catch (error) {
      console.error("NHTSA API Error (getVehicleMakes):", error);
      throw error;
    } finally {
      inflightMakes.promise = null;
    }
  };

  inflightMakes.promise = doFetch();
  return inflightMakes.promise;
}

// ---------------------------------------------------------------------------
// Fetch vehicle models for a specific brand and model year (Requirement 2)
// Endpoint: GET /GetModelsForMakeYear/make/{make}/modelyear/{year}?format=json
// ---------------------------------------------------------------------------
export async function getVehicleModels(
  make: string,
  year: string | number,
  signal?: AbortSignal
): Promise<NhtsaModel[]> {
  if (!make || !year) return [];

  const cacheKey = `${make.toLowerCase().trim()}_${year}`;

  // Check cache
  const cached = modelsCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  // Deduplicate concurrent requests
  if (inflightModels.has(cacheKey)) {
    return inflightModels.get(cacheKey)!;
  }

  const doFetch = async (): Promise<NhtsaModel[]> => {
    try {
      const response = await fetch(
        `${BASE_URL}/GetModelsForMakeYear/make/${encodeURIComponent(
          make.trim()
        )}/modelyear/${year}?format=json`,
        signal ? { signal } : undefined
      );

      if (!response.ok) {
        throw new Error(`Unable to load vehicle models (Status ${response.status})`);
      }

      const data = await response.json();
      if (!data.Results || !Array.isArray(data.Results)) {
        throw new Error("Invalid response format for vehicle models");
      }

      // Deduplicate models
      const uniqueModelsMap = new Map<string, NhtsaModel>();
      for (const item of data.Results) {
        if (item && item.Model_Name) {
          const key = `${item.Model_ID || item.Model_Name.toUpperCase()}`;
          if (!uniqueModelsMap.has(key)) {
            uniqueModelsMap.set(key, {
              Make_ID: item.Make_ID,
              Make_Name: item.Make_Name || make,
              Model_ID: item.Model_ID,
              Model_Name: item.Model_Name.trim(),
            });
          }
        }
      }

      const sortedModels = Array.from(uniqueModelsMap.values()).sort((a, b) =>
        a.Model_Name.localeCompare(b.Model_Name)
      );

      modelsCache.set(cacheKey, { data: sortedModels, timestamp: Date.now() });
      return sortedModels;
    } catch (error) {
      // Don't log abort errors
      if (error instanceof DOMException && error.name === "AbortError") {
        return [];
      }
      console.error("NHTSA API Error (getVehicleModels):", error);
      throw error;
    } finally {
      inflightModels.delete(cacheKey);
    }
  };

  const promise = doFetch();
  inflightModels.set(cacheKey, promise);
  return promise;
}

// ---------------------------------------------------------------------------
// Decode a VIN using NHTSA API (Requirement 3)
// Endpoint: GET /DecodeVinValues/{vin}?format=json
// ---------------------------------------------------------------------------
export async function decodeVin(vin: string): Promise<NhtsaVinDecodeResult | null> {
  const cleanVin = vin.trim().toUpperCase();
  if (!cleanVin || cleanVin.length < 11) {
    throw new Error("Please enter a valid VIN (minimum 11 to 17 characters).");
  }

  // Check cache
  if (vinCache.has(cleanVin)) {
    return vinCache.get(cleanVin)!;
  }

  // Deduplicate concurrent requests
  if (inflightVin.has(cleanVin)) {
    return inflightVin.get(cleanVin)!;
  }

  const doFetch = async (): Promise<NhtsaVinDecodeResult | null> => {
    try {
      const response = await fetch(
        `${BASE_URL}/DecodeVinValues/${encodeURIComponent(cleanVin)}?format=json`
      );

      if (!response.ok) {
        throw new Error(`Unable to decode VIN (Status ${response.status})`);
      }

      const data = await response.json();
      const result = data.Results?.[0];

      if (!result) {
        throw new Error("No vehicle specification data returned for this VIN.");
      }

      const errText = result.ErrorText || "";

      // Requirement 3: Display a clear validation message when VIN is invalid
      if (!result.Make && !result.Model) {
        throw new Error(
          errText && !errText.includes("0 -")
            ? `VIN Decode Failed: ${errText}`
            : "Invalid VIN or no matching vehicle data found in NHTSA database."
        );
      }

      // Requirement 3: Populate all available fields
      const decoded: NhtsaVinDecodeResult = {
        vin: cleanVin,
        make: result.Make || "",
        model: result.Model || "",
        modelYear: result.ModelYear || "",
        vehicleType: result.VehicleType || "",
        bodyClass: result.BodyClass || "",
        fuelTypePrimary: result.FuelTypePrimary || "",
        engineCylinders: result.EngineCylinders || "",
        displacementL: result.DisplacementL || "",
        transmissionStyle: result.TransmissionStyle || "",
        driveType: result.DriveType || "",
        manufacturer: result.Manufacturer || "",
        plantCity: result.PlantCity || "",
        plantCountry: result.PlantCountry || "",
        errorCode: result.ErrorCode || "0",
        errorText: errText,
        raw: result,
      };

      vinCache.set(cleanVin, decoded);
      return decoded;
    } catch (error) {
      console.error("NHTSA API Error (decodeVin):", error);
      throw error;
    } finally {
      inflightVin.delete(cleanVin);
    }
  };

  const promise = doFetch();
  inflightVin.set(cleanVin, promise);
  return promise;
}
