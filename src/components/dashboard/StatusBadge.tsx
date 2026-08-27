import React from "react";
import { cn } from "@/lib/utils";
import { TransactionStatus } from "@/types/dashboard";
import { CheckCircle2, Clock, XCircle } from "lucide-react";

interface StatusBadgeProps {
  status: TransactionStatus | "Available" | "Rented" | "Maintenance";
  showIcon?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  showIcon = true,
  className,
}) => {
  const getStatusStyles = () => {
    switch (status) {
      case "Success":
      case "Available":
        return {
          bg: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
          dot: "bg-emerald-500",
          icon: CheckCircle2,
        };
      case "Pending":
      case "Maintenance":
        return {
          bg: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
          dot: "bg-amber-500",
          icon: Clock,
        };
      case "Cancelled":
      case "Rented":
        return {
          bg: "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100",
          dot: "bg-rose-500",
          icon: XCircle,
        };
      default:
        return {
          bg: "bg-slate-50 text-slate-700 border-slate-200",
          dot: "bg-slate-500",
          icon: CheckCircle2,
        };
    }
  };

  const style = getStatusStyles();
  const IconComponent = style.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border transition-colors",
        style.bg,
        className
      )}
    >
      {showIcon && <IconComponent className="w-3.5 h-3.5" />}
      <span>{status}</span>
    </span>
  );
};
