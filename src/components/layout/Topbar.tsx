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
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
    unreadAlertsCount,
    alerts,
    firebaseUser,
    signInWithGoogle,
    logout
  } = useSecurity();

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [alertsDropdownOpen, setAlertsDropdownOpen] = useState(false);

  const getPageTitle = () => {
    if (pathname === "/dashboard") return { title: "SOC Threat Operations", sub: "Live email threat telemetry & attack monitoring" };
    if (pathname === "/analyze") return { title: "Email Threat Analyzer", sub: "Deep RFC header forensics & heuristic AI" };
    if (pathname === "/emails") return { title: "Analyzed Mail Vault", sub: "Historical threat detections & forensics" };
    if (pathname.startsWith("/emails/")) return { title: "Forensic Dossier", sub: "Relay path, SPF/DKIM validation & IOCs" };
    if (pathname === "/investigations") return { title: "Incident Cases", sub: "Active threat investigations & evidence" };
    if (pathname.startsWith("/investigations/")) return { title: "Case Workspace", sub: "Associated emails, IOCs & timeline" };
    if (pathname === "/alerts") return { title: "Alert Center", sub: "Real-time threat feed & automated triage" };
    if (pathname.startsWith("/reports")) return { title: "Threat Reports", sub: "Executive briefs & chain of custody" };
    if (pathname === "/settings") return { title: "Settings & Privacy", sub: "Data masking & access control" };
    return { title: "MailGuard-AI", sub: "Threat Intelligence & Forensics" };
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
    <header className="h-16 bg-[#1a2A2f] border-b border-[#1a2A2f] sticky top-0 z-30 shadow-md px-3 sm:px-6 flex items-center justify-between lg:ml-64 ml-0 text-white transition-all duration-300">
      {/* Page Title & Hamburger Menu (#1a2A2f Header) */}
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        {/* Hamburger toggle for mobile/tablet sidebar */}
        <button
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          title="Toggle Navigation Menu"
          className="p-2 rounded-lg bg-[#88BDF2] text-[#1a2A2f] hover:bg-[#88BDF2]/90 transition-colors shadow-sm flex items-center justify-center font-bold lg:hidden shrink-0"
        >
          <Menu className="w-4 h-4 text-[#1a2A2f]" />
        </button>

        <div className="min-w-0">
          <h1 className="text-xs sm:text-sm font-bold text-white tracking-tight flex items-center gap-2 truncate">
            {title}
          </h1>
          <p className="text-[10px] sm:text-[11px] text-[#88BDF2] font-mono truncate hidden xs:block">{sub}</p>
        </div>
      </div>

      {/* Action Controls - Buttons in Header */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {/* Global Search Button in Header */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center gap-1.5 sm:gap-2.5 px-2 sm:px-3 py-1.5 rounded-lg bg-[#88BDF2] text-[#1a2A2f] hover:bg-[#88BDF2]/90 text-xs font-semibold transition-all shadow-sm"
          title="Search emails, IPs, IOCs (Ctrl+K)"
        >
          <Search className="w-3.5 h-3.5 text-[#1a2A2f] shrink-0" />
          <span className="hidden md:inline">Search emails, IPs, IOCs...</span>
          <span className="hidden sm:inline md:hidden">Search...</span>
          <kbd className="hidden lg:inline px-1.5 py-0.5 text-[10px] font-mono bg-[#1a2A2f] text-white rounded">
            Ctrl+K
          </kbd>
        </button>

        {/* Privacy Masking Toggles in Header */}
        <div className="hidden sm:flex items-center bg-[#88BDF2] rounded-lg p-0.5 sm:p-1 text-xs shadow-sm">
          <button
            onClick={() => setMaskPii(!maskPii)}
            title={maskPii ? "PII Data is MASKED" : "PII Data is VISIBLE"}
            className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] sm:text-[11px] font-mono font-bold transition-all ${
              maskPii
                ? "bg-[#1a2A2f] text-white"
                : "text-[#1a2A2f] hover:bg-[#1a2A2f]/15"
            }`}
          >
            {maskPii ? <EyeOff className="w-3 h-3 text-white" /> : <Eye className="w-3 h-3 text-[#1a2A2f]" />}
            <span className="hidden md:inline">PII</span>
          </button>

          <button
            onClick={() => setMaskIps(!maskIps)}
            title={maskIps ? "IP Octets are MASKED" : "IP Addresses are VISIBLE"}
            className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] sm:text-[11px] font-mono font-bold transition-all ${
              maskIps
                ? "bg-[#1a2A2f] text-white"
                : "text-[#1a2A2f] hover:bg-[#1a2A2f]/15"
            }`}
          >
            <Lock className="w-3 h-3" />
            <span className="hidden md:inline">IP</span>
          </button>
        </div>

        {/* Role Selector Button in Header */}
        <div className="relative">
          <button
            onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
            className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg bg-[#88BDF2] text-[#1a2A2f] hover:bg-[#88BDF2]/90 text-xs font-mono font-bold transition-all shadow-sm"
            title={`Active Role: ${userRole}`}
          >
            <Shield className="w-3.5 h-3.5 text-[#1a2A2f] shrink-0" />
            <span className="font-semibold hidden sm:inline max-w-[80px] md:max-w-[120px] truncate">{userRole}</span>
            <ChevronDown className="w-3 h-3 text-[#1a2A2f] shrink-0" />
          </button>

          {roleDropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 max-w-[calc(100vw-1.5rem)] bg-[#1a2A2f] border border-[#88BDF2]/40 rounded-xl shadow-2xl p-2 z-50 text-white animate-in fade-in zoom-in-95 duration-150">
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

        {/* Notifications Alert Button in Header */}
        <div className="relative">
          <button
            onClick={() => setAlertsDropdownOpen(!alertsDropdownOpen)}
            className="relative p-2 rounded-lg bg-[#88BDF2] text-[#1a2A2f] hover:bg-[#88BDF2]/90 transition-all shadow-sm"
            title="Threat Notifications"
          >
            <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#1a2A2f]" />
            {unreadAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                {unreadAlertsCount}
              </span>
            )}
          </button>

          {alertsDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-1.5rem)] bg-[#1a2A2f] border border-[#88BDF2]/40 rounded-xl shadow-2xl p-3 z-50 text-white animate-in fade-in zoom-in-95 duration-150">
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

        {/* Quick Action Button in Header */}
        <Link
          href="/analyze"
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#88BDF2] hover:bg-[#88BDF2]/90 text-[#1a2A2f] font-bold text-xs shadow-sm transition-all shrink-0"
          title="New Email Analysis"
        >
          <PlusCircle className="w-3.5 h-3.5 text-[#1a2A2f] stroke-[2.5]" />
          <span className="hidden sm:inline">New Analysis</span>
        </Link>

        {/* Firebase Google Auth User Profile / Sign Out */}
        {firebaseUser ? (
          <div className="flex items-center gap-2 pl-1 sm:pl-2 border-l border-slate-700">
            {firebaseUser.photoURL ? (
              <img
                src={firebaseUser.photoURL}
                alt={firebaseUser.displayName || "User"}
                className="w-7 h-7 rounded-full border border-[#88BDF2] shrink-0"
                title={firebaseUser.email || "Google Account"}
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-[#88BDF2] text-[#1a2A2f] font-bold text-xs flex items-center justify-center shrink-0">
                {firebaseUser.displayName?.charAt(0) || "U"}
              </div>
            )}
            <button
              onClick={logout}
              title="Sign Out of Google Session"
              className="text-[10px] font-mono px-2 py-1 rounded bg-[#243240] hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 border border-slate-600 transition-colors hidden md:block"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <button
            onClick={() => signInWithGoogle()}
            title="Sign in with Google"
            className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-[#1a2A2f] text-xs font-mono font-bold transition-all shrink-0 shadow-sm"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span className="hidden sm:inline">Google Login</span>
          </button>
        )}
      </div>
    </header>
  );
}
