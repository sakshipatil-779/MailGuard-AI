"use client";

import React from "react";
import { Server, Globe, ShieldAlert, AlertTriangle, ExternalLink } from "lucide-react";

export function SuspiciousInfrastructureCards() {
  const badAsns = [
    { asn: "AS29465", name: "MTN Nigeria", country: "NG", risk: 94, category: "BEC Spear-phish Origin" },
    { asn: "AS57523", name: "VDSina Hosting", country: "RU", risk: 96, category: "EvilProxy AiTM Reverse Proxy" },
    { asn: "AS200651", name: "Flokinet ehf.", country: "IS", risk: 98, category: "Tor Exit Malspam" },
    { asn: "AS63023", name: "HostHatch B.V.", country: "NL", risk: 82, category: "Bulletproof VPS Relay" }
  ];

  const lookalikeDomains = [
    { domain: "acme-corp-holdings.co", brand: "Acme Works Corp", age: "3 days", risk: 98 },
    { domain: "micros0ft-security-portal.com", brand: "Microsoft 365", age: "2 days", risk: 98 },
    { domain: "dhl-express-tracking-delivery.info", brand: "DHL Express", age: "6 days", risk: 88 },
    { domain: "paypal-security-verification.xyz", brand: "PayPal Inc.", age: "1 day", risk: 95 }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Flagged Autonomous Systems (ASNs) */}
      <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-rose-600" />
            <h3 className="text-sm font-bold text-[#1a2A2f]">Top Flagged Threat ASNs</h3>
          </div>
          <span className="text-[10px] font-mono text-slate-500 font-semibold">High Abuse Density</span>
        </div>

        <div className="space-y-2 mt-3">
          {badAsns.map((item) => (
            <div
              key={item.asn}
              className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs"
            >
              <div className="flex items-center gap-2.5">
                <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 font-mono font-bold text-[10px] border border-rose-200">
                  {item.asn}
                </span>
                <div>
                  <div className="font-semibold text-[#1a2A2f]">{item.name}</div>
                  <div className="text-[10px] text-slate-500 font-mono">{item.category}</div>
                </div>
              </div>

              <div className="text-right font-mono">
                <div className="text-rose-600 font-bold text-xs">{item.risk}/100</div>
                <div className="text-[10px] text-slate-400">Threat Index</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lookalike & Typosquatted Domains */}
      <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#1a2A2f]" />
            <h3 className="text-sm font-bold text-[#1a2A2f]">Newly Registered Lookalike Domains</h3>
          </div>
          <span className="text-[10px] font-mono text-[#1a2A2f] bg-[#88BDF2]/20 font-bold px-2 py-0.5 rounded">
            Active Watchlist
          </span>
        </div>

        <div className="space-y-2 mt-3">
          {lookalikeDomains.map((item) => (
            <div
              key={item.domain}
              className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs"
            >
              <div>
                <div className="font-mono font-bold text-[#1a2A2f] truncate max-w-[220px]">
                  {item.domain}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Impersonates: <span className="text-amber-600 font-semibold">{item.brand}</span> • Age: {item.age}
                </div>
              </div>

              <div className="text-right font-mono">
                <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-700 font-bold text-[10px] border border-rose-200">
                  Risk {item.risk}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
