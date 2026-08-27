"use client";

import React from "react";
import { EmailAnalysis } from "@/types/analysis";
import { getSeverityBadge, getClassificationMeta } from "@/lib/utils";
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  FileSpreadsheet,
  FolderPlus,
  Radio,
  Fingerprint,
  Zap,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";

interface ThreatScoreCardProps {
  email: EmailAnalysis;
  onQuarantine?: () => void;
  onCreateCase?: () => void;
}

export function ThreatScoreCard({ email, onQuarantine, onCreateCase }: ThreatScoreCardProps) {
  const sevBadge = getSeverityBadge(email.severity);
  const classMeta = getClassificationMeta(email.classification);

  return (
    <div className="p-4 sm:p-6 rounded-2xl bg-[#243240]/90 border border-[#384959] backdrop-blur-xl shadow-2xl relative overflow-hidden">
      {/* Background glow banner based on severity */}
      <div
        className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-20 ${
          email.riskScore >= 75
            ? "bg-rose-500"
            : email.riskScore >= 50
            ? "bg-amber-500"
            : "bg-[#88BDF2]"
        }`}
      />

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 sm:gap-6 relative z-10">
        {/* Left: Classification & Verdict */}
        <div className="space-y-2 flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg text-xs font-mono font-bold ${sevBadge.bg} ${sevBadge.text} border ${sevBadge.border} ${sevBadge.glow}`}
            >
              <span className={`w-2 h-2 rounded-full ${sevBadge.dot} animate-pulse`} />
              LEVEL: {sevBadge.label}
            </span>

            <span className="px-2.5 sm:px-3 py-1 rounded-lg text-xs font-mono font-bold bg-[#88BDF2]/15 text-[#BDDDFC] border border-[#88BDF2]/30">
              {classMeta.label}
            </span>

            <span className="px-2 sm:px-2.5 py-1 rounded-lg text-xs font-mono text-[#6A89A7] bg-[#1a242f]/80 border border-[#384959] truncate">
              {email.analysisId}
            </span>
          </div>

          <h2 className="text-base sm:text-xl font-black text-white tracking-tight break-words">
            {email.headers.subject}
          </h2>

          <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
            {email.executiveSummary}
          </p>

          {/* Recommended Action Callout */}
          <div className="p-3 rounded-xl bg-[#1a242f]/80 border border-[#88BDF2]/30 flex items-start gap-2.5 sm:gap-3 mt-3">
            <Zap className="w-4 h-4 text-[#88BDF2] shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold text-[#BDDDFC] uppercase tracking-wider font-mono">
                Protocol:{" "}
              </span>
              <span className="text-slate-200">{email.recommendation}</span>
            </div>
          </div>
        </div>

        {/* Right: Risk Gauge & Quick Actions */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-center lg:items-end gap-3 sm:gap-4 shrink-0 w-full sm:w-auto">
          {/* Circular Score Display */}
          <div className="flex items-center justify-between sm:justify-start gap-4 bg-[#1a242f]/90 p-3 sm:p-4 rounded-xl border border-[#384959] w-full sm:w-auto">
            {/* Numeric Ring */}
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-[#384959]"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={
                    email.riskScore >= 75
                      ? "text-rose-500"
                      : email.riskScore >= 50
                      ? "text-amber-500"
                      : "text-[#88BDF2]"
                  }
                  strokeDasharray={`${email.riskScore}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-lg sm:text-xl font-black font-mono text-white tracking-tighter">
                  {email.riskScore}
                </span>
                <span className="text-[8px] sm:text-[9px] font-mono text-[#6A89A7] uppercase">/ 100</span>
              </div>
            </div>

            <div className="space-y-1 text-right">
              <div className="text-xs font-mono font-bold text-white uppercase">
                Risk Index
              </div>
              <div className="text-[11px] font-mono text-[#88BDF2]">
                Confidence: {Math.round(email.confidence * 100)}%
              </div>
              <div className="text-[10px] font-mono text-[#6A89A7]">
                Status: <span className="text-white font-bold">{email.status}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full">
            {onCreateCase && !email.caseId && (
              <button
                onClick={onCreateCase}
                className="flex-1 px-3 py-2 rounded-lg bg-[#6A89A7]/20 hover:bg-[#6A89A7]/30 text-[#BDDDFC] border border-[#6A89A7]/40 text-xs font-mono font-semibold flex items-center justify-center gap-1.5 transition-all shrink-0"
              >
                <FolderPlus className="w-3.5 h-3.5" />
                <span>Open Case</span>
              </button>
            )}

            {email.caseId && (
              <Link
                href={`/investigations/${email.caseId}`}
                className="flex-1 px-3 py-2 rounded-lg bg-[#6A89A7]/20 hover:bg-[#6A89A7]/30 text-[#BDDDFC] border border-[#6A89A7]/40 text-xs font-mono font-semibold flex items-center justify-center gap-1.5 transition-all shrink-0"
              >
                <FolderPlus className="w-3.5 h-3.5" />
                <span>View {email.caseId}</span>
              </Link>
            )}

            {onQuarantine && email.status !== "QUARANTINED" && (
              <button
                onClick={onQuarantine}
                className="flex-1 px-3 py-2 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-mono font-semibold flex items-center justify-center gap-1.5 transition-all shrink-0"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Quarantine</span>
              </button>
            )}

            <Link
              href={`/reports/${email.id}`}
              className="px-3 py-2 rounded-lg bg-[#88BDF2]/20 hover:bg-[#88BDF2]/30 text-[#BDDDFC] border border-[#88BDF2]/40 text-xs font-mono font-semibold flex items-center justify-center gap-1.5 transition-all shrink-0"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Report</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
