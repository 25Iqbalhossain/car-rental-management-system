"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Car, Menu, Sparkles, LayoutDashboard, UserPlus, LogIn } from "lucide-react";
import { MobileMenu } from "./MobileMenu";

interface HeaderProps {
  onOpenAiModal?: () => void;
}

export const CustomerHeader: React.FC<HeaderProps> = ({ onOpenAiModal }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center text-white font-extrabold shadow-md shadow-orange-500/25 group-hover:scale-105 transition-transform">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-slate-900 tracking-tight block leading-none">
                Best Auto
              </span>
              <span className="text-[9px] uppercase font-bold tracking-widest text-orange-500">
                UK Car Rental
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <Link href="/" className="text-orange-500 font-bold hover:text-orange-600 transition-colors">
              Home
            </Link>
            <a href="#how-it-works" className="hover:text-slate-900 transition-colors">
              How It Works
            </a>
            <a href="#popular-deals" className="hover:text-slate-900 transition-colors">
              Rental Details
            </a>
            <a href="#why-choose-us" className="hover:text-slate-900 transition-colors">
              Why Choose Us
            </a>
            <a href="#testimonials" className="hover:text-slate-900 transition-colors">
              Testimonial
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-2">
            {onOpenAiModal && (
              <button
                onClick={onOpenAiModal}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/80 rounded-xl text-xs font-bold transition-all shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                <span>AI Assistant</span>
              </button>
            )}

            <Link
              href="/admin/dashboard"
              className="flex items-center gap-1 px-2.5 py-1.5 text-slate-600 hover:text-slate-900 font-semibold text-xs transition-colors"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-orange-500" />
              <span>Admin</span>
            </Link>

            <Link
              href="/booking"
              className="flex items-center gap-1 px-3 py-1.5 text-slate-700 hover:text-slate-900 font-bold text-xs rounded-xl hover:bg-slate-100 transition-all"
            >
              <LogIn className="w-3.5 h-3.5 text-slate-500" />
              <span>Log In</span>
            </Link>

            <Link
              href="/booking"
              className="flex items-center gap-1 px-3.5 py-1.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-xs transition-all"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Register</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            {onOpenAiModal && (
              <button
                onClick={onOpenAiModal}
                className="p-2 bg-amber-50 text-amber-600 border border-amber-200 rounded-lg text-xs font-bold"
              >
                <Sparkles className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 text-slate-700 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
              aria-label="Toggle mobile navigation menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
};

