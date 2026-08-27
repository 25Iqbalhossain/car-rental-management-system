"use client";

import React, { useState } from "react";
import { Menu, Search, Plus, Store, Bell, Globe, ChevronDown, Sparkles, X, User, LogOut } from "lucide-react";
import Image from "next/image";

interface HeaderProps {
  onToggleMobileMenu: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddNew: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileMenu, searchQuery, onSearchChange, onAddNew }) => {
  const [lang, setLang] = useState("EN");
  const [showLang, setShowLang] = useState(false);
  const [showSoon, setShowSoon] = useState(false);
  const [showUser, setShowUser] = useState(false);

  return (
    <header className="h-14 bg-white border-b border-slate-200 sticky top-0 z-30 px-3 lg:px-5 flex items-center justify-between shadow-2xs">
      <div className="flex items-center gap-2.5 flex-1 max-w-lg">
        <button onClick={onToggleMobileMenu} className="lg:hidden p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg">
          <Menu className="w-5 h-5" />
        </button>
        <div className="relative flex-1 max-w-xs md:max-w-sm">
          <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search vehicles, bookings..."
            className="w-full pl-8 pr-7 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1.5 focus:ring-orange-500 focus:bg-white"
          />
          {searchQuery && (
            <button onClick={() => onSearchChange("")} className="absolute right-2 top-2 text-slate-400 hover:text-slate-600">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1.5 lg:gap-2.5">
        <div className="relative hidden md:block">
          <button onClick={() => setShowSoon(!showSoon)} className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg">
            <Sparkles className="w-3 h-3 text-amber-600" />
            <span>Coming Soon</span>
            <ChevronDown className="w-3 h-3" />
          </button>
          {showSoon && (
            <div className="absolute right-0 mt-1.5 w-44 bg-white border border-slate-200 rounded-xl shadow-lg p-2 z-50 text-xs">
              <div className="px-2 py-1 font-bold border-b mb-1 text-slate-800">Upcoming Features</div>
              <div className="px-2 py-1 hover:bg-slate-50 rounded text-slate-600">AI Fleet Maintenance</div>
              <div className="px-2 py-1 hover:bg-slate-50 rounded text-slate-600">GPS Live Tracking</div>
            </div>
          )}
        </div>

        {/* Orange Add New Button */}
        <button onClick={onAddNew} className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-lg shadow-xs shadow-orange-500/20 transition-all">
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Add New</span>
        </button>

        {/* Dark Navy POS Button */}
        <button onClick={() => alert("POS Terminal")} className="hidden sm:flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-all">
          <Store className="w-3.5 h-3.5" />
          <span>POS</span>
        </button>

        {/* Language selector */}
        <div className="relative">
          <button onClick={() => setShowLang(!showLang)} className="flex items-center gap-1 p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg">
            <Globe className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-bold text-slate-700">{lang}</span>
          </button>
          {showLang && (
            <div className="absolute right-0 mt-1.5 w-28 bg-white border border-slate-200 rounded-xl shadow-lg p-1 z-50 text-xs">
              {["EN", "US", "ES", "FR"].map((code) => (
                <button key={code} onClick={() => { setLang(code); setShowLang(false); }} className="w-full text-left px-2.5 py-1 hover:bg-slate-100 rounded flex justify-between text-slate-700">
                  <span>{code}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notification Bell */}
        <button className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full" />
        </button>

        {/* User Profile Avatar */}
        <div className="relative pl-1 border-l border-slate-200">
          <button onClick={() => setShowUser(!showUser)} className="flex items-center gap-2 p-1 hover:bg-slate-100 rounded-lg">
            <div className="relative w-7 h-7 rounded-full overflow-hidden border border-slate-200 shrink-0">
              <Image src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150" alt="Avatar" fill className="object-cover" />
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-[11px] font-extrabold text-slate-900 leading-tight">Mike Witzel</p>
              <p className="text-[9px] font-semibold text-slate-400">Super Admin</p>
            </div>
            <ChevronDown className="w-3 h-3 text-slate-400 hidden lg:block" />
          </button>
          {showUser && (
            <div className="absolute right-0 mt-1.5 w-40 bg-white border border-slate-200 rounded-xl shadow-xl p-1 z-50 text-xs text-slate-700">
              <div className="px-3 py-1 border-b font-bold text-slate-900">Mike Witzel</div>
              <button className="w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2"><User className="w-3 h-3"/> Profile</button>
              <button className="w-full text-left px-3 py-1.5 hover:bg-rose-50 text-rose-600 flex items-center gap-2"><LogOut className="w-3 h-3"/> Log Out</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
