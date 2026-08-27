"use client";

import React from "react";
import { Car, MapPin, Smile } from "lucide-react";

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: "01",
      title: "Choose Your Car",
      desc: "Select from our vast fleet of NHTSA-decoded sedans, luxury SUVs, and EVs.",
      icon: Car,
    },
    {
      step: "02",
      title: "Pick Your Location",
      desc: "Choose convenient pick-up & drop-off locations across UK airports and city hubs.",
      icon: MapPin,
    },
    {
      step: "03",
      title: "Enjoy Your Ride",
      desc: "Drive with peace of mind featuring 24/7 roadside assistance & zero hidden costs.",
      icon: Smile,
    },
  ];

  return (
    <section id="how-it-works" className="py-12 lg:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-widest text-orange-500 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
            HOW IT WORKS
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Rent Your Ideal Car In <span className="text-orange-500">3 Easy Steps</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                className="relative bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:border-orange-200 hover:shadow-md transition-all group flex flex-col items-start"
              >
                <div className="flex items-center justify-between w-full mb-4">
                  <div className="w-11 h-11 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-all">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-2xl font-extrabold text-slate-300 group-hover:text-orange-400 transition-colors">
                    {s.step}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1">{s.title}</h3>
                <p className="text-slate-600 text-xs leading-relaxed">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

