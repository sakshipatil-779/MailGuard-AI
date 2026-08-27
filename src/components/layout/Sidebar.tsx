"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldAlert,
  LayoutDashboard,
  SearchCode,
  Mail,
  FolderGit2,
  BellRing,
  FileSpreadsheet,
  Settings,
  UserCheck,
  Zap,
  ChevronRight,
  Fingerprint
} from "lucide-react";
import { useSecurity } from "@/context/SecurityContext";

export function Sidebar() {
  const pathname = usePathname();
  const { userRole, userName, unreadAlertsCount } = useSecurity();

  const navItems = [
    {
      name: "SOC Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      badge: null
    },
    {
      name: "Analyze Email",
      href: "/analyze",
      icon: SearchCode,
      badge: "LIVE"
    },
    {
      name: "Analyzed Mail",
      href: "/emails",
      icon: Mail,
      badge: null
    },
    {
      name: "Investigations",
      href: "/investigations",
      icon: FolderGit2,
      badge: null
    },
    {
      name: "Alert Center",
      href: "/alerts",
      icon: BellRing,
      badge: unreadAlertsCount > 0 ? unreadAlertsCount : null,
      badgeColor: "bg-rose-500 text-white"
    },
    {
      name: "Forensic Reports",
      href: "/reports",
      icon: FileSpreadsheet,
      badge: null
    },
    {
      name: "Settings & Privacy",
      href: "/settings",
      icon: Settings,
      badge: null
    }
  ];

  return (
    <aside className="w-64 bg-[#1a2A2f] border-r border-[#1a2A2f] flex flex-col h-screen fixed left-0 top-0 z-40 shadow-xl">
      {/* Brand Header (#1a2A2f) */}
      <div className="h-16 px-5 flex items-center border-b border-[#131d22] gap-3 bg-[#1a2A2f]">
        <div className="w-9 h-9 rounded-lg bg-[#88BDF2] flex items-center justify-center shadow-md">
          <ShieldAlert className="w-5 h-5 text-[#1a2A2f] stroke-[2.5]" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-base tracking-wide text-white">SENTINEL</span>
            <span className="text-xs px-1.5 py-0.5 rounded bg-[#88BDF2] text-[#1a2A2f] font-mono font-bold">
              AI SOC
            </span>
          </div>
          <p className="text-[11px] text-[#88BDF2] font-mono tracking-tight font-medium">Threat Intelligence Platform</p>
        </div>
      </div>

      {/* Navigation Links - Buttons in Hamburger Menu (#88BDF2 when active) */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto bg-[#1a2A2f]">
        <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-[#88BDF2] font-bold">
          Core Operations
        </div>

        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all group ${
                isActive
                  ? "bg-[#88BDF2] text-[#1a2A2f] font-bold shadow-md"
                  : "text-slate-300 hover:bg-[#88BDF2]/20 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? "text-[#1a2A2f]" : "text-[#88BDF2] group-hover:text-white"
                  }`}
                />
                <span>{item.name}</span>
              </div>

              {item.badge && (
                <span
                  className={`px-1.5 py-0.5 text-[10px] font-mono font-bold rounded ${
                    item.badgeColor || (isActive ? "bg-[#1a2A2f] text-white" : "bg-[#88BDF2] text-[#1a2A2f]")
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        {/* Live Telemetry Status */}
        <div className="pt-4 px-1">
          <div className="p-3 rounded-lg bg-[#131d22] text-white text-[11px] space-y-2 border border-[#88BDF2]/20 shadow-inner">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[#88BDF2]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse glow-dot-emerald"></span>
                SOC Engine Status
              </span>
              <span className="text-emerald-400 font-mono font-semibold">ONLINE</span>
            </div>
            <div className="flex items-center justify-between text-slate-300 font-mono text-[10px]">
              <span>Threat DB Version</span>
              <span className="text-[#88BDF2] font-bold">2026.8.27-r1</span>
            </div>
          </div>
        </div>
      </nav>

      {/* User / Role Footer (#1a2A2f) */}
      <div className="p-3 border-t border-[#131d22] bg-[#1a2A2f]">
        <div className="flex items-center gap-2.5 p-2 rounded-lg bg-[#131d22] text-white border border-[#88BDF2]/20 shadow-md">
          <div className="w-8 h-8 rounded bg-[#88BDF2] text-[#1a2A2f] flex items-center justify-center font-bold text-xs">
            {userName.substring(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-white truncate">{userName}</div>
            <div className="flex items-center gap-1 text-[10px] text-[#88BDF2] font-mono">
              <Fingerprint className="w-3 h-3 text-[#88BDF2]" />
              <span className="truncate">{userRole}</span>
            </div>
          </div>
          {/* Button on footer (#88BDF2) */}
          <Link
            href="/settings"
            title="Switch Role & Settings"
            className="p-1.5 bg-[#88BDF2] hover:bg-[#88BDF2]/90 rounded-md text-[#1a2A2f] transition-colors flex items-center justify-center"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
