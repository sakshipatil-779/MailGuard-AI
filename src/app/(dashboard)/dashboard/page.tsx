"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  SearchCode,
  MailCheck,
  AlertOctagon,
  FolderGit2,
  Activity,
  PlusCircle,
  Sparkles,
  Inbox,
  ArrowRight,
  ShieldCheck,
  FileCode2,
  Lock,
  Globe
} from "lucide-react";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { ThreatCharts } from "@/components/dashboard/ThreatCharts";
import { RecentThreatsTable } from "@/components/dashboard/RecentThreatsTable";
import { SuspiciousInfrastructureCards } from "@/components/dashboard/SuspiciousInfrastructureCards";
import { MockStorage } from "@/lib/storage/mock-store";
import { EmailAnalysis } from "@/types/analysis";
import Link from "next/link";

export default function DashboardPage() {
  const [emails, setEmails] = useState<EmailAnalysis[]>([]);
  const [casesCount, setCasesCount] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    const loadedEmails = MockStorage.getEmails();
    const loadedCases = MockStorage.getCases();
    setEmails(loadedEmails);
    setCasesCount(loadedCases.length);
    setIsLoaded(true);
  }, []);

  // Real-time calculations only (no hardcoded/guessed numbers)
  const totalAnalyzed = emails.length;
  const criticalThreats = emails.filter((e) => e.severity === "critical").length;
  const becThreats = emails.filter((e) => e.classification === "business_email_compromise").length;
  const phishingThreats = emails.filter((e) => e.classification === "phishing").length;
  const meanScore = totalAnalyzed > 0 
    ? (emails.reduce((acc, e) => acc + e.riskScore, 0) / totalAnalyzed).toFixed(1)
    : "0.0";
  const highestRisk = emails.length > 0 ? Math.max(...emails.map(e => e.riskScore)) : 0;

  return (
    <div className="space-y-6 bg-white">
      {/* Top Banner Alert Bar */}
      {totalAnalyzed > 0 && criticalThreats > 0 ? (
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#1a2A2f] font-mono flex items-center gap-2">
                <span>ACTIVE THREATS DETECTED IN INGESTED MAIL</span>
                <span className="px-1.5 py-0.5 rounded bg-rose-600 text-white font-bold text-[9px]">
                  {criticalThreats} CRITICAL
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                Real-time AI telemetry has flagged {criticalThreats} high-severity attacks requiring immediate containment.
              </p>
            </div>
          </div>

          <Link
            href="/analyze"
            className="px-4 py-2.5 rounded-lg bg-[#1a2A2f] hover:bg-[#1a2A2f]/90 text-white font-bold text-xs font-mono transition-all shadow-sm flex items-center gap-2 shrink-0 border border-[#1a2A2f]"
          >
            <SearchCode className="w-4 h-4 text-white" />
            <span>Analyze Another Email (.eml / .msg)</span>
          </Link>
        </div>
      ) : (
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#88BDF2]/20 border border-[#88BDF2]/40 flex items-center justify-center text-[#1a2A2f] shrink-0">
              <Sparkles className="w-5 h-5 text-[#1a2A2f]" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#1a2A2f] font-mono flex items-center gap-2">
                <span>REAL-TIME AI THREAT ENGINE ONLINE</span>
                <span className="px-1.5 py-0.5 rounded bg-[#88BDF2] text-[#1a2A2f] font-bold text-[9px]">
                  GEMINI 3.6 FLASH
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                Ready to ingest raw .eml and .msg files. Threat scores, link reputations, and forensic dossiers are computed strictly in real-time.
              </p>
            </div>
          </div>

          <Link
            href="/analyze"
            className="px-4 py-2.5 rounded-lg bg-[#1a2A2f] hover:bg-[#1a2A2f]/90 text-white font-bold text-xs font-mono transition-all shadow-sm flex items-center gap-2 shrink-0 border border-[#1a2A2f]"
          >
            <PlusCircle className="w-4 h-4 text-white" />
            <span>Scan Email File (.eml / .msg)</span>
          </Link>
        </div>
      )}

      {/* 6 KPI Cards Grid (Computed strictly from real-time data) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KpiCard
          title="Emails Inspected"
          value={totalAnalyzed.toString()}
          subtitle="Real-time ingested"
          change={totalAnalyzed > 0 ? `${totalAnalyzed} Total` : "0 Files"}
          isPositive={true}
          icon={MailCheck}
          color="cyan"
        />

        <KpiCard
          title="Critical Threats"
          value={criticalThreats}
          subtitle="Severity >= 75"
          change={criticalThreats > 0 ? `${criticalThreats} Flagged` : "0 Flagged"}
          isPositive={criticalThreats === 0}
          icon={AlertOctagon}
          color="rose"
        />

        <KpiCard
          title="BEC / Executive"
          value={becThreats}
          subtitle="Targeted impersonation"
          change={becThreats > 0 ? "Detected" : "Clean"}
          isPositive={becThreats === 0}
          icon={ShieldAlert}
          color="rose"
        />

        <KpiCard
          title="Credential Phish"
          value={phishingThreats}
          subtitle="Harvesting lures"
          change={phishingThreats > 0 ? "Detected" : "Clean"}
          isPositive={phishingThreats === 0}
          icon={SearchCode}
          color="amber"
        />

        <KpiCard
          title="Active Cases"
          value={casesCount.toString()}
          subtitle="Under IR investigation"
          change={casesCount > 0 ? `${casesCount} Cases` : "0 Cases"}
          isPositive={true}
          icon={FolderGit2}
          color="indigo"
        />

        <KpiCard
          title="Mean Threat Score"
          value={meanScore}
          subtitle={totalAnalyzed > 0 ? `Max: ${highestRisk}/100` : "No data yet"}
          change="AI Scored"
          isPositive={parseFloat(meanScore) < 50}
          icon={Activity}
          color="purple"
        />
      </div>

      {/* When no emails analyzed yet, show initial onboarding prompt */}
      {totalAnalyzed === 0 && isLoaded && (
        <div className="p-10 rounded-2xl bg-white border border-slate-200 shadow-sm text-center max-w-2xl mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-[#88BDF2]/20 border border-[#88BDF2]/40 flex items-center justify-center mx-auto text-[#1a2A2f]">
            <Inbox className="w-8 h-8 text-[#1a2A2f]" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#1a2A2f]">No Email Messages Analyzed Yet</h3>
            <p className="text-xs text-slate-500 font-mono mt-1 max-w-md mx-auto">
              Upload a raw <span className="font-bold text-[#1a2A2f]">.eml</span> or <span className="font-bold text-[#1a2A2f]">.msg</span> email file to run real-time Gemini AI scoring, flag suspicious links, extract IOCs, and reconstruct relay hops.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/analyze"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1a2A2f] hover:bg-[#1a2A2f]/90 text-white font-bold text-xs font-mono shadow-sm transition-all"
            >
              <FileCode2 className="w-4 h-4 text-white" />
              <span>Launch First Analysis (.eml or .msg)</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </Link>
          </div>
        </div>
      )}

      {/* Visual Charts Grid (Real-time telemetry) */}
      <ThreatCharts emails={emails} />

      {/* Suspicious Infrastructure Cards (Real-time extracted ASNs and Lookalike domains) */}
      <SuspiciousInfrastructureCards emails={emails} />

      {/* Live Recent Threats Table (Real-time inspected emails) */}
      <RecentThreatsTable emails={emails} />
    </div>
  );
}
