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
  Sparkles
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

  useEffect(() => {
    setEmails(MockStorage.getEmails());
  }, []);

  const totalAnalyzed = 1420 + emails.length;
  const criticalThreats = emails.filter((e) => e.severity === "critical").length + 184;
  const becThreats = emails.filter((e) => e.classification === "business_email_compromise").length + 39;
  const phishingThreats = emails.filter((e) => e.classification === "phishing").length + 58;

  return (
    <div className="space-y-6 bg-white">
      {/* Top Banner Alert Bar on White Background */}
      <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
            <ShieldAlert className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#1a2A2f] font-mono flex items-center gap-2">
              <span>ACTIVE THREAT ELEVATION DETECTED</span>
              <span className="px-1.5 py-0.5 rounded bg-rose-600 text-white font-bold text-[9px]">
                SEV-1
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-mono mt-0.5">
              Spike in executive BEC wire transfer attempts targeting C-Suite finance personnel across North America.
            </p>
          </div>
        </div>

        {/* Button present over background (Dark Color #1a2A2f with text-white) */}
        <Link
          href="/analyze"
          className="px-4 py-2.5 rounded-lg bg-[#1a2A2f] hover:bg-[#1a2A2f]/90 text-white font-bold text-xs font-mono transition-all shadow-sm flex items-center gap-2 shrink-0 border border-[#1a2A2f]"
        >
          <SearchCode className="w-4 h-4 text-white" />
          <span>Launch Threat Scan</span>
        </Link>
      </div>

      {/* 6 KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KpiCard
          title="Emails Inspected"
          value={totalAnalyzed.toLocaleString()}
          subtitle="Past 30 days"
          change="+14.2%"
          isPositive={true}
          icon={MailCheck}
          color="cyan"
        />

        <KpiCard
          title="Critical Threats"
          value={criticalThreats}
          subtitle="Immediate quarantine"
          change="+8.7%"
          isPositive={false}
          icon={AlertOctagon}
          color="rose"
        />

        <KpiCard
          title="BEC / Executive"
          value={becThreats}
          subtitle="Targeted impersonations"
          change="+24.1%"
          isPositive={false}
          icon={ShieldAlert}
          color="rose"
        />

        <KpiCard
          title="Credential Phish"
          value={phishingThreats}
          subtitle="M365 & SSO harvest"
          change="+6.3%"
          isPositive={false}
          icon={SearchCode}
          color="amber"
        />

        <KpiCard
          title="Active Cases"
          value="7"
          subtitle="Under IR investigation"
          change="3 Contained"
          isPositive={true}
          icon={FolderGit2}
          color="indigo"
        />

        <KpiCard
          title="Mean Fraud Score"
          value="82.4"
          subtitle="High threat density"
          change="94% Conf"
          isPositive={true}
          icon={Activity}
          color="purple"
        />
      </div>

      {/* Visual Charts Grid */}
      <ThreatCharts />

      {/* Suspicious Infrastructure Cards */}
      <SuspiciousInfrastructureCards />

      {/* Live Recent Threats Table */}
      <RecentThreatsTable emails={emails} />
    </div>
  );
}
