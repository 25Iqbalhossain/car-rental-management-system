"use client";
import React from "react";
import { CustomerHeader } from "./Header";
import { CustomerFooter } from "./Footer";
import { CheckCircle2, ShieldCheck, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export function BookingUI(props: any) {
  const { car, name, setName, email, setEmail, phone, setPhone, pDate, setPDate, dDate, setDDate, loading, confirmed, err, days, total, handleSubmit } = props;
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <CustomerHeader />
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between">
          <Link href="/" className="text-xs font-bold flex items-center gap-1"><ArrowLeft className="w-4 h-4" /> Home</Link>
          <span className="text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">Checkout</span>
        </div>
        {confirmed ? (
          <div className="bg-white rounded-3xl p-8 border text-center space-y-4 max-w-xl mx-auto">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h2 className="text-2xl font-extrabold">Booking Confirmed!</h2>
            <p className="text-xs">Code: <span className="font-bold text-orange-600">{confirmed.bookingCode}</span></p>
            <div className="flex gap-4 justify-center pt-2">
              <Link href="/admin/dashboard" className="px-5 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl">Admin Dashboard</Link>
              <Link href="/" className="px-5 py-2.5 bg-orange-500 text-white text-xs font-bold rounded-xl">Home</Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 border space-y-4">
              <h2 className="text-lg font-extrabold border-b pb-3">Reservation Form</h2>
              {err && <div className="p-3 bg-rose-50 border rounded-xl text-rose-700 text-xs">{err}</div>}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:outline-none transition-all"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Email *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john@example.com"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Phone</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+44 7000 000000"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Pick-Up Date</label>
                    <input
                      type="date"
                      value={pDate}
                      onChange={(e) => setPDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Drop-Off Date</label>
                    <input
                      type="date"
                      value={dDate}
                      onChange={(e) => setDDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:outline-none transition-all"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 active:scale-[0.99] text-white font-extrabold text-xs rounded-xl shadow-md shadow-orange-500/20 transition-all flex justify-center items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />} Confirm Booking (£{total})
                </button>
              </form>
            </div>
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 border space-y-4">
              <h3 className="text-base font-extrabold border-b pb-3">Vehicle Details</h3>
              <img src={car.image} alt={car.name} className="w-full h-40 object-cover rounded-2xl border" />
              <h4 className="font-extrabold text-base">{car.name}</h4>
              <p className="text-xs text-slate-500">Rate: £{car.pricePerDay}/day • {days} Days</p>
              <div className="text-sm font-extrabold text-orange-600 pt-2 border-t flex justify-between"><span>Total:</span><span>£{total}</span></div>
            </div>
          </div>
        )}
      </main>
      <CustomerFooter />
    </div>
  );
}
