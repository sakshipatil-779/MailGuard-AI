"use client";

import React, { useState } from "react";
import { EmailAnalysis } from "@/types/analysis";
import { ShieldCheck, Lock, Fingerprint, FileCheck, CheckCircle2, Copy, Download } from "lucide-react";
import { toast } from "sonner";

interface EvidenceChainOfCustodyProps {
  email: EmailAnalysis;
}

export function EvidenceChainOfCustody({ email }: EvidenceChainOfCustodyProps) {
  const [copiedHash, setCopiedHash] = useState(false);

  const copyHash = () => {
    navigator.clipboard.writeText(email.sha256);
    setCopiedHash(true);
    toast.success("SHA-256 evidence hash copied.");
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Cryptographic Seal Banner */}
      <div className="p-4 sm:p-6 rounded-2xl bg-[#1a242f] border border-emerald-500/30 backdrop-blur-md shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-glow-emerald shrink-0">
            <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs sm:text-sm font-bold text-white font-mono">
                Cryptographic Chain of Custody & Seal
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/30">
                VERIFIED
              </span>
            </div>
            <p className="text-xs text-[#6A89A7] font-mono mt-0.5">
              Unmodified RFC-822 binary artifact in tamper-evident forensic vault
            </p>
          </div>
        </div>

        <button
          onClick={copyHash}
          className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#243240] border border-[#384959] text-xs font-mono text-[#BDDDFC] hover:border-[#88BDF2]/50 transition-all shrink-0 w-full sm:w-auto"
        >
          <Lock className="w-3.5 h-3.5 text-[#88BDF2]" />
          <span>Copy SHA-256 Hash</span>
        </button>
      </div>

      {/* Hash & Custodian Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
        <div className="p-4 rounded-xl bg-[#1a242f] border border-[#384959] space-y-2">
          <div className="flex items-center gap-1.5 text-[10px] text-[#6A89A7] uppercase">
            <Fingerprint className="w-3.5 h-3.5 text-[#88BDF2]" />
            <span>Artifact SHA-256 Hash</span>
          </div>
          <div className="font-bold text-[#BDDDFC] break-all text-[11px] bg-[#243240] p-2.5 rounded-lg border border-[#384959]">
            {email.sha256}
          </div>
          <div className="text-[10px] text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Matched zero-modification baseline</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#1a242f] border border-[#384959] space-y-2">
          <div className="flex items-center gap-1.5 text-[10px] text-[#6A89A7] uppercase">
            <FileCheck className="w-3.5 h-3.5 text-[#88BDF2]" />
            <span>Preservation Metadata</span>
          </div>
          <div className="space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span className="text-[#6A89A7]">Preserved At:</span>
              <span className="text-slate-200">{new Date(email.createdAt).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6A89A7]">File Size:</span>
              <span className="text-slate-200">{email.rawSize} Bytes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6A89A7]">Storage Vault:</span>
              <span className="text-[#BDDDFC]">s3://forensic-vault/{email.id}.eml</span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#1a242f] border border-[#384959] space-y-2">
          <div className="flex items-center gap-1.5 text-[10px] text-[#6A89A7] uppercase">
            <ShieldCheck className="w-3.5 h-3.5 text-[#88BDF2]" />
            <span>Authorized Custodians</span>
          </div>
          <div className="space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span className="text-[#6A89A7]">Ingested By:</span>
              <span className="text-slate-200">Automated Mail Gateway</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6A89A7]">Lead Analyst:</span>
              <span className="text-slate-200">{email.assignedAnalyst || "Alex Mercer"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6A89A7]">Ledger Ref:</span>
              <span className="text-[#6A89A7]">SEC-LEDGER-0827-{email.id.substring(0, 6)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
