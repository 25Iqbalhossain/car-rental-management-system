"use client";

import Link from "next/link";
import { Car, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-orange-500 flex items-center justify-center text-white font-extrabold shadow-lg mb-4">
        <Car className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Page Not Found</h1>
      <p className="text-slate-600 text-sm max-w-md mb-6">
        Sorry, the page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-md transition-all"
      >
        <ArrowLeft className="w-4 h-4" /> Return to Home
      </Link>
    </div>
  );
}
