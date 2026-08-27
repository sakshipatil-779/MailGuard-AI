"use client";

import React from "react";
import { AuthenticationResult } from "@/types/threat";
import { CheckCircle2, XCircle, AlertCircle, HelpCircle, ShieldCheck, ShieldAlert, KeyRound, Globe } from "lucide-react";

interface AuthenticationStatusProps {
  auth: AuthenticationResult;
}

export function AuthenticationStatus({ auth }: AuthenticationStatusProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pass":
        return {
          icon: CheckCircle2,
          text: "PASS",
          bg: "bg-emerald-500/10",
          border: "border-emerald-500/30",
          color: "text-emerald-400"
        };
      case "fail":
        return {
          icon: XCircle,
          text: "FAIL",
          bg: "bg-rose-500/10",
          border: "border-rose-500/30",
          color: "text-rose-400"
        };
      case "neutral":
      case "softfail":
        return {
          icon: AlertCircle,
          text: "NEUTRAL / SOFTFAIL",
          bg: "bg-amber-500/10",
          border: "border-amber-500/30",
          color: "text-amber-400"
        };
      case "none":
      default:
        return {
          icon: HelpCircle,
          text: "NONE / UNSIGNED",
          bg: "bg-[#6A89A7]/10",
          border: "border-[#384959]",
          color: "text-[#6A89A7]"
        };
    }
  };

  const cards = [
    {
      title: "Sender Policy Framework (SPF)",
      sub: "RFC 7208 IP Authorization Check",
      icon: Globe,
      status: auth.spf,
      detail: auth.spfDetails || (auth.spf === "pass" ? "Originating server IP is explicitly authorized in sender DNS SPF record." : "Originating IP is not authorized in sender domain's SPF record (~all / -all).")
    },
    {
      title: "DomainKeys Identified Mail (DKIM)",
      sub: "RFC 6376 Cryptographic Signature",
      icon: KeyRound,
      status: auth.dkim,
      detail: auth.dkimDetails || (auth.dkim === "pass" ? "Valid 2048-bit RSA cryptographic signature verified matching published public key." : "No valid DKIM signature or signature body hash mismatch.")
    },
    {
      title: "DMARC Policy Enforcement",
      sub: "RFC 7489 Alignment & Policy Check",
      icon: ShieldCheck,
      status: auth.dmarc,
      detail: auth.dmarcDetails || (auth.dmarc === "pass" ? "Domain alignment passed and conforms with published DMARC policy." : "DMARC evaluation failed due to unaligned SPF/DKIM or missing policy.")
    },
    {
      title: "Identifier Domain Alignment",
      sub: "Header From vs Envelope Sender Alignment",
      icon: ShieldAlert,
      status: auth.alignment,
      detail: auth.alignmentDetails || (auth.alignment === "pass" ? "Header 'From' matches the authenticated domain strictly." : "Header 'From' domain differs from actual envelope sender domain.")
    }
  ];

  return (
    <div className="space-y-4">
      {/* 4 Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const badge = getStatusBadge(card.status);
          const Icon = card.icon;
          const BadgeIcon = badge.icon;

          return (
            <div
              key={card.title}
              className={`p-4 rounded-xl border bg-[#1a242f] backdrop-blur-md flex flex-col justify-between ${badge.border}`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-[#243240] flex items-center justify-center text-[#88BDF2]">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-mono font-bold ${badge.bg} ${badge.color} border ${badge.border}`}
                  >
                    <BadgeIcon className="w-3.5 h-3.5" />
                    {badge.text}
                  </span>
                </div>

                <div className="mt-3">
                  <div className="text-xs font-bold text-white">{card.title}</div>
                  <div className="text-[10px] text-[#6A89A7] font-mono mt-0.5">{card.sub}</div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-[#384959] text-[11px] text-slate-300 font-mono leading-relaxed">
                {card.detail}
              </div>
            </div>
          );
        })}
      </div>

      {/* Raw Authentication Results Snippet */}
      {auth.rawAuthResults && (
        <div className="p-4 rounded-xl bg-[#1a242f] border border-[#384959]">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#6A89A7] mb-1">
            Raw Authentication-Results Header Telemetry
          </div>
          <div className="p-3 rounded-lg bg-[#243240] border border-[#384959] font-mono text-xs text-[#BDDDFC] break-all leading-relaxed">
            {auth.rawAuthResults}
          </div>
        </div>
      )}
    </div>
  );
}
