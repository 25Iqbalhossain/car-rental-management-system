"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, ShieldAlert, Boxes, PlusCircle, ClockAlert, TrendingDown,
  FolderTree, GitFork, Tags, Ruler, Sliders, ShieldCheck, Barcode, QrCode,
  Warehouse, ArrowLeftRight, SlidersHorizontal, ShoppingBag, Receipt, RotateCcw,
  FileText, Calculator, ChevronDown, ChevronRight, X, Car
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeItem?: string;
  onSelectItem?: (item: string) => void;
}

const GROUPS = [
  {
    title: "MAIN",
    items: [
      { id: "Dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "Super Admin", label: "Super Admin", icon: ShieldAlert },
    ],
  },
  {
    title: "INVENTORY",
    items: [
      { id: "Products", label: "Products", icon: Boxes },
      { id: "Create Product", label: "Create Product", icon: PlusCircle },
      { id: "Expired Products", label: "Expired Products", icon: ClockAlert },
      { id: "Low Stocks", label: "Low Stocks", icon: TrendingDown },
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
    title: "STOCK",
    items: [
      { id: "Manage Stock", label: "Manage Stock", icon: Warehouse },
      { id: "Stock Adjustment", label: "Stock Adjustment", icon: SlidersHorizontal },
      { id: "Stock Transfer", label: "Stock Transfer", icon: ArrowLeftRight },
    ],
  },
  {
    title: "SALES",
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
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ MAIN: true, INVENTORY: true, STOCK: true, SALES: true });

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape" && isOpen) onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-slate-900/25 z-40 lg:hidden" onClick={onClose} />}
      <aside className={cn(
        "fixed top-0 left-0 bottom-0 z-50 w-[206px] bg-white text-slate-700 flex flex-col border-r border-slate-200 transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto admin-sidebar select-none",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Sidebar Brand Header */}
        <div className="h-[50px] flex items-center justify-between px-2 border-b border-slate-100 bg-white shrink-0">
          <Link href="/" className="relative w-[110px] h-[32px] shrink-0 block" title="Go to home page">
             <Image src="/assets/admin/logo.png" alt="Digital Pylot" fill className="object-contain rounded" />
          </Link>
          <button onClick={onClose} className="lg:hidden p-1 text-slate-400 hover:text-slate-700 shrink-0"><X className="w-4 h-4" /></button>
        </div>

        {/* Sidebar Scrollable Items */}
        <div className="flex-1 overflow-y-auto px-1.5 py-1 space-y-0.5">
          {GROUPS.map((group) => (
            <div key={group.title} className="space-y-0.5">
              <button
                onClick={() => setExpanded(p => ({ ...p, [group.title]: !p[group.title] }))}
                className="w-full flex items-center justify-between px-1 py-0.5 text-[8px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-600"
              >
                <span>{group.title}</span>
                {expanded[group.title] ? <ChevronDown className="w-2.5 h-2.5" /> : <ChevronRight className="w-2.5 h-2.5" />}
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
                            "w-full flex items-center justify-between px-1.5 py-1 rounded text-[10px] font-medium transition-all group",
                            active
                              ? "bg-orange-50 text-orange-600 font-semibold border border-orange-100"
                              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                          )}
                        >
                          <div className="flex items-center gap-1.5 min-w-0">
                            <Icon className={cn("w-3 h-3 shrink-0", active ? "text-orange-500" : "text-slate-400 group-hover:text-slate-600")} />
                            <span className="truncate">{item.label}</span>
                          </div>
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
