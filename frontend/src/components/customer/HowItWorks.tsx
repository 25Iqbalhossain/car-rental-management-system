"use client";

import React from "react";
import { MapPin, CalendarDays, CarFront } from "lucide-react";

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      title: "Choose Location",
      desc: "Find the nearest rental location from our extensive network across major airports and city hubs.",
      icon: MapPin,
    },
    {
      title: "Pick-up Date",
      desc: "Select your preferred date and time to easily schedule your vehicle pick-up and return.",
      icon: CalendarDays,
    },
    {
      title: "Book your car",
      desc: "Confirm your selection and instantly book your ideal vehicle with no hidden charges.",
      icon: CarFront,
    },
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-white relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-[11px] font-bold uppercase tracking-widest text-orange-500 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
            HOW IT WORKS
          </span>
          <h2 className="text-3xl font-medium text-slate-900 tracking-tight">
            How it works
          </h2>
          <p className="text-slate-500 text-sm md:text-base max-w-md mx-auto leading-relaxed">
            A high-performing web-based car rental system for any rent-a-car company and website.
          </p>
        </div>

        {/* 3-Step Process Container */}
        <div className="relative">
          
          {/* Connecting Line (Desktop Only) */}
          <div className="hidden md:block absolute top-[40px] left-[16.66%] right-[16.66%] h-[40px] pointer-events-none z-0">
            <svg 
              width="100%" 
              height="100%" 
              viewBox="0 0 100 100" 
              preserveAspectRatio="none" 
              className="stroke-slate-200 fill-transparent overflow-visible"
            >
               <path 
                 d="M 0,0 C 15,120 35,120 50,0 C 65,120 85,120 100,0" 
                 vectorEffect="non-scaling-stroke" 
                 strokeWidth="1.5"
                 strokeDasharray="4 4"
               />
            </svg>
          </div>

          {/* Grid Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-6 relative z-10">
            {steps.map((s, index) => {
              const Icon = s.icon;
              return (
                <div key={index} className="flex flex-col items-center text-center">
                  
                  {/* Icon Block */}
                  <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 mb-6 transition-transform hover:-translate-y-1 hover:shadow-md">
                    <Icon className="w-8 h-8 text-slate-700" strokeWidth={1.5} />
                  </div>
                  
                  {/* Step Title & Description */}
                  <h3 className="text-[17px] font-medium text-slate-900 mb-2">
                    {s.title}
                  </h3>
                  <p className="text-slate-500 text-sm max-w-[240px] leading-relaxed">
                    {s.desc}
                  </p>
                  
                </div>
              );
            })}
          </div>
        </div>
        
      </div>
    </section>
  );
};
