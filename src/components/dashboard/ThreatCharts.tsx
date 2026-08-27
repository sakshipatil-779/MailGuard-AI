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

const TREND_DATA = [
  { date: "Aug 13", total: 420, threats: 32, bec: 4 },
  { date: "Aug 14", total: 510, threats: 45, bec: 7 },
  { date: "Aug 15", total: 480, threats: 38, bec: 5 },
  { date: "Aug 16", total: 390, threats: 28, bec: 3 },
  { date: "Aug 17", total: 610, threats: 54, bec: 9 },
  { date: "Aug 18", total: 580, threats: 62, bec: 11 },
  { date: "Aug 19", total: 640, threats: 59, bec: 8 },
  { date: "Aug 20", total: 720, threats: 71, bec: 14 },
  { date: "Aug 21", total: 690, threats: 68, bec: 12 },
  { date: "Aug 22", total: 750, threats: 83, bec: 17 },
  { date: "Aug 23", total: 810, threats: 91, bec: 21 },
  { date: "Aug 24", total: 890, threats: 104, bec: 26 },
  { date: "Aug 25", total: 940, threats: 118, bec: 31 },
  { date: "Aug 26", total: 1080, threats: 142, bec: 39 },
];

const BREAKDOWN_DATA = [
  { name: "BEC / Executive Impersonation", value: 39, color: "#f43f5e" },
  { name: "Credential Phishing", value: 58, color: "#1a2A2f" },
  { name: "Malware & Ransomware", value: 24, color: "#88BDF2" },
  { name: "Brand Impersonation", value: 21, color: "#64748b" },
  { name: "Legitimate Verified", value: 938, color: "#10b981" },
];

export function ThreatCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 14-Day Attack Volume & Risk Trend */}
      <div className="lg:col-span-2 p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-[#1a2A2f] flex items-center gap-2">
              <span>14-Day Threat Ingestion & Attack Velocity</span>
              <span className="w-2 h-2 rounded-full bg-[#88BDF2] animate-pulse"></span>
            </h3>
            <p className="text-[11px] text-slate-500 font-mono">
              Total emails inspected vs high-risk detections and BEC surge
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5 text-[#1a2A2f]">
              <div className="w-2.5 h-2.5 rounded-sm bg-[#88BDF2]"></div>
              <span>Total Volume</span>
            </div>
            <div className="flex items-center gap-1.5 text-rose-600 font-semibold">
              <div className="w-2.5 h-2.5 rounded-sm bg-rose-500"></div>
              <span>High Threats</span>
            </div>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
              <YAxis stroke="#94a3b8" tick={{ fontSize: 11, fill: "#64748b" }} />
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
              Active Window
            </span>
          </h3>
          <p className="text-[11px] text-slate-500 font-mono mt-0.5">
            Distribution across attack vectors
          </p>

          <div className="h-44 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={BREAKDOWN_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {BREAKDOWN_DATA.map((entry, index) => (
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
          {BREAKDOWN_DATA.slice(0, 4).map((item) => (
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
