"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { X, Car, ArrowRight } from "lucide-react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Slide-out Panel */}
      <div className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-2xl flex flex-col z-50 p-6">
        <div className="flex items-center justify-between pb-6 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center text-white font-extrabold shadow-md shadow-orange-500/20">
              <Car className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-lg text-slate-900 tracking-tight">
              Best Auto
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 py-6 space-y-2">
          {[
            { label: "Home", href: "/" },
            { label: "How It Works", href: "#how-it-works" },
            { label: "Rental Details", href: "#popular-deals" },
            { label: "Why Choose Us", href: "#why-choose-us" },
            { label: "Testimonials", href: "#testimonials" },
            { label: "Admin Dashboard", href: "/admin/dashboard", isHighlight: true },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={onClose}
              className={`flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm transition-colors ${
                item.isHighlight
                  ? "bg-orange-50 text-orange-600 border border-orange-200"
                  : "text-slate-700 hover:bg-slate-50 hover:text-orange-500"
              }`}
            >
              <span>{item.label}</span>
              <ArrowRight className="w-4 h-4 opacity-50" />
            </Link>
          ))}
        </nav>

        <div className="pt-6 border-t border-slate-100 space-y-3">
          <Link
            href="/booking"
            onClick={onClose}
            className="block w-full py-3 text-center bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm rounded-xl shadow-md shadow-orange-500/20 transition-all"
          >
            Register / Log In
          </Link>
        </div>
      </div>
    </div>
  );
};
