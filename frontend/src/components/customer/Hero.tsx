"use client";

import React from "react";
import { ShieldCheck, ArrowRight, Star, ChevronDown, CheckCircle2 } from "lucide-react";

export const CustomerHero: React.FC = () => {
  const scrollToSearch = () => {
    const el = document.getElementById("rental-search");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToDeals = () => {
    const el = document.getElementById("popular-deals");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative bg-gradient-to-b from-orange-50/50 via-slate-50 to-white pt-8 pb-14 lg:pt-12 lg:pb-20 overflow-hidden">
      {/* Background Decorative Gradient Blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Hero Copy & CTA */}
          <div className="lg:col-span-6 space-y-5 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100/80 border border-orange-200 text-orange-700 text-xs font-bold shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-orange-500" />
              <span>100% Trusted Car rental platform in the UK</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              FAST AND EASY WAY TO <span className="text-orange-500">RENT A CAR</span>
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed max-w-xl mx-auto lg:mx-0">
              Explore premium passenger vehicles, luxury sports coupes, and family SUVs across major UK cities with zero hidden fees and 24/7 instant confirmation.
            </p>

            {/* Hero CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-1">
              <button
                onClick={scrollToSearch}
                className="w-full sm:w-auto px-6 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-2 group"
              >
                <span>Booking Now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={scrollToDeals}
                className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-900 font-extrabold text-xs sm:text-sm rounded-xl border border-slate-200 shadow-2xs transition-all flex items-center justify-center gap-2"
              >
                <span>See all cars</span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* Trust Metrics */}
            <div className="pt-4 border-t border-slate-200/80 flex flex-wrap items-center justify-center lg:justify-start gap-5 text-xs text-slate-600">
              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 stroke-none" />
                  ))}
                </div>
                <span className="text-xs font-extrabold">4.9/5</span>
                <span className="text-slate-500 font-normal">(12k+ Reviews)</span>
              </div>

              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>No Cancellation Fees</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>NHTSA Decoded Fleet</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Vehicle Showcase */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            <div className="relative w-full max-w-lg lg:max-w-none">
              <div className="relative bg-white rounded-3xl p-3 sm:p-4 shadow-xl border border-slate-100 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=800"
                  alt="TESLA Model S Rental"
                  className="w-full h-56 sm:h-72 object-cover rounded-2xl"
                />

                {/* Floating Badge overlay */}
                <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md p-3 rounded-xl shadow-md border border-slate-100 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-orange-500/10 text-orange-600 flex items-center justify-center font-extrabold text-xs">
                    ★ 4.9
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">TESLA Model S</span>
                    <span className="text-[10px] text-slate-500">100% Electric • $260/day</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

