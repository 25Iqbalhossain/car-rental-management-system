"use client";

import React, { useState } from "react";
import { Transaction, TransactionStatus } from "@/types/dashboard";
import { StatusBadge } from "./StatusBadge";
import Image from "next/image";
import { CreditCard, X } from "lucide-react";

interface RecentTransactionsProps {
  transactions: Transaction[];
  currentFilter: "All" | TransactionStatus;
  onFilterChange: (status: "All" | TransactionStatus) => void;
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  transactions,
  currentFilter,
  onFilterChange,
}) => {
  const [showAll, setShowAll] = useState(false);
  const tabs: Array<"All" | TransactionStatus> = ["All", "Success", "Pending", "Cancelled"];

  return (
    <div className="bg-white border border-slate-200 rounded-md p-2.5 shadow-2xs flex flex-col justify-between h-full">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1.5 border-b border-slate-100">
          <h3 className="text-xs font-bold text-slate-900">
            Recent Transactions
          </h3>

          <div className="flex items-center gap-2 flex-wrap justify-between sm:justify-end">
            <div className="flex items-center bg-slate-100 p-0.5 rounded text-[10px] font-semibold">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => onFilterChange(tab)}
                  className={`px-2 py-0.5 rounded transition-all ${
                    currentFilter === tab ? "bg-white text-orange-600 shadow-2xs font-bold" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <button onClick={() => setShowAll(true)} className="text-[11px] font-semibold text-orange-500 hover:text-orange-600">
              View All
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold text-[10px]">
                <th className="py-1 px-2 w-6">#</th>
                <th className="py-1 px-2">Order Details</th>
                <th className="py-1 px-2">Payment</th>
                <th className="py-1 px-2">Status</th>
                <th className="py-1 px-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.slice(0, 5).map((tx, idx) => (
                <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-1 px-2 text-[10px] font-medium text-slate-400">{idx + 1}</td>
                  <td className="py-1 px-2">
                    <div className="flex items-center gap-2">
                      <div className="relative w-6 h-6 rounded bg-slate-100 overflow-hidden border border-slate-200 shrink-0">
                        <Image src={tx.vehicleImage} alt={tx.vehicleName} fill className="object-cover" sizes="24px" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-xs text-slate-800 truncate">{tx.vehicleName}</p>
                        <p className="text-[9px] text-slate-400">{tx.timeAgo}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-1 px-2 text-[11px] text-slate-600">
                    <div className="flex flex-col leading-tight">
                      <span className="flex items-center gap-1">
                        <CreditCard className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{tx.paymentMethod}</span>
                      </span>
                      <span className="text-[9px] text-slate-400">{tx.bookingCode}</span>
                    </div>
                  </td>
                  <td className="py-1 px-2"><StatusBadge status={tx.status} /></td>
                  <td className="py-1 px-2 text-right font-bold text-slate-900 text-xs">{tx.currency}{tx.amount.toFixed(2)}</td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-xs text-slate-400">No transactions found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAll && (
        <div className="fixed inset-0 bg-slate-900/45 z-50 flex items-center justify-center p-3 lg:p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[85vh] flex flex-col shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-base text-slate-900">All Booking Transactions</h3>
              <button onClick={() => setShowAll(false)} className="p-1 text-slate-400 hover:text-slate-600"><X className="w-5 h-5"/></button>
            </div>
            <div className="p-4 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <tbody className="divide-y">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50">
                      <td className="py-2 font-mono text-orange-600">{tx.bookingCode}</td>
                      <td className="py-2 font-semibold">{tx.vehicleName}</td>
                      <td className="py-2 text-slate-600">{tx.customerName}</td>
                      <td className="py-2">{tx.paymentMethod}</td>
                      <td className="py-2"><StatusBadge status={tx.status} /></td>
                      <td className="py-2 text-right font-bold">{tx.currency}{tx.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
