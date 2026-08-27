"use client";

import React from "react";
import { ThreatAlert } from "@/lib/data/mock-alerts";
import { X, ShieldAlert, CheckCircle2, ArrowRight, FolderPlus, Radio, Globe } from "lucide-react";
import Link from "next/link";
import { getSeverityBadge } from "@/lib/utils";

interface AlertDrawerProps {
  alert: ThreatAlert | null;
  onClose: () => void;
  onAcknowledge: (id: string) => void;
  onEscalateCase: (alert: ThreatAlert) => void;
}

export function AlertDrawer({ alert, onClose, onAcknowledge, onEscalateCase }: AlertDrawerProps) {
  if (!alert) return null;

  const sevBadge = getSeverityBadge(alert.severity);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-[#243240] border-l border-[#384959] h-full shadow-2xl flex flex-col justify-between p-6 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#384959]">
            <div className="flex items-center gap-2 font-mono">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse glow-dot-red" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Threat Alert Triage • {alert.id}
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-[#1a242f] text-[#6A89A7] hover:text-[#BDDDFC] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Severity & Threat Banner */}
          <div className="p-4 rounded-xl bg-[#1a242f] border border-[#384959] space-y-3">
            <div className="flex items-center justify-between">
              <span
                className={`px-2.5 py-1 rounded text-xs font-mono font-bold ${sevBadge.bg} ${sevBadge.text} border ${sevBadge.border}`}
              >
                {sevBadge.label} SEVERITY
              </span>
              <span className="text-xs font-mono text-[#88BDF2] font-bold">
                Risk Score: {alert.riskScore}/100
              </span>
            </div>

            <h3 className="text-sm font-bold text-white leading-snug">
              {alert.subject}
            </h3>

            <div className="text-[11px] text-[#6A89A7] font-mono space-y-1">
              <div>Sender: <strong className="text-slate-200">{alert.sender}</strong></div>
              <div>Recipient: <strong className="text-slate-200">{alert.recipient}</strong></div>
              <div>Trigger Rule: <strong className="text-[#BDDDFC]">{alert.ruleName}</strong></div>
            </div>
          </div>

          {/* Telemetry Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 rounded-lg bg-[#1a242f] border border-[#384959]">
              <span className="text-[10px] text-[#6A89A7] uppercase">Origin Source IP</span>
              <div className="font-bold text-[#BDDDFC] mt-1">{alert.sourceIp}</div>
              <div className="text-[10px] text-[#6A89A7] mt-0.5">{alert.sourceCountry}</div>
            </div>

            <div className="p-3 rounded-lg bg-[#1a242f] border border-[#384959]">
              <span className="text-[10px] text-[#6A89A7] uppercase">Detection Timestamp</span>
              <div className="font-bold text-white mt-1">
                {new Date(alert.detectedAt).toLocaleTimeString()}
              </div>
              <div className="text-[10px] text-[#6A89A7] mt-0.5">
                {new Date(alert.detectedAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar Footer */}
        <div className="pt-6 border-t border-[#384959] space-y-2 font-mono">
          <Link
            href={`/emails/${alert.emailId}`}
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl bg-[#88BDF2] hover:bg-[#BDDDFC] text-[#1a242f] font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-glow"
          >
            <span>Open Deep Forensic Dossier</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                onAcknowledge(alert.id);
                onClose();
              }}
              className="py-2 px-3 rounded-xl bg-[#1a242f] hover:bg-[#384959] text-[#BDDDFC] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-[#384959]"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Acknowledge</span>
            </button>

            <button
              onClick={() => {
                onEscalateCase(alert);
                onClose();
              }}
              className="py-2 px-3 rounded-xl bg-[#6A89A7]/20 hover:bg-[#6A89A7]/30 text-[#BDDDFC] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-[#6A89A7]/40"
            >
              <FolderPlus className="w-3.5 h-3.5 text-[#88BDF2]" />
              <span>Escalate Case</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
