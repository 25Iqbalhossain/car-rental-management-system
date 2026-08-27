"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, ShieldAlert, Boxes, PlusCircle, ClockAlert, TrendingDown,
  FolderTree, GitFork, Tags, Ruler, Sliders, ShieldCheck, Barcode, QrCode,
  Warehouse, ArrowLeftRight, SlidersHorizontal, ShoppingBag, Receipt, RotateCcw,
  FileText, Calculator, ChevronDown, ChevronRight, X, Car
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeItem?: string;
  onSelectItem?: (item: string) => void;
}

const GROUPS = [
  {
    title: "Main",
    items: [
      { id: "Dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "Super Admin", label: "Super Admin", icon: ShieldAlert, badge: "Pro" },
    ],
  },
  {
    title: "Inventory",
    items: [
      { id: "Products", label: "Products", icon: Boxes },
      { id: "Create Product", label: "Create Product", icon: PlusCircle },
      { id: "Expired Products", label: "Expired Products", icon: ClockAlert },
      { id: "Low Stocks", label: "Low Stocks", icon: TrendingDown, badge: "12" },
      { id: "Category", label: "Category", icon: FolderTree },
      { id: "Sub Category", label: "Sub Category", icon: GitFork },
      { id: "Brands", label: "Brands", icon: Tags },
      { id: "Units", label: "Units", icon: Ruler },
      { id: "Variant Attributes", label: "Variant Attributes", icon: Sliders },
      { id: "Warranties", label: "Warranties", icon: ShieldCheck },
      { id: "Print Barcode", label: "Print Barcode", icon: Barcode },
      { id: "Print QR Code", label: "Print QR Code", icon: QrCode },
    ],
  },
  {
    title: "Stock",
    items: [
      { id: "Manage Stock", label: "Manage Stock", icon: Warehouse },
      { id: "Stock Adjustment", label: "Stock Adjustment", icon: SlidersHorizontal },
      { id: "Stock Transfer", label: "Stock Transfer", icon: ArrowLeftRight },
    ],
  },
  {
    title: "Sales",
    items: [
      { id: "Sales", label: "Sales", icon: ShoppingBag },
      { id: "Invoices", label: "Invoices", icon: Receipt },
      { id: "Sales Return", label: "Sales Return", icon: RotateCcw },
      { id: "Quotation", label: "Quotation", icon: FileText },
      { id: "POS", label: "POS", icon: Calculator },
    ],
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, activeItem = "Dashboard", onSelectItem }) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ Main: true, Inventory: true, Stock: true, Sales: true });

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape" && isOpen) onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden" onClick={onClose} />}
      <aside className={cn(
        "fixed top-0 left-0 bottom-0 z-50 w-56 bg-white text-slate-700 flex flex-col border-r border-slate-200 transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto shrink-0 select-none",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Sidebar Brand Header */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white font-extrabold shadow-sm shadow-orange-500/30">
              <Car className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold text-sm text-slate-900 tracking-tight block leading-tight">Digital Pylot</span>
              <span className="text-[9px] uppercase font-bold tracking-wider text-orange-600">Super Admin</span>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden p-1 text-slate-400 hover:text-slate-700"><X className="w-4 h-4" /></button>
        </div>

        {/* Sidebar Scrollable Items */}
        <div className="flex-1 overflow-y-auto px-2.5 py-3 space-y-3">
          {GROUPS.map((group) => (
            <div key={group.title} className="space-y-0.5">
              <button
                onClick={() => setExpanded(p => ({ ...p, [group.title]: !p[group.title] }))}
                className="w-full flex items-center justify-between px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-600"
              >
                <span>{group.title}</span>
                {expanded[group.title] ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              </button>
              {expanded[group.title] && (
                <ul className="space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const active = activeItem === item.id;
                    return (
                      <li key={item.id}>
                        <button
                          onClick={() => { onSelectItem?.(item.id); if (window.innerWidth < 1024) onClose(); }}
                          className={cn(
                            "w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-all group",
                            active
                              ? "bg-orange-500 text-white font-semibold shadow-xs shadow-orange-500/20"
                              : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                          )}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Icon className={cn("w-3.5 h-3.5 shrink-0", active ? "text-white" : "text-slate-400 group-hover:text-orange-500")} />
                            <span className="truncate">{item.label}</span>
                          </div>
                          {item.badge && (
                            <span className={cn(
                              "text-[9px] px-1.5 py-0.2 rounded font-bold shrink-0",
                              active ? "bg-white/20 text-white" : "bg-orange-100 text-orange-700"
                            )}>
                              {item.badge}
                            </span>
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          ))}
        </div>
      </aside>
    </>
  );
};
