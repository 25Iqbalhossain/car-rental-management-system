import React from "react";
import { cn } from "@/lib/utils";
import { TransactionStatus } from "@/types/dashboard";

interface StatusBadgeProps {
  status: TransactionStatus | "Available" | "Rented" | "Maintenance";
  showIcon?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className,
}) => {
  const getStatusStyles = () => {
    switch (status) {
      case "Success":
      case "Available":
        return "bg-emerald-50 text-emerald-600 border-emerald-200";
      case "Pending":
      case "Maintenance":
        return "bg-blue-50 text-blue-600 border-blue-200";
      case "Cancelled":
      case "Rented":
        return "bg-rose-50 text-rose-600 border-rose-200";
      default:
        return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-1.5 py-[3px] text-[9px] font-semibold rounded-full border leading-none",
        getStatusStyles(),
        className
      )}
    >
      {status}
    </span>
  );
};
