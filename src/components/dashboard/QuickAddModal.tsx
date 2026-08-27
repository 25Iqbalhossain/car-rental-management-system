"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { X, Car, Plus, Search, Loader2, CheckCircle2, AlertCircle, Cpu } from "lucide-react";
import { getVehicleMakes, getVehicleModels, decodeVin, NhtsaMake, NhtsaModel, NhtsaVinDecodeResult } from "@/services/nhtsaApi";

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSuccess: (newItem: any) => void;
}

// Requirement 8: Debounce delay for model fetches
const MODEL_FETCH_DEBOUNCE_MS = 350;

export const QuickAddModal: React.FC<QuickAddModalProps> = ({
  isOpen,
  onClose,
  onAddSuccess,
}) => {
  // VIN state
  const [vinInput, setVinInput] = useState("");
  const [isDecodingVin, setIsDecodingVin] = useState(false);
  const [vinError, setVinError] = useState<string | null>(null);
  const [decodedSpecs, setDecodedSpecs] = useState<NhtsaVinDecodeResult | null>(null);

  // Brand & Model State
  const [makesList, setMakesList] = useState<NhtsaMake[]>([]);
  const [isLoadingMakes, setIsLoadingMakes] = useState(false);
  const [makesError, setMakesError] = useState<string | null>(null);

  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedYear, setSelectedYear] = useState("2024");
  const [modelsList, setModelsList] = useState<NhtsaModel[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [modelsError, setModelsError] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState("");

  // Local Rental Business State (Requirement 5)
  const [dailyRate, setDailyRate] = useState("250");
  const [customerName, setCustomerName] = useState("");
  const [category, setCategory] = useState("Luxury SUV");
  const [status, setStatus] = useState<"Available" | "Rented">("Available");
  const [location, setLocation] = useState("London");

  // Refs for debouncing and abort (Requirement 8)
  const modelFetchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const modelAbortRef = useRef<AbortController | null>(null);

  // Reset form state when modal opens (Requirement 8: clean state)
  useEffect(() => {
    if (isOpen) {
      setVinInput("");
      setVinError(null);
      setDecodedSpecs(null);
      setSelectedModel("");
      setModelsList([]);
      setModelsError(null);
      setDailyRate("250");
      setCustomerName("");
      setCategory("Luxury SUV");
      setStatus("Available");
      setLocation("London");
    }
  }, [isOpen]);

  // Fetch Passenger Car Makes from NHTSA API (Requirement 1)
  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;
    setIsLoadingMakes(true);
    setMakesError(null);

    getVehicleMakes()
      .then((data) => {
        if (isMounted) {
          setMakesList(data);
          // Set default brand to first make if none selected
          if (!selectedBrand && data.length > 0) {
            setSelectedBrand(data[0].MakeName);
          }
          setIsLoadingMakes(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setMakesError(err.message || "Failed to fetch vehicle makes from NHTSA API");
          setIsLoadingMakes(false);
        }
      });

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Fetch Vehicle Models with debouncing and abort (Requirements 2, 8)
  const loadModels = useCallback(async (make: string, year: string, signal?: AbortSignal) => {
    if (!make || !year) return;
    setIsLoadingModels(true);
    setModelsError(null);
    setSelectedModel(""); // Requirement 2: Clear selected model

    try {
      const data = await getVehicleModels(make, year, signal);
      // Only update if not aborted
      if (!signal?.aborted) {
        setModelsList(data);
        setIsLoadingModels(false);
      }
    } catch (err: any) {
      if (err?.name === "AbortError" || signal?.aborted) return;
      setModelsError(err.message || "Failed to fetch vehicle models");
      setModelsList([]);
      setIsLoadingModels(false);
    }
  }, []);

  // Debounced model fetch when brand or year changes (Requirement 8)
  useEffect(() => {
    if (!isOpen || !selectedBrand || !selectedYear) return;

    // Cancel any pending fetch
    if (modelFetchTimerRef.current) {
      clearTimeout(modelFetchTimerRef.current);
    }
    if (modelAbortRef.current) {
      modelAbortRef.current.abort();
    }

    // Create new abort controller
    const abortController = new AbortController();
    modelAbortRef.current = abortController;

    // Debounce the request
    modelFetchTimerRef.current = setTimeout(() => {
      loadModels(selectedBrand, selectedYear, abortController.signal);
    }, MODEL_FETCH_DEBOUNCE_MS);

    return () => {
      if (modelFetchTimerRef.current) {
        clearTimeout(modelFetchTimerRef.current);
      }
      abortController.abort();
    };
  }, [isOpen, selectedBrand, selectedYear, loadModels]);

  if (!isOpen) return null;

  // Handle Brand / Make Change (Requirement 2)
  const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newBrand = e.target.value;
    setSelectedBrand(newBrand);
    setSelectedModel(""); // Requirement 2: Clear selected model
  };

  // Handle Model Year Change (Requirement 2)
  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = e.target.value;
    setSelectedYear(newYear);
    setSelectedModel(""); // Requirement 2: Clear selected model
  };

  // Handle VIN Decoding (Requirement 3)
  const handleDecodeVin = async () => {
    if (!vinInput.trim()) {
      setVinError("Please enter a VIN string before decoding.");
      return;
    }

    setIsDecodingVin(true);
    setVinError(null);
    setDecodedSpecs(null);

    try {
      const result = await decodeVin(vinInput.trim());
      if (result) {
        setDecodedSpecs(result);
        // Requirement 3: Auto-populate all available fields
        if (result.make) setSelectedBrand(result.make.toUpperCase());
        if (result.modelYear) setSelectedYear(result.modelYear);
        if (result.model) {
          // Abort any pending model fetch
          if (modelAbortRef.current) modelAbortRef.current.abort();
          if (modelFetchTimerRef.current) clearTimeout(modelFetchTimerRef.current);

          await loadModels(result.make || selectedBrand, result.modelYear || selectedYear);
          setSelectedModel(result.model);
        }
        if (result.bodyClass) {
          if (result.bodyClass.toLowerCase().includes("suv")) setCategory("Luxury SUV");
          else if (result.bodyClass.toLowerCase().includes("sedan")) setCategory("Sedan");
          else if (result.bodyClass.toLowerCase().includes("coupe")) setCategory("Sports Coupe");
          else if (result.bodyClass.toLowerCase().includes("hatchback")) setCategory("Hatchback");
          else if (result.bodyClass.toLowerCase().includes("compact")) setCategory("Compact SUV");
        }
      } else {
        // Requirement 3: Display clear validation message
        setVinError("Invalid VIN or no matching vehicle record returned from NHTSA database.");
      }
    } catch (err: any) {
      // Requirement 3: Display clear validation message
      setVinError(err.message || "Invalid VIN or no matching vehicle data found.");
    } finally {
      setIsDecodingVin(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalModel = selectedModel || (modelsList.length > 0 ? modelsList[0].Model_Name : "Standard Model");
    const finalVehicleName = `${selectedBrand} ${finalModel}`;

    onAddSuccess({
      vehicleName: finalVehicleName,
      brand: selectedBrand,
      model: finalModel,
      modelYear: selectedYear,
      category,
      dailyRate: parseFloat(dailyRate) || 200,
      customerName: customerName || "Guest Customer",
      status,
      location,
      // Requirement 3: Pass all decoded specs including driveType and manufacturer
      nhtsaSpecs: decodedSpecs ? {
        vin: decodedSpecs.vin,
        modelYear: decodedSpecs.modelYear,
        vehicleType: decodedSpecs.vehicleType,
        bodyClass: decodedSpecs.bodyClass,
        fuelType: decodedSpecs.fuelTypePrimary,
        engineCylinders: decodedSpecs.engineCylinders,
        displacementL: decodedSpecs.displacementL,
        transmissionStyle: decodedSpecs.transmissionStyle,
        driveType: decodedSpecs.driveType,
        manufacturer: decodedSpecs.manufacturer,
      } : undefined,
    });

    onClose();
  };

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 12 }, (_, i) => (currentYear - i + 1).toString());


  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 lg:p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
              <Car className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 leading-tight">Create Vehicle & Rental</h3>
              <p className="text-[10px] text-slate-500 font-medium">NHTSA vPIC Vehicle API Integration</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-4 lg:p-5 overflow-y-auto space-y-4 text-xs">
          {/* Section 1: VIN Decoder (Requirement 3) */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-extrabold text-slate-800 flex items-center gap-1.5 text-[11px]">
                <Cpu className="w-3.5 h-3.5 text-orange-500" />
                <span>NHTSA VIN Decoder (Optional)</span>
              </label>
              <span className="text-[9px] font-bold text-slate-400 uppercase">Live Lookup</span>
            </div>

            <div className="flex gap-1.5">
              <input
                type="text"
                value={vinInput}
                onChange={(e) => setVinInput(e.target.value)}
                placeholder="e.g. 1HGCR2F83HA000000"
                className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1.5 focus:ring-orange-500 font-mono tracking-wide uppercase"
              />
              <button
                type="button"
                onClick={handleDecodeVin}
                disabled={isDecodingVin}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] rounded-lg flex items-center gap-1 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isDecodingVin ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                <span>Decode</span>
              </button>
            </div>

            {/* Validation Message / Error (Requirement 3) */}
            {vinError && (
              <div className="flex items-center gap-1.5 p-2 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-[11px] font-semibold">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{vinError}</span>
              </div>
            )}

            {/* Success Decoded Specs Display (Requirement 3: all available fields) */}
            {decodedSpecs && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 space-y-1 text-[11px]">
                <div className="flex items-center gap-1.5 font-extrabold text-emerald-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>VIN Specs Decoded Successfully</span>
                </div>
                <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[10px] text-emerald-800 font-medium pt-1">
                  <p><strong className="font-bold">Make:</strong> {decodedSpecs.make}</p>
                  <p><strong className="font-bold">Model:</strong> {decodedSpecs.model}</p>
                  <p><strong className="font-bold">Year:</strong> {decodedSpecs.modelYear}</p>
                  <p><strong className="font-bold">Body:</strong> {decodedSpecs.bodyClass}</p>
                  <p><strong className="font-bold">Fuel:</strong> {decodedSpecs.fuelTypePrimary}</p>
                  <p><strong className="font-bold">Engine:</strong> {decodedSpecs.engineCylinders} Cyl / {decodedSpecs.displacementL}L</p>
                  {decodedSpecs.driveType && (
                    <p><strong className="font-bold">Drive:</strong> {decodedSpecs.driveType}</p>
                  )}
                  {decodedSpecs.manufacturer && (
                    <p className="truncate"><strong className="font-bold">Mfr:</strong> {decodedSpecs.manufacturer}</p>
                  )}
                  {decodedSpecs.transmissionStyle && (
                    <p className="col-span-2 truncate"><strong className="font-bold">Transmission:</strong> {decodedSpecs.transmissionStyle}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Section 2: NHTSA Brand & Model Selectors (Requirements 1 & 2) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Brand / Make Selector (Requirement 1) */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Vehicle Brand (Make) <span className="text-rose-500">*</span>
              </label>
              {isLoadingMakes ? (
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 rounded-lg text-[11px] text-slate-500">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-orange-500" />
                  <span>Loading Makes...</span>
                </div>
              ) : makesError ? (
                <div className="text-[10px] text-rose-600 font-semibold">{makesError}</div>
              ) : (
                <select
                  value={selectedBrand}
                  onChange={handleBrandChange}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-bold text-slate-800 focus:outline-none focus:ring-1.5 focus:ring-orange-500 cursor-pointer"
                >
                  {makesList.map((m) => (
                    <option key={m.MakeId || m.MakeName} value={m.MakeName}>
                      {m.MakeName}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Model Year Selector (Requirement 2) */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Model Year <span className="text-rose-500">*</span>
              </label>
              <select
                value={selectedYear}
                onChange={handleYearChange}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-bold text-slate-800 focus:outline-none focus:ring-1.5 focus:ring-orange-500 cursor-pointer"
              >
                {yearOptions.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            {/* Dynamic Model Selector (Requirement 2) */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Vehicle Model <span className="text-rose-500">*</span>
              </label>
              {isLoadingModels ? (
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 rounded-lg text-[11px] text-slate-500">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-orange-500" />
                  <span>Loading Models...</span>
                </div>
              ) : modelsError ? (
                <div className="text-[10px] text-rose-600 font-semibold">{modelsError}</div>
              ) : modelsList.length === 0 ? (
                <div className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-400 font-medium">
                  No models found
                </div>
              ) : (
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-bold text-slate-800 focus:outline-none focus:ring-1.5 focus:ring-orange-500 cursor-pointer"
                >
                  <option value="">-- Select Model ({modelsList.length}) --</option>
                  {modelsList.map((m) => (
                    <option key={m.Model_ID || m.Model_Name} value={m.Model_Name}>
                      {m.Model_Name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Section 3: Local Rental Data (Requirement 5) */}
          <div className="border-t border-slate-100 pt-3 space-y-3">
            <h4 className="font-extrabold text-slate-400 text-[10px] uppercase tracking-wider">
              Local Rental Business Information
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Daily Rental Rate (£) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="20"
                  value={dailyRate}
                  onChange={(e) => setDailyRate(e.target.value)}
                  placeholder="250"
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1.5 focus:ring-orange-500 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Rental Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1.5 focus:ring-orange-500 font-semibold cursor-pointer"
                >
                  <option value="Luxury SUV">Luxury SUV</option>
                  <option value="Compact SUV">Compact SUV</option>
                  <option value="Sports Coupe">Sports Coupe</option>
                  <option value="Sedan">Sedan</option>
                  <option value="Hatchback">Hatchback</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Branch / Location</label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1.5 focus:ring-orange-500 font-semibold cursor-pointer"
                >
                  <option value="London">London, UK</option>
                  <option value="Manchester">Manchester, UK</option>
                  <option value="Birmingham">Birmingham, UK</option>
                  <option value="Liverpool">Liverpool, UK</option>
                  <option value="Leeds">Leeds, UK</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Initial Fleet Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1.5 focus:ring-orange-500 font-semibold cursor-pointer"
                >
                  <option value="Available">Available</option>
                  <option value="Rented">Rented</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Customer Name (Optional)</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Eleanor Vance"
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1.5 focus:ring-orange-500 font-medium"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-2 flex items-center justify-end gap-2 shrink-0 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors text-xs cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 font-extrabold text-white bg-orange-500 hover:bg-orange-600 rounded-lg shadow-xs shadow-orange-500/30 transition-all text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Confirm & Add Vehicle</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
