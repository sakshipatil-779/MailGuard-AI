"use client";

import React, { useState, useEffect } from "react";
import { useSecurity } from "@/context/SecurityContext";
import { MockStorage, AuditLogEntry } from "@/lib/storage/mock-store";
import { UserRole } from "@/types/threat";
import {
  Settings,
  Shield,
  Eye,
  EyeOff,
  Lock,
  Server,
  Activity,
  CheckCircle2,
  Database,
  Terminal,
  Key
} from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const {
    userRole,
    setUserRole,
    userName,
    userEmail,
    maskPii,
    setMaskPii,
    maskIps,
    setMaskIps
  } = useSecurity();

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [vtApiKey, setVtApiKey] = useState("vt_sec_live_98a72b019842c");
  const [abuseIpApiKey, setAbuseIpApiKey] = useState("abuseipdb_token_719024f");

  useEffect(() => {
    const logs = MockStorage.getAuditLogs();
    if (logs.length === 0) {
      MockStorage.addAuditLog("SYSTEM_INIT", "SYSTEM", "SOC-01", "Sentinel AI SOC Engine initialized");
      MockStorage.addAuditLog("POLICY_SYNC", "CONFIG", "POL-2026", "Synchronized threat detection heuristics");
      setAuditLogs(MockStorage.getAuditLogs());
    } else {
      setAuditLogs(logs);
    }
  }, []);

  const roles: { role: UserRole; title: string; desc: string }[] = [
    {
      role: "SECURITY_ANALYST",
      title: "Security Analyst (SOC Tier 2)",
      desc: "Full email threat analysis, IOC lookups, and incident case escalation."
    },
    {
      role: "INVESTIGATOR",
      title: "Lead Forensic Investigator",
      desc: "Deep forensic reconstruction, evidence sealing, and campaign graph correlation."
    },
    {
      role: "ADMIN",
      title: "SOC Administrator / CISO",
      desc: "Global system configuration, user role management, and retention policies."
    },
    {
      role: "AUDITOR",
      title: "Compliance & Security Auditor",
      desc: "Chain of custody verification, read-only audit log inspection, and SOC compliance."
    },
    {
      role: "VIEWER",
      title: "Read-Only Stakeholder",
      desc: "View-only access to executive threat summaries and sanitized reports."
    }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="p-5 rounded-xl bg-[#1a242f] border border-[#384959] flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#88BDF2]" />
            <h2 className="text-base font-bold text-white">System & Privacy Configuration</h2>
          </div>
          <p className="text-xs text-[#6A89A7] font-mono mt-0.5">
            Role-based access control, PII obfuscation policy, threat feeds & tamper-evident audit logs
          </p>
        </div>

        <div className="text-right font-mono text-xs text-[#6A89A7]">
          Active Session: <strong className="text-[#BDDDFC]">{userName}</strong>
        </div>
      </div>

      {/* Privacy Data Masking Section */}
      <div className="p-6 rounded-2xl bg-[#243240]/90 border border-[#384959] space-y-4 backdrop-blur-md">
        <div className="flex items-center justify-between pb-3 border-b border-[#384959]">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white font-mono">
              Privacy & Sensitive Data Masking Controls
            </h3>
          </div>
          <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
            Compliance Policy
          </span>
        </div>

        <p className="text-xs text-slate-300 font-sans leading-relaxed">
          Enforce automatic client-side masking for Personally Identifiable Information (PII) and IP address octets to protect employee privacy during threat hunting investigations.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* PII Toggle */}
          <div
            onClick={() => {
              setMaskPii(!maskPii);
              toast.info(`PII Data Masking ${!maskPii ? "Enabled" : "Disabled"}`);
            }}
            className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
              maskPii
                ? "bg-amber-500/10 border-amber-500/40 text-white"
                : "bg-[#1a242f] border-[#384959] text-[#6A89A7] hover:border-[#6A89A7]"
            }`}
          >
            <div className="space-y-1">
              <div className="text-xs font-bold font-mono text-white flex items-center gap-2">
                {maskPii ? <EyeOff className="w-4 h-4 text-amber-400" /> : <Eye className="w-4 h-4" />}
                <span>Email Address & PII Masking</span>
              </div>
              <div className="text-[11px] text-[#6A89A7] font-mono">
                Transforms: <code className="text-[#BDDDFC]">s****s@acmeworks.com</code>
              </div>
            </div>

            <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${
              maskPii ? "bg-amber-500 border-amber-400 text-black" : "border-[#384959]"
            }`}>
              {maskPii && <CheckCircle2 className="w-4 h-4 stroke-[3]" />}
            </div>
          </div>

          {/* IP Toggle */}
          <div
            onClick={() => {
              setMaskIps(!maskIps);
              toast.info(`IP Masking ${!maskIps ? "Enabled" : "Disabled"}`);
            }}
            className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
              maskIps
                ? "bg-amber-500/10 border-amber-500/40 text-white"
                : "bg-[#1a242f] border-[#384959] text-[#6A89A7] hover:border-[#6A89A7]"
            }`}
          >
            <div className="space-y-1">
              <div className="text-xs font-bold font-mono text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-400" />
                <span>IP Address Octet Masking</span>
              </div>
              <div className="text-[11px] text-[#6A89A7] font-mono">
                Transforms: <code className="text-[#BDDDFC]">102.89.41.xxx</code>
              </div>
            </div>

            <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${
              maskIps ? "bg-amber-500 border-amber-400 text-black" : "border-[#384959]"
            }`}>
              {maskIps && <CheckCircle2 className="w-4 h-4 stroke-[3]" />}
            </div>
          </div>
        </div>
      </div>

      {/* Role-Based Access Control (RBAC) Switcher */}
      <div className="p-6 rounded-2xl bg-[#243240]/90 border border-[#384959] space-y-4 backdrop-blur-md">
        <div className="flex items-center justify-between pb-3 border-b border-[#384959]">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#88BDF2]" />
            <h3 className="text-sm font-bold text-white font-mono">
              Role-Based Access Control (RBAC) Simulation
            </h3>
          </div>
          <span className="text-[10px] font-mono text-[#BDDDFC]">Active Role: {userRole}</span>
        </div>

        <div className="space-y-2.5">
          {roles.map((r) => (
            <div
              key={r.role}
              onClick={() => {
                setUserRole(r.role);
                toast.success(`Role switched to ${r.title}`);
              }}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                userRole === r.role
                  ? "bg-[#88BDF2]/15 border-[#88BDF2] shadow-glow"
                  : "bg-[#1a242f] border-[#384959] hover:border-[#6A89A7]"
              }`}
            >
              <div>
                <div className="text-xs font-bold font-mono text-white flex items-center gap-2">
                  <span>{r.title}</span>
                  {userRole === r.role && (
                    <span className="px-1.5 py-0.2 rounded bg-[#88BDF2] text-[#1a242f] text-[9px] font-bold">
                      ACTIVE
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-[#6A89A7] font-sans mt-0.5">{r.desc}</div>
              </div>

              <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                userRole === r.role ? "bg-[#88BDF2] border-[#BDDDFC] text-[#1a242f]" : "border-[#384959]"
              }`}>
                {userRole === r.role && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Threat Intelligence Providers & API Connectors */}
      <div className="p-6 rounded-2xl bg-[#243240]/90 border border-[#384959] space-y-4 backdrop-blur-md font-mono text-xs">
        <div className="flex items-center justify-between pb-3 border-b border-[#384959]">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-[#88BDF2]" />
            <h3 className="text-sm font-bold text-white">Threat Intelligence API Integration</h3>
          </div>
          <span className="text-emerald-400 text-[10px] font-bold">CONNECTED (3/3)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-[#1a242f] border border-[#384959] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">VirusTotal v3 API</span>
              <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[10px]">
                ACTIVE
              </span>
            </div>
            <input
              type="password"
              value={vtApiKey}
              onChange={(e) => setVtApiKey(e.target.value)}
              className="w-full p-2 rounded bg-[#243240] border border-[#384959] text-[#BDDDFC] text-[11px] focus:outline-none focus:border-[#88BDF2]/50"
            />
          </div>

          <div className="p-4 rounded-xl bg-[#1a242f] border border-[#384959] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">AbuseIPDB Reputation API</span>
              <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[10px]">
                ACTIVE
              </span>
            </div>
            <input
              type="password"
              value={abuseIpApiKey}
              onChange={(e) => setAbuseIpApiKey(e.target.value)}
              className="w-full p-2 rounded bg-[#243240] border border-[#384959] text-[#BDDDFC] text-[11px] focus:outline-none focus:border-[#88BDF2]/50"
            />
          </div>
        </div>
      </div>

      {/* Immutable Audit Log */}
      <div className="p-6 rounded-2xl bg-[#243240]/90 border border-[#384959] space-y-4 backdrop-blur-md">
        <div className="flex items-center justify-between pb-3 border-b border-[#384959]">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#88BDF2]" />
            <h3 className="text-sm font-bold text-white font-mono">
              Immutable SOC Forensic Audit Trail
            </h3>
          </div>
          <span className="text-[10px] font-mono text-[#6A89A7]">
            {auditLogs.length} Events Logged
          </span>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {auditLogs.map((log) => (
            <div
              key={log.id}
              className="p-3 rounded-lg bg-[#1a242f] border border-[#384959] font-mono text-[11px] flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div className="space-y-0.5">
                <div className="text-slate-200">
                  <span className="font-bold text-[#BDDDFC]">[{log.action}]</span> {log.details}
                </div>
                <div className="text-[10px] text-[#6A89A7]">
                  Actor: <strong className="text-slate-300">{log.actor}</strong> ({log.role}) • Target: {log.resourceType}:{log.resourceId}
                </div>
              </div>

              <div className="text-[10px] text-[#6A89A7] shrink-0">
                {new Date(log.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
