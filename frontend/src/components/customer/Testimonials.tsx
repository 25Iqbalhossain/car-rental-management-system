"use client";

import React, { useEffect, useState } from "react";
import { Testimonial } from "@/data/testimonials";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

export const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [items, setItems] = useState<Testimonial[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/testimonials", { cache: "no-store" });
        const data = await res.json();
        if (!cancelled) setItems(data.testimonials || []);
      } catch (err) {
        console.error("Failed to load testimonials from API:", err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (items.length === 0) {
    return (
      <section id="testimonials" className="py-8 lg:py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs font-semibold text-slate-500">
          Loading customer reviews from API...
        </div>
      </section>
    );
  }

  // Mobile handles 1 at a time.
  const handleNextMobile = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };
  const handlePrevMobile = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  // Desktop handles pages of 3.
  const itemsPerPage = 3;
  const totalPages = Math.ceil(items.length / itemsPerPage);
  
  const handleNextDesktop = () => {
    setCurrentIndex((prev) => {
      const currentPage = Math.floor(prev / itemsPerPage);
      const nextPage = (currentPage + 1) % totalPages;
      return nextPage * itemsPerPage;
    });
  };
  const handlePrevDesktop = () => {
    setCurrentIndex((prev) => {
      const currentPage = Math.floor(prev / itemsPerPage);
      const prevPage = (currentPage - 1 + totalPages) % totalPages;
      return prevPage * itemsPerPage;
    });
  };

  const desktopPageItems = items.slice(
    Math.floor(currentIndex / itemsPerPage) * itemsPerPage,
    Math.floor(currentIndex / itemsPerPage) * itemsPerPage + itemsPerPage
  );

  return (
    <section id="testimonials" className="py-8 lg:py-10 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-6 space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-widest text-orange-500 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
            TESTIMONIALS
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Trusted by Thousands of <span className="text-orange-500">Happy Customers</span>
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm">
            Read authentic feedback from satisfied drivers across the UK.
          </p>
        </div>

        {/* Desktop View */}
        <div className="hidden md:block">
          <div className="grid grid-cols-3 gap-6">
            {desktopPageItems.map((item) => (
              <div
                key={item.id}
                className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 relative"
              >
                <Quote className="w-8 h-8 text-orange-500/15 absolute top-4 right-4 pointer-events-none" />
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 stroke-none" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 font-medium italic leading-relaxed">
                    "{item.review}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-3 border-t border-slate-200">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-orange-500"
                  />
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-900">{item.name}</h4>
                    <p className="text-[10px] text-slate-500">
                      {item.location} • Rented <span className="font-semibold text-orange-600">{item.carRented}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                onClick={handlePrevDesktop}
                className="p-1.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-2">
                {[...Array(totalPages)].map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx * itemsPerPage)}
                    className={`w-2 h-2 rounded-full transition-all ${Math.floor(currentIndex / itemsPerPage) === idx ? 'bg-orange-500 w-4' : 'bg-slate-300'}`}
                    aria-label={`Go to page ${idx + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={handleNextDesktop}
                className="p-1.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Mobile View (Single Card Carousel with controls) */}
        <div className="block md:hidden">
          {(() => {
            const currentItem = items[currentIndex];
            return (
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 relative shadow-sm space-y-4">
                <Quote className="w-8 h-8 text-orange-500/20 absolute top-4 right-4 pointer-events-none" />
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(currentItem.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 stroke-none" />
                  ))}
                </div>
                <p className="text-sm text-slate-700 italic leading-relaxed">
                  "{currentItem.review}"
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                  <div className="flex items-center gap-3">
                    <img
                      src={currentItem.avatar}
                      alt={currentItem.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-orange-500"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">{currentItem.name}</h4>
                      <p className="text-[10px] text-slate-500">{currentItem.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={handlePrevMobile}
                      className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700"
                      aria-label="Previous testimonial"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleNextMobile}
                      className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700"
                      aria-label="Next testimonial"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}
          
          {items.length > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              {items.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${currentIndex === idx ? 'bg-orange-500 w-4' : 'bg-slate-300'}`}
                  aria-label={`Go to testimonial ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
