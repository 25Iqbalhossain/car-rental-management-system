"use client";

import React, { useEffect, useState } from "react";
import { MapPin, Calendar, Search, AlertCircle, CheckCircle2 } from "lucide-react";

export const RentalSearch: React.FC<{ onSearch?: (criteria: any) => void }> = ({ onSearch }) => {
  const [pLoc, setPLoc] = useState("");
  const [pDate, setPDate] = useState("2026-08-28");
  const [dLoc, setDLoc] = useState("");
  const [dDate, setDDate] = useState("2026-08-31");
  const [errs, setErrs] = useState<string[]>([]);
  const [ok, setOk] = useState(false);
  const [locations, setLocations] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/locations", { cache: "no-store" });
        const data = await res.json();
        const names: string[] = (data.locations || []).map((l: { city?: string; country?: string }) =>
          l.city ? `${l.city}${l.country ? `, ${l.country}` : ""}` : ""
        ).filter(Boolean);
        if (!cancelled && names.length > 0) {
          setLocations(names);
          setPLoc((prev) => prev || names[0]);
          setDLoc((prev) => prev || names[0]);
        }
      } catch (err) {
        console.error("Failed to load locations from API:", err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const list: string[] = [];
    if (!pLoc.trim()) list.push("Please select a pickup location.");
    if (!pDate) list.push("Please select a pickup date.");
    if (!dLoc.trim()) list.push("Please select a drop-off location.");
    if (!dDate) list.push("Please select a drop-off date.");
    if (pDate && dDate && new Date(dDate) < new Date(pDate)) {
      list.push("Drop-off date must be after pickup date.");
    }
    if (list.length > 0) { setErrs(list); setOk(false); return; }
    setErrs([]); setOk(true);
    if (onSearch) {
      onSearch({ pickupLocation: pLoc, pickupDate: pDate, dropoffLocation: dLoc, dropoffDate: dDate });
    }
    document.getElementById("popular-deals")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="rental-search" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-10 relative z-20">
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xl border border-slate-200">
        {errs.length > 0 && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs">
            <div className="flex items-center gap-1.5 font-bold"><AlertCircle className="w-4 h-4" /> Validation Error:</div>
            <ul className="list-disc list-inside mt-1">{errs.map((e, i) => <li key={i}>{e}</li>)}</ul>
          </div>
        )}
        {ok && (
          <div className="mb-3 flex items-center justify-between text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
            <span className="flex items-center gap-1.5 font-bold"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Vehicle search criteria updated!</span>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-end">
            {/* Pick-Up Location */}
            <div className="lg:col-span-3 space-y-1">
              <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" /> Pick-Up Location
              </label>
              <select
                value={pLoc}
                onChange={(e) => setPLoc(e.target.value)}
                className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:outline-none transition-all"
              >
                {locations.length > 0 ? (
                  locations.map((loc) => (
                    <option key={`p-${loc}`} value={loc}>{loc}</option>
                  ))
                ) : (
                  <option value="">Loading locations...</option>
                )}
              </select>
            </div>

            {/* Pick-Up Date */}
            <div className="lg:col-span-2 space-y-1">
              <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-orange-500 shrink-0" /> Pick-Up Date
              </label>
              <input
                type="date"
                value={pDate}
                onChange={(e) => setPDate(e.target.value)}
                className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:outline-none transition-all"
              />
            </div>

            {/* Drop-Off Location */}
            <div className="lg:col-span-3 space-y-1">
              <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" /> Drop-Off Location
              </label>
              <select
                value={dLoc}
                onChange={(e) => setDLoc(e.target.value)}
                className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:outline-none transition-all"
              >
                {locations.length > 0 ? (
                  locations.map((loc) => (
                    <option key={`d-${loc}`} value={loc}>{loc}</option>
                  ))
                ) : (
                  <option value="">Loading locations...</option>
                )}
              </select>
            </div>

            {/* Drop-Off Date */}
            <div className="lg:col-span-2 space-y-1">
              <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-500 shrink-0" /> Drop-Off Date
              </label>
              <input
                type="date"
                value={dDate}
                onChange={(e) => setDDate(e.target.value)}
                className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:outline-none transition-all"
              />
            </div>

            {/* Search Submit CTA */}
            <div className="sm:col-span-2 lg:col-span-2 flex items-end">
              <button
                type="submit"
                className="w-full h-10 px-4 bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-orange-500/20 transition-all cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};
