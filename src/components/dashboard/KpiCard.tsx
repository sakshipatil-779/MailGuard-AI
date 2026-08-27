"use client";

import React from "react";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  color: "cyan" | "rose" | "amber" | "indigo" | "emerald" | "purple";
  badge?: string;
}

export function KpiCard({
  title,
  value,
  subtitle,
  change,
  isPositive = true,
  icon: Icon,
  color,
  badge
}: KpiCardProps) {
  const colorStyles = {
    cyan: {
      border: "border-slate-200 hover:border-[#88BDF2]",
      bg: "bg-[#88BDF2]/15",
      text: "text-[#1a2A2f]",
      glow: "hover:shadow-md",
      accent: "from-[#88BDF2]/20 to-transparent"
    },
    rose: {
      border: "border-rose-200 hover:border-rose-400",
      bg: "bg-rose-50",
      text: "text-rose-600",
      glow: "hover:shadow-md",
      accent: "from-rose-100 to-transparent"
    },
    amber: {
      border: "border-amber-200 hover:border-amber-400",
      bg: "bg-amber-50",
      text: "text-amber-600",
      glow: "hover:shadow-md",
      accent: "from-amber-100 to-transparent"
    },
    indigo: {
      border: "border-slate-200 hover:border-[#88BDF2]",
      bg: "bg-[#88BDF2]/15",
      text: "text-[#1a2A2f]",
      glow: "hover:shadow-md",
      accent: "from-[#88BDF2]/20 to-transparent"
    },
    emerald: {
      border: "border-emerald-200 hover:border-emerald-400",
      bg: "bg-emerald-50",
      text: "text-emerald-600",
      glow: "hover:shadow-md",
      accent: "from-emerald-100 to-transparent"
    },
    purple: {
      border: "border-slate-200 hover:border-[#88BDF2]",
      bg: "bg-[#88BDF2]/15",
      text: "text-[#1a2A2f]",
      glow: "hover:shadow-md",
      accent: "from-[#88BDF2]/20 to-transparent"
    }
  };

  const style = colorStyles[color];

  return (
    <div
      className={`p-4 rounded-xl bg-white border transition-all duration-300 relative overflow-hidden shadow-sm ${style.border} ${style.glow}`}
    >
      {/* Background Gradient Splash */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${style.accent} rounded-full blur-2xl pointer-events-none`} />

      <div className="flex items-start justify-between">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
            {title}
          </div>
          <div className="text-2xl font-black text-[#1a2A2f] font-mono mt-1 tracking-tight">
            {value}
          </div>
        </div>

        <div className={`w-10 h-10 rounded-lg ${style.bg} border ${style.border} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${style.text}`} />
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs">
        {subtitle && <span className="text-slate-400 font-mono text-[11px]">{subtitle}</span>}
        
        {change && (
          <div className={`flex items-center gap-1 font-mono text-[11px] font-semibold ${
            isPositive ? "text-emerald-600" : "text-rose-600"
          }`}>
            {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            <span>{change}</span>
          </div>
        )}

        {badge && (
          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${style.bg} ${style.text} border ${style.border}`}>
            {badge}
          </span>
        )}
      </div>
    </div>
  );
}
