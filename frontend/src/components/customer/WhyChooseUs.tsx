"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";

export const WhyChooseUs: React.FC = () => {
  const features = [
    { title: "Customer Support", desc: "24/7 dedicated helpline and breakdown assistance." },
    { title: "Best Price Guarantee", desc: "Competitive daily rates with zero hidden charges." },
    { title: "Easy Online Booking", desc: "Reserve your car in 60 seconds with instant confirmation." },
    { title: "Many Locations", desc: "Convenient pickup and drop-off hubs across major UK cities." },
  ];

  return (
    <section id="why-choose-us" className="py-8 lg:py-10 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Visual Illustration */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-100 bg-slate-900">
              <img
                src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800"
                alt="Why Choose Us Vehicle"
                className="w-full h-56 sm:h-64 object-cover opacity-95 hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Right Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-orange-500 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                WHY CHOOSE US
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                We Provide The Best Customer <span className="text-orange-500">Experience</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {features.map((f) => (
                <div key={f.title} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <CheckCircle2 className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-extrabold text-xs text-slate-900">{f.title}</h3>
                    <p className="text-[11px] text-slate-500 leading-tight mt-0.5">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
