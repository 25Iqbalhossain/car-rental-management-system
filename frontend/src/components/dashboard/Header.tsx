"use client";

import React, { useState } from "react";
import {
  Menu,
  Search,
  Plus,
  Store,
  Bell,
  Flag,
  ChevronDown,
  Sparkles,
  X,
  User,
  LogOut,
  Maximize2,
  Mail,
  Settings,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
      return;
    }
    document.exitFullscreen?.();
  };

  return (
    <header className="admin-header h-[50px] bg-white border-b border-slate-200 sticky top-0 z-30 px-2.5 lg:px-4 flex items-center justify-between gap-2 shadow-2xs overflow-visible">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <button onClick={onToggleMobileMenu} className="lg:hidden p-1 text-slate-600 hover:bg-slate-100 rounded shrink-0">
          <Menu className="w-4 h-4" />
        </button>
        <div className="relative flex-1 min-w-[80px] max-w-[150px]">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search"
            className="h-7 w-full pl-6 pr-5 text-[11px] bg-white border border-slate-200 rounded text-slate-900 focus:outline-none focus:ring-1 focus:ring-orange-500 min-w-0"
          />
          {searchQuery && (
            <button onClick={() => onSearchChange("")} className="absolute right-2 top-1.5 text-slate-400 hover:text-slate-600">
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end gap-1.5 shrink-0 min-w-0">
        <div className="relative hidden lg:block">
          <button onClick={() => setShowSoon(!showSoon)} className="h-7 flex items-center gap-1 px-2 text-[10px] font-semibold text-slate-700 bg-white border border-slate-200 rounded">
            <Sparkles className="w-3 h-3 text-amber-600" />
            <span>Coming Soon</span>
            <ChevronDown className="w-3 h-3" />
          </button>
          {showSoon && (
            <div className="absolute right-0 mt-1 w-40 bg-white border border-slate-200 rounded shadow-card p-1.5 z-50 text-xs">
              <div className="px-1.5 py-0.5 font-bold border-b mb-1 text-slate-800">Upcoming Features</div>
              <div className="px-1.5 py-0.5 hover:bg-slate-50 rounded text-slate-600">AI Maintenance</div>
              <div className="px-1.5 py-0.5 hover:bg-slate-50 rounded text-slate-600">GPS Live Tracking</div>
            </div>
          )}
        </div>

        {/* Orange Add New Button */}
        <button onClick={onAddNew} className="h-7 flex items-center gap-1 px-1.5 sm:px-2 text-[10px] font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded shadow-2xs transition-all shrink-0">
          <Plus className="w-3 h-3" />
          <span className="hidden md:inline">Add New</span>
        </button>

        {/* Dark Navy POS Button */}
        <button onClick={() => alert("POS Terminal")} className="hidden md:flex h-7 items-center gap-1 px-2 text-[10px] font-semibold text-white bg-[#0B2F4F] hover:bg-slate-800 rounded shadow-2xs transition-all shrink-0">
          <Store className="w-3 h-3" />
          <span>POS</span>
        </button>

        {/* Language selector */}
        <div className="relative shrink-0">
          <button onClick={() => setShowLang(!showLang)} className="h-7 flex items-center gap-1 px-1.5 text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded">
            <Flag className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline text-[11px] font-bold text-slate-700">{lang}</span>
          </button>
          {showLang && (
            <div className="absolute right-0 mt-1 w-24 bg-white border border-slate-200 rounded shadow-card p-1 z-50 text-xs">
              {["EN", "US", "ES", "FR"].map((code) => (
                <button key={code} onClick={() => { setLang(code); setShowLang(false); }} className="w-full text-left px-2 py-0.5 hover:bg-slate-100 rounded flex justify-between text-slate-700">
                  <span>{code}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Fullscreen */}
        <button
          onClick={handleFullscreen}
          className="hidden sm:flex h-7 w-7 items-center justify-center text-slate-500 bg-white border border-slate-200 hover:bg-slate-50 rounded relative shrink-0"
          title="Fullscreen"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>

        {/* Messages */}
        <button className="h-7 w-7 flex items-center justify-center text-slate-500 bg-white border border-slate-200 hover:bg-slate-50 rounded relative shrink-0" title="Messages">
          <Mail className="w-3.5 h-3.5" />
          <span className="absolute -top-1 -right-1 min-w-3.5 h-3.5 px-0.5 rounded-full bg-rose-500 text-white text-[8px] leading-[14px] font-bold text-center">
            1
          </span>
        </button>

        {/* Notification Bell */}
        <button className="h-7 w-7 flex items-center justify-center text-slate-500 bg-white border border-slate-200 hover:bg-slate-50 rounded relative shrink-0" title="Notifications">
          <Bell className="w-3.5 h-3.5" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-orange-500 rounded-full" />
        </button>

        {/* Settings */}
        <button className="hidden sm:flex h-7 w-7 items-center justify-center text-slate-500 bg-white border border-slate-200 hover:bg-slate-50 rounded relative shrink-0" title="Settings">
          <Settings className="w-3.5 h-3.5" />
        </button>

        {/* User Profile Avatar */}
        <div className="relative pl-1.5 border-l border-slate-200 shrink-0">
          <button onClick={() => setShowUser(!showUser)} className="h-7 flex items-center gap-1.5 px-1 hover:bg-slate-50 rounded">
            <div className="relative w-5 h-5 rounded-full overflow-hidden border border-slate-200 shrink-0">
              <Image src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150" alt="Avatar" fill className="object-cover" />
            </div>
            <span className="hidden lg:block text-left leading-tight">
              <span className="block text-[10px] font-semibold text-slate-800">Mike Witzel</span>
              <span className="hidden xl:block text-[8px] font-medium text-slate-400">Super Admin</span>
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400 hidden lg:block" />
          </button>
          {showUser && (
            <div className="absolute right-0 mt-1 w-36 bg-white border border-slate-200 rounded-md shadow-card p-1 z-50 text-xs text-slate-700">
              <div className="px-2.5 py-1 border-b font-bold text-slate-900">Mike Witzel</div>
              <button className="w-full text-left px-2.5 py-1 hover:bg-slate-50 flex items-center gap-1.5"><User className="w-3 h-3"/> Profile</button>
              <Link 
                href="/" 
                onClick={() => setShowUser(false)}
                className="w-full text-left px-2.5 py-1 hover:bg-rose-50 text-rose-600 flex items-center gap-1.5"
              >
                <LogOut className="w-3 h-3"/> Log Out
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
