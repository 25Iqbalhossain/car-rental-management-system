"use client";

import React, { useState } from "react";
import { Sparkles, X, Loader2, ArrowRight, CheckCircle2 } from "lucide-react";
import { CustomerVehicle } from "@/data/vehicles";

interface AiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectVehicle?: (vehicle: CustomerVehicle) => void;
}

export const AiRecommendationModal: React.FC<AiModalProps> = ({ isOpen, onClose, onSelectVehicle }) => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [recs, setRecs] = useState<Array<{ vehicle: CustomerVehicle; matchScore: number; reason: string }>>([]);
  const [searched, setSearched] = useState(false);

  const quickPrompts = [
    "Economical car for 4 people for 3 days",
    "Luxury sports vehicle for weekend getaway",
    "Spacious 5-seater family SUV",
  ];

  const handleRecommend = async (customPrompt?: string) => {
    const q = customPrompt || prompt;
    if (!q.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: q }),
      });
      const data = await res.json();
      if (data.success) setRecs(data.recommendations);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={onClose} />
      <div className="relative bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 z-50 space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
            <h3 className="font-extrabold text-base text-slate-900">AI Vehicle Match Assistant</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700"><X className="w-5 h-5" /></button>
        </div>

        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Economical car for 4 people..."
              className="flex-1 px-4 py-2.5 bg-slate-50 border rounded-xl text-xs font-medium focus:outline-none"
            />
            <button
              onClick={() => handleRecommend()}
              disabled={loading}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shrink-0"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>Recommend</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((qp) => (
              <button key={qp} onClick={() => { setPrompt(qp); handleRecommend(qp); }} className="text-[11px] bg-slate-100 hover:bg-amber-50 text-slate-600 px-3 py-1 rounded-lg border">
                {qp}
              </button>
            ))}
          </div>
        </div>

        {searched && (
          <div className="space-y-3 pt-2">
            {loading ? (
              <div className="py-8 text-center"><Loader2 className="w-6 h-6 animate-spin text-amber-500 mx-auto" /></div>
            ) : recs.length > 0 ? (
              recs.map(({ vehicle, matchScore, reason }) => (
                <div key={vehicle.id} className="p-3.5 rounded-2xl border bg-slate-50 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img src={vehicle.image} alt={vehicle.name} className="w-14 h-14 rounded-xl object-cover" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">{vehicle.name}</span>
                        <span className="text-[10px] font-extrabold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">{matchScore}% Match</span>
                      </div>
                      <p className="text-[11px] text-slate-500">${vehicle.pricePerDay}/day • {vehicle.seats} Seats</p>
                      <p className="text-[11px] text-emerald-700 flex items-center gap-1 font-semibold"><CheckCircle2 className="w-3 h-3 text-emerald-600" /> {reason}</p>
                    </div>
                  </div>
                  <button onClick={() => { if (onSelectVehicle) onSelectVehicle(vehicle); onClose(); }} className="px-3 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl shrink-0 flex items-center gap-1">
                    Select <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 text-center py-4">No exact match found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
