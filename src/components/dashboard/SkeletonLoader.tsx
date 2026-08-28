import React from "react";

export const SkeletonLoader: React.FC = () => {
  return (
    <div className="space-y-2.5 animate-pulse p-2.5 lg:p-3">
      {/* Greeting Skeleton */}
      <div className="h-10 bg-slate-200 rounded-md" />

      {/* Stat Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
        <div className="h-28 bg-slate-200 rounded-md" />
        <div className="h-28 bg-slate-200 rounded-md" />
        <div className="h-28 bg-slate-200 rounded-md" />
      </div>

      {/* Middle Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2.5">
        <div className="lg:col-span-2 h-48 bg-slate-200 rounded-md" />
        <div className="h-48 bg-slate-200 rounded-md" />
      </div>

      {/* Bottom Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2.5">
        <div className="lg:col-span-2 h-52 bg-slate-200 rounded-md" />
        <div className="h-52 bg-slate-200 rounded-md" />
      </div>
    </div>
  );
};

export const ErrorState: React.FC<{ message?: string; onRetry: () => void }> = ({
  message = "Unable to load dashboard data right now.",
  onRetry,
}) => {
  return (
    <div className="min-h-[320px] flex flex-col items-center justify-center p-5 bg-white border border-rose-100 rounded-md text-center">
      <div className="w-9 h-9 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-sm mb-3">
        !
      </div>
      <h3 className="text-base font-bold text-slate-900 mb-1">Failed to Sync Dashboard</h3>
      <p className="text-xs text-slate-500 max-w-md mb-4">{message}</p>
      <button
        onClick={onRetry}
        className="px-3 py-1.5 text-xs font-semibold text-white bg-[#0B2F4F] hover:bg-slate-800 rounded shadow-sm"
      >
        Retry Data Fetch
      </button>
    </div>
  );
};

export const EmptyState: React.FC<{ title?: string; description?: string }> = ({
  title = "No Data Found",
  description = "There are no records matching your current filter settings.",
}) => {
  return (
    <div className="py-8 flex flex-col items-center justify-center text-center p-4">
      <div className="w-9 h-9 rounded-md bg-slate-100 text-slate-400 flex items-center justify-center text-lg font-bold mb-3">
        ∅
      </div>
      <h4 className="text-sm font-bold text-slate-800 mb-1">{title}</h4>
      <p className="text-xs text-slate-500 max-w-sm">{description}</p>
    </div>
  );
};
