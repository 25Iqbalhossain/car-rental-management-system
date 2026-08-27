import React from "react";

export const SkeletonLoader: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse p-4 lg:p-6">
      {/* Greeting Skeleton */}
      <div className="h-20 bg-slate-200 rounded-xl" />

      {/* Stat Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="h-32 bg-slate-200 rounded-xl" />
        <div className="h-32 bg-slate-200 rounded-xl" />
        <div className="h-32 bg-slate-200 rounded-xl" />
      </div>

      {/* Middle Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-72 bg-slate-200 rounded-xl" />
        <div className="h-72 bg-slate-200 rounded-xl" />
      </div>

      {/* Bottom Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-80 bg-slate-200 rounded-xl" />
        <div className="h-80 bg-slate-200 rounded-xl" />
      </div>
    </div>
  );
};

export const ErrorState: React.FC<{ message?: string; onRetry: () => void }> = ({
  message = "Unable to load dashboard data right now.",
  onRetry,
}) => {
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center p-8 bg-white border border-rose-100 rounded-2xl text-center">
      <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-lg mb-3">
        !
      </div>
      <h3 className="text-base font-bold text-slate-900 mb-1">Failed to Sync Dashboard</h3>
      <p className="text-xs text-slate-500 max-w-md mb-4">{message}</p>
      <button
        onClick={onRetry}
        className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
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
    <div className="py-12 flex flex-col items-center justify-center text-center p-4">
      <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center text-xl font-bold mb-3">
        ∅
      </div>
      <h4 className="text-sm font-bold text-slate-800 mb-1">{title}</h4>
      <p className="text-xs text-slate-500 max-w-sm">{description}</p>
    </div>
  );
};
