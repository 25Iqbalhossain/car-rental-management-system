"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Zap } from "lucide-react";

export const FeatureCards: React.FC = () => {
  return (
    <section className="py-8 lg:py-10 bg-slate-50 border-y border-slate-200/70 space-y-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Additional Content Block 1 */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Full Protection Cover</span>
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
              Drive with Confidence Anywhere in the UK
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Every vehicle rental includes primary collision damage protection, zero hidden processing fees, and 24/7 UK-wide breakdown recovery. Enjoy unlimited mileage options on selected vehicle tiers.
            </p>
            <Link
              href="/booking"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all"
            >
              <span>Explore Coverage</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="lg:col-span-6">
            <img
              src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800"
              alt="Car Rental Protection"
              className="w-full h-44 sm:h-52 object-cover rounded-xl border border-slate-100 shadow-sm"
            />
          </div>
        </div>

        {/* Additional Content Block 2 */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 order-2 lg:order-1">
            <img
              src="https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&q=80&w=800"
              alt="Instant Contactless Unlock"
              className="w-full h-44 sm:h-52 object-cover rounded-xl border border-slate-100 shadow-sm"
            />
          </div>
          <div className="lg:col-span-6 order-1 lg:order-2 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Contactless Mobile Unlock</span>
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
              Fast Digital Pick-Up & Return Experience
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Bypass airport counter queues with our mobile check-in feature. Receive direct vehicle terminal navigation, digital key access, and automatic receipt processing straight to your email.
            </p>
            <Link
              href="/vehicles"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all"
            >
              <span>See Available Vehicles</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
