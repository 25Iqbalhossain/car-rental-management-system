"use client";

import React from "react";
import Link from "next/link";
import { Car } from "lucide-react";

export const CustomerFooter: React.FC = () => {
  return (
    <footer className="bg-slate-100 text-slate-600 pt-8 pb-6 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 pb-6 border-b border-slate-200">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-orange-500 flex items-center justify-center text-white font-extrabold shadow-xs">
                <Car className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-lg text-slate-900 tracking-tight">
                Best Auto
              </span>
            </Link>
            <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
              Our vision is to provide safety, convenience, and seamless car rental services across the United Kingdom.
            </p>
          </div>

          {/* About Column */}
          <div className="space-y-2.5">
            <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">About</h4>
            <ul className="space-y-1.5 text-xs font-medium">
              <li><a href="#how-it-works" className="hover:text-orange-500 transition-colors">How it works</a></li>
              <li><a href="#popular-deals" className="hover:text-orange-500 transition-colors">Featured Vehicles</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Partnership</a></li>
              <li><Link href="/admin/dashboard" className="hover:text-orange-500 transition-colors">Admin Dashboard</Link></li>
            </ul>
          </div>

          {/* Community Column */}
          <div className="space-y-2.5">
            <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">Community</h4>
            <ul className="space-y-1.5 text-xs font-medium">
              <li><a href="#" className="hover:text-orange-500 transition-colors">Events</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Podcast</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Invite a friend</a></li>
            </ul>
          </div>

          {/* Socials Column */}
          <div className="space-y-2.5">
            <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">Socials</h4>
            <ul className="space-y-1.5 text-xs font-medium">
              <li><a href="#" className="hover:text-orange-500 transition-colors">Discord</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Twitter / X</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Facebook</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs gap-3">
          <p className="font-medium">©2026 Best Auto. All rights reserved</p>
          <div className="flex items-center gap-6 font-semibold">
            <a href="#" className="hover:text-slate-900 transition-colors">Privacy & Policy</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Terms & Condition</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
