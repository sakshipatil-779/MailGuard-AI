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
  Key,
  Trash2,
  Sparkles
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
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
  const apiKeyDisplay = apiKey ? `${apiKey.substring(0, 6)}••••••••••••••••••••••••••••${apiKey.substring(apiKey.length - 4)}` : "AQ.••••••••••••••••••••••••••••••••";

  useEffect(() => {
    setAuditLogs(MockStorage.getAuditLogs());
  }, []);

  const handleClearAllData = () => {
    if (confirm("Are you sure you want to clear all analyzed emails, cases, alerts, and audit logs? This will reset the workspace to a clean real-time state.")) {
      MockStorage.clearAllData();
      setAuditLogs([]);
      toast.success("Workspace reset to clean state.");
      window.location.reload();
    }
  };

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
      <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#88BDF2]" />
            <h2 className="text-base font-bold text-[#1a2A2f]">System & AI Engine Configuration</h2>
          </div>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Real-time Gemini AI scoring connector, privacy data masking & audit trail
          </p>
        </div>

        <button
          onClick={handleClearAllData}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs font-mono font-bold transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Reset Real-Time Data</span>
        </button>
      </div>

      {/* AI Engine & API Key Status */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#88BDF2]" />
            <h3 className="text-sm font-bold text-[#1a2A2f] font-mono">
              Google Gemini Threat Scoring & Link Intelligence API
            </h3>
          </div>
          <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
            ONLINE (GEMINI 3.6 FLASH)
          </span>
        </div>

        <p className="text-xs text-slate-600 font-sans leading-relaxed">
          The threat platform utilizes the provided Gemini API key to evaluate raw email text, compute precise 0–100 risk scores, classify attack vectors, and flag suspicious URLs with detailed security reasoning upon file upload (.eml / .msg).
        </p>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="font-bold text-[#1a2A2f]">Configured API Key</span>
            <span className="text-emerald-600 font-bold">Active & Authenticated</span>
          </div>
          <div className="p-2.5 rounded-lg bg-white border border-slate-300 font-mono text-xs text-[#1a2A2f] flex items-center justify-between">
            <span>{apiKeyDisplay.substring(0, 12)}••••••••••••••••••••••••••••••••{apiKeyDisplay.substring(apiKeyDisplay.length - 6)}</span>
            <span className="text-[10px] text-slate-400">Gemini Key</span>
          </div>
        </div>
      </div>

      {/* Privacy Data Masking Section */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-600" />
            <h3 className="text-sm font-bold text-[#1a2A2f] font-mono">
              Privacy & Sensitive Data Masking Controls
            </h3>
          </div>
          <span className="text-[10px] font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-bold">
            Compliance Policy
          </span>
        </div>

        <p className="text-xs text-slate-600 font-sans leading-relaxed">
          Enforce automatic client-side masking for Personally Identifiable Information (PII) and IP address octets during SOC investigations.
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
                ? "bg-amber-50 border-amber-300 text-[#1a2A2f]"
                : "bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300"
            }`}
          >
            <div className="space-y-1">
              <div className="text-xs font-bold font-mono text-[#1a2A2f] flex items-center gap-2">
                {maskPii ? <EyeOff className="w-4 h-4 text-amber-600" /> : <Eye className="w-4 h-4" />}
                <span>Email Address & PII Masking</span>
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                Transforms: <code className="text-[#1a2A2f] font-bold">s****s@enterprise.com</code>
              </div>
            </div>

            <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${
              maskPii ? "bg-amber-500 border-amber-400 text-white" : "border-slate-300"
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
                ? "bg-amber-50 border-amber-300 text-[#1a2A2f]"
                : "bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300"
            }`}
          >
            <div className="space-y-1">
              <div className="text-xs font-bold font-mono text-[#1a2A2f] flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-600" />
                <span>IP Address Octet Masking</span>
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                Transforms: <code className="text-[#1a2A2f] font-bold">102.89.41.xxx</code>
              </div>
            </div>

            <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${
              maskIps ? "bg-amber-500 border-amber-400 text-white" : "border-slate-300"
            }`}>
              {maskIps && <CheckCircle2 className="w-4 h-4 stroke-[3]" />}
            </div>
          </div>
        </div>
      </div>

      {/* Role-Based Access Control (RBAC) */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#88BDF2]" />
            <h3 className="text-sm font-bold text-[#1a2A2f] font-mono">
              Role-Based Access Control (RBAC)
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-500">Active Role: {userRole}</span>
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
                  ? "bg-[#88BDF2]/15 border-[#88BDF2] shadow-sm"
                  : "bg-slate-50 border-slate-200 hover:border-slate-300"
              }`}
            >
              <div>
                <div className="text-xs font-bold font-mono text-[#1a2A2f] flex items-center gap-2">
                  <span>{r.title}</span>
                  {userRole === r.role && (
                    <span className="px-1.5 py-0.2 rounded bg-[#1a2A2f] text-white text-[9px] font-bold">
                      ACTIVE
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-500 font-sans mt-0.5">{r.desc}</div>
              </div>

              <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                userRole === r.role ? "bg-[#1a2A2f] border-[#1a2A2f] text-white" : "border-slate-300"
              }`}>
                {userRole === r.role && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Real-Time Immutable Audit Log */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#88BDF2]" />
            <h3 className="text-sm font-bold text-[#1a2A2f] font-mono">
              Real-Time SOC Forensic Audit Trail
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-500 font-semibold">
            {auditLogs.length} Events Logged
          </span>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {auditLogs.length > 0 ? (
            auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-lg bg-slate-50 border border-slate-200 font-mono text-[11px] flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div className="space-y-0.5">
                  <div className="text-[#1a2A2f]">
                    <span className="font-bold text-[#1a2A2f]">[{log.action}]</span> {log.details}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Actor: <strong className="text-[#1a2A2f]">{log.actor}</strong> ({log.role}) • Target: {log.resourceType}:{log.resourceId}
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 shrink-0">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))
          ) : (
            <div className="py-6 text-center text-slate-400 text-xs font-mono">
              No audit logs recorded yet. Ingest an email to generate the first immutable audit event.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
