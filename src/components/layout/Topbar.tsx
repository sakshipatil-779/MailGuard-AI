"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  Eye,
  EyeOff,
  Bell,
  PlusCircle,
  Shield,
  Layers,
  ChevronDown,
  Lock,
  ExternalLink,
  CheckCircle2,
  Menu
} from "lucide-react";
import { useSecurity } from "@/context/SecurityContext";
import { UserRole } from "@/types/threat";

export function Topbar() {
  const pathname = usePathname();
  const {
    userRole,
    setUserRole,
    maskPii,
    setMaskPii,
    maskIps,
    setMaskIps,
    setIsSearchOpen,
    unreadAlertsCount,
    alerts
  } = useSecurity();

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [alertsDropdownOpen, setAlertsDropdownOpen] = useState(false);

  const getPageTitle = () => {
    if (pathname === "/dashboard") return { title: "SOC Threat Operations Center", sub: "Live email threat telemetry & attack vector monitoring" };
    if (pathname === "/analyze") return { title: "Email Threat Analyzer", sub: "Deep RFC header forensics, heuristic AI classifier & origin tracing" };
    if (pathname === "/emails") return { title: "Analyzed Mail Repository", sub: "Historical threat detections, forensically preserved emails & telemetry" };
    if (pathname.startsWith("/emails/")) return { title: "Forensic Investigation Dossier", sub: "Multi-hop relay path, SPF/DKIM validation & IOC extraction" };
    if (pathname === "/investigations") return { title: "Incident Case Management", sub: "Active threat investigations, evidence locker & campaign correlation" };
    if (pathname.startsWith("/investigations/")) return { title: "Case Workspace", sub: "Associated emails, IOCs, timeline & campaign graph" };
    if (pathname === "/alerts") return { title: "Security Alert Center", sub: "Real-time threat feed, heuristic detection triggers & triage" };
    if (pathname.startsWith("/reports")) return { title: "Forensic Threat Reports", sub: "Executive summaries, chain of custody certificates & PDF exports" };
    if (pathname === "/settings") return { title: "System & Privacy Settings", sub: "Data masking, role-based access control & threat intel feeds" };
    return { title: "MailGuard-AI", sub: "Email Threat Intelligence & Forensic Platform" };
  };

  const { title, sub } = getPageTitle();

  const roles: { role: UserRole; label: string; desc: string }[] = [
    { role: "SECURITY_ANALYST", label: "Security Analyst (Tier 2)", desc: "Full analysis, case management, IOC lookup" },
    { role: "INVESTIGATOR", label: "Lead Forensic Investigator", desc: "Evidence preservation, campaign graph, reporting" },
    { role: "ADMIN", label: "SOC Administrator / CISO", desc: "Policy configuration, full access, user management" },
    { role: "AUDITOR", label: "Compliance & Security Auditor", desc: "Audit logs, chain of custody verification" },
    { role: "VIEWER", label: "Read-Only Stakeholder", desc: "Read-only access to dashboard and sanitized reports" },
  ];

  return (
    <header className="h-16 bg-[#1a2A2f] border-b border-[#1a2A2f] sticky top-0 z-30 shadow-md px-6 flex items-center justify-between ml-64 text-white">
      {/* Page Title & Hamburger Menu (#1a2A2f Header) */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsSearchOpen(true)}
          title="Toggle Command Menu"
          className="p-2 rounded-lg bg-[#88BDF2] text-[#1a2A2f] hover:bg-[#88BDF2]/90 transition-colors shadow-sm flex items-center justify-center font-bold"
        >
          <Menu className="w-4 h-4 text-[#1a2A2f]" />
        </button>

        <div>
          <h1 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
            {title}
          </h1>
          <p className="text-[11px] text-[#88BDF2] font-mono">{sub}</p>
        </div>
      </div>

      {/* Action Controls - Buttons in Header (#88BDF2 with #1a2A2f font) */}
      <div className="flex items-center gap-3">
        {/* Global Search Button in Header (#88BDF2) */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-[#88BDF2] text-[#1a2A2f] hover:bg-[#88BDF2]/90 text-xs font-semibold transition-all shadow-sm"
        >
          <Search className="w-3.5 h-3.5 text-[#1a2A2f]" />
          <span>Search emails, IPs, IOCs, cases...</span>
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-[#1a2A2f] text-white rounded">
            Ctrl+K
          </kbd>
        </button>

        {/* Privacy Masking Toggles in Header (#88BDF2) */}
        <div className="flex items-center bg-[#88BDF2] rounded-lg p-1 text-xs shadow-sm">
          <button
            onClick={() => setMaskPii(!maskPii)}
            title={maskPii ? "PII Data is MASKED" : "PII Data is VISIBLE"}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono font-bold transition-all ${
              maskPii
                ? "bg-[#1a2A2f] text-white"
                : "text-[#1a2A2f] hover:bg-[#1a2A2f]/15"
            }`}
          >
            {maskPii ? <EyeOff className="w-3.5 h-3.5 text-white" /> : <Eye className="w-3.5 h-3.5 text-[#1a2A2f]" />}
            <span>PII Mask</span>
          </button>

          <button
            onClick={() => setMaskIps(!maskIps)}
            title={maskIps ? "IP Octets are MASKED" : "IP Addresses are VISIBLE"}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono font-bold transition-all ${
              maskIps
                ? "bg-[#1a2A2f] text-white"
                : "text-[#1a2A2f] hover:bg-[#1a2A2f]/15"
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>IP Mask</span>
          </button>
        </div>

        {/* Role Selector Button in Header (#88BDF2) */}
        <div className="relative">
          <button
            onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#88BDF2] text-[#1a2A2f] hover:bg-[#88BDF2]/90 text-xs font-mono font-bold transition-all shadow-sm"
          >
            <Shield className="w-3.5 h-3.5 text-[#1a2A2f]" />
            <span className="font-semibold">{userRole}</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#1a2A2f]" />
          </button>

          {roleDropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-[#1a2A2f] border border-[#88BDF2]/40 rounded-xl shadow-2xl p-2 z-50 text-white">
              <div className="px-2 py-1 text-[10px] font-mono text-[#88BDF2] uppercase tracking-wider border-b border-[#88BDF2]/20 mb-1">
                Simulate Role Permissions
              </div>
              {roles.map((r) => (
                <button
                  key={r.role}
                  onClick={() => {
                    setUserRole(r.role);
                    setRoleDropdownOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-2 rounded-lg text-xs transition-colors flex items-start justify-between ${
                    userRole === r.role
                      ? "bg-[#88BDF2] text-[#1a2A2f] font-bold"
                      : "text-slate-200 hover:bg-[#88BDF2]/20"
                  }`}
                >
                  <div>
                    <div className="font-semibold">{r.label}</div>
                    <div className="text-[10px] text-slate-300 mt-0.5">{r.desc}</div>
                  </div>
                  {userRole === r.role && <CheckCircle2 className="w-4 h-4 text-[#1a2A2f] shrink-0 mt-0.5" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Alert Button in Header (#88BDF2) */}
        <div className="relative">
          <button
            onClick={() => setAlertsDropdownOpen(!alertsDropdownOpen)}
            className="relative p-2 rounded-lg bg-[#88BDF2] text-[#1a2A2f] hover:bg-[#88BDF2]/90 transition-all shadow-sm"
          >
            <Bell className="w-4 h-4 text-[#1a2A2f]" />
            {unreadAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                {unreadAlertsCount}
              </span>
            )}
          </button>

          {alertsDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-[#1a2A2f] border border-[#88BDF2]/40 rounded-xl shadow-2xl p-3 z-50 text-white">
              <div className="flex items-center justify-between pb-2 border-b border-[#88BDF2]/20 mb-2">
                <span className="text-xs font-bold text-white">Live Threat Alerts</span>
                <Link
                  href="/alerts"
                  onClick={() => setAlertsDropdownOpen(false)}
                  className="text-[11px] text-[#88BDF2] hover:underline flex items-center gap-1"
                >
                  View All ({alerts.length}) <ExternalLink className="w-3 h-3" />
                </Link>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {alerts.slice(0, 4).map((alert) => (
                  <Link
                    key={alert.id}
                    href={`/emails/${alert.emailId}`}
                    onClick={() => setAlertsDropdownOpen(false)}
                    className="block p-2 rounded-lg bg-[#131d22] hover:bg-[#88BDF2]/20 text-white transition-all group border border-slate-800"
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-rose-400 font-semibold">{alert.severity.toUpperCase()}</span>
                      <span className="text-[#88BDF2]">{new Date(alert.detectedAt).toLocaleTimeString()}</span>
                    </div>
                    <div className="text-xs text-white font-medium truncate mt-0.5">
                      {alert.subject}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono truncate mt-0.5">
                      From: {alert.sender}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick Action Button in Header (#88BDF2 with #1a2A2f font) */}
        <Link
          href="/analyze"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#88BDF2] hover:bg-[#88BDF2]/90 text-[#1a2A2f] font-bold text-xs shadow-sm transition-all"
        >
          <PlusCircle className="w-3.5 h-3.5 text-[#1a2A2f] stroke-[2.5]" />
          <span>New Analysis</span>
        </Link>
      </div>
    </header>
  );
}
