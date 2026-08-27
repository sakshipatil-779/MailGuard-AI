"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { EmailAnalysis } from "@/types/analysis";

interface ThreatChartsProps {
  emails?: EmailAnalysis[];
}

export function ThreatCharts({ emails = [] }: ThreatChartsProps) {
  // Aggregate classification breakdown from real analyzed emails
  const classificationCounts: Record<string, number> = {
    phishing: 0,
    business_email_compromise: 0,
    spoofing: 0,
    malware_carrier: 0,
    account_takeover: 0,
    legitimate: 0,
  };

  emails.forEach(e => {
    if (classificationCounts[e.classification] !== undefined) {
      classificationCounts[e.classification]++;
    } else {
      classificationCounts[e.classification] = 1;
    }
  });

  const breakdownData = [
    { name: "Credential Phishing", value: classificationCounts.phishing || 0, color: "#1a2A2f" },
    { name: "BEC / Impersonation", value: classificationCounts.business_email_compromise || 0, color: "#f43f5e" },
    { name: "Identity Spoofing", value: classificationCounts.spoofing || 0, color: "#88BDF2" },
    { name: "Malware Carrier", value: classificationCounts.malware_carrier || 0, color: "#f59e0b" },
    { name: "Account Takeover", value: classificationCounts.account_takeover || 0, color: "#8b5cf6" },
    { name: "Legitimate Verified", value: classificationCounts.legitimate || 0, color: "#10b981" },
  ].filter(item => item.value > 0);

  // Default empty state if no emails
  const finalBreakdownData = breakdownData.length > 0
    ? breakdownData
    : [{ name: "Awaiting Email Telemetry", value: 1, color: "#e2e8f0" }];

  // Real trend data (last 7 days or per analyzed email timestamps)
  const trendDataMap: Record<string, { total: number; threats: number; bec: number }> = {};

  // Build last 7 days keys
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const key = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    trendDataMap[key] = { total: 0, threats: 0, bec: 0 };
  }

  emails.forEach(e => {
    const emailDate = new Date(e.createdAt);
    const key = emailDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    if (!trendDataMap[key]) {
      trendDataMap[key] = { total: 0, threats: 0, bec: 0 };
    }
    trendDataMap[key].total++;
    if (e.riskScore >= 50) trendDataMap[key].threats++;
    if (e.classification === "business_email_compromise") trendDataMap[key].bec++;
  });

  const trendData = Object.entries(trendDataMap).map(([date, counts]) => ({
    date,
    total: counts.total,
    threats: counts.threats,
    bec: counts.bec
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Real-Time Attack Volume & Risk Trend */}
      <div className="lg:col-span-2 p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-[#1a2A2f] flex items-center gap-2">
              <span>Real-Time Ingestion Velocity & Threat Detections</span>
              <span className="w-2 h-2 rounded-full bg-[#88BDF2] animate-pulse"></span>
            </h3>
            <p className="text-[11px] text-slate-500 font-mono">
              Total ingested emails vs AI-flagged high-severity threats ({emails.length} total messages)
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5 text-[#1a2A2f]">
              <div className="w-2.5 h-2.5 rounded-sm bg-[#88BDF2]"></div>
              <span>Total Ingested</span>
            </div>
            <div className="flex items-center gap-1.5 text-rose-600 font-semibold">
              <div className="w-2.5 h-2.5 rounded-sm bg-rose-500"></div>
              <span>High Threats</span>
            </div>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#88BDF2" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#88BDF2" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 11, fill: "#64748b" }} />
              <YAxis stroke="#94a3b8" tick={{ fontSize: 11, fill: "#64748b" }} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a2A2f",
                  borderColor: "#88BDF2",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: "#ffffff"
                }}
              />
              <Area
                type="monotone"
                dataKey="total"
                stroke="#88BDF2"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorTotal)"
                name="Total Emails"
              />
              <Area
                type="monotone"
                dataKey="threats"
                stroke="#f43f5e"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorThreats)"
                name="Detected Threats"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Threat Classification Breakdown */}
      <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-bold text-[#1a2A2f] flex items-center justify-between">
            <span>Threat Taxonomy Breakdown</span>
            <span className="text-[10px] font-mono text-[#1a2A2f] bg-[#88BDF2]/20 font-bold px-2 py-0.5 rounded">
              Real-Time Feed
            </span>
          </h3>
          <p className="text-[11px] text-slate-500 font-mono mt-0.5">
            Distribution across attack vectors
          </p>

          <div className="h-44 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={finalBreakdownData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {finalBreakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a2A2f",
                    borderColor: "#88BDF2",
                    borderRadius: "8px",
                    fontSize: "11px",
                    color: "#ffffff"
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Legend List */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100">
          {finalBreakdownData.slice(0, 4).map((item) => (
            <div key={item.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-[#1a2A2f] truncate max-w-[170px] font-medium">{item.name}</span>
              </div>
              <span className="font-mono font-bold text-[#1a2A2f]">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
