"use client";

import React from "react";
import { Server, Globe, ShieldAlert, AlertTriangle, ExternalLink } from "lucide-react";
import { EmailAnalysis } from "@/types/analysis";

interface SuspiciousInfrastructureCardsProps {
  emails?: EmailAnalysis[];
}

export function SuspiciousInfrastructureCards({ emails = [] }: SuspiciousInfrastructureCardsProps) {
  // Extract ASNs dynamically from analyzed emails
  const asnsMap: Record<string, { asn: string; name: string; country: string; risk: number; category: string }> = {};
  
  emails.forEach(e => {
    e.relayPath.forEach(hop => {
      if (hop.asn && !asnsMap[hop.asn]) {
        asnsMap[hop.asn] = {
          asn: hop.asn,
          name: hop.isp || "Mail Ingestion Host",
          country: hop.countryCode || "US",
          risk: e.riskScore,
          category: e.classification.replace(/_/g, " ").toUpperCase()
        };
      }
    });
  });

  const badAsns = Object.values(asnsMap).slice(0, 4);

  // Extract lookalike & suspicious domains dynamically from analyzed emails
  const lookalikeDomains: { domain: string; brand: string; age: string; risk: number }[] = [];
  
  emails.forEach(e => {
    e.domainIntelligence.forEach(d => {
      lookalikeDomains.push({
        domain: d.domain,
        brand: d.lookalikeBrand || e.headers.fromName || "Target Organization",
        age: `${d.domainAgeDays} days`,
        risk: d.riskScore
      });
    });

    // Also include flagged URLs
    e.iocs.filter(ioc => ioc.type === "url" && ioc.malicious).forEach(ioc => {
      try {
        const urlObj = new URL(ioc.value);
        if (!lookalikeDomains.some(ld => ld.domain === urlObj.hostname)) {
          lookalikeDomains.push({
            domain: urlObj.hostname,
            brand: "Flagged Suspicious Link",
            age: "Active Lure",
            risk: ioc.riskScore
          });
        }
      } catch {}
    });
  });

  const displayDomains = lookalikeDomains.slice(0, 4);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Flagged Autonomous Systems (ASNs) */}
      <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-rose-600" />
            <h3 className="text-sm font-bold text-[#1a2A2f]">Flagged Threat ASNs & Origin Nodes</h3>
          </div>
          <span className="text-[10px] font-mono text-slate-500 font-semibold">
            {badAsns.length} Real-Time Nodes
          </span>
        </div>

        <div className="space-y-2 mt-3">
          {badAsns.length > 0 ? (
            badAsns.map((item) => (
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
                    <div className="text-[10px] text-slate-500 font-mono">{item.category} • {item.country}</div>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <div className="text-rose-600 font-bold text-xs">{item.risk}/100</div>
                  <div className="text-[10px] text-slate-400">Threat Score</div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-slate-400 text-xs font-mono">
              No suspicious ASNs detected yet. Ingest an email to map originating relay nodes.
            </div>
          )}
        </div>
      </div>

      {/* Lookalike & Typosquatted Domains */}
      <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#1a2A2f]" />
            <h3 className="text-sm font-bold text-[#1a2A2f]">Extracted Threat Domains & Flagged Links</h3>
          </div>
          <span className="text-[10px] font-mono text-[#1a2A2f] bg-[#88BDF2]/20 font-bold px-2 py-0.5 rounded">
            {displayDomains.length} Real-Time IOCs
          </span>
        </div>

        <div className="space-y-2 mt-3">
          {displayDomains.length > 0 ? (
            displayDomains.map((item) => (
              <div
                key={item.domain}
                className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs"
              >
                <div>
                  <div className="font-mono font-bold text-[#1a2A2f] truncate max-w-[220px]">
                    {item.domain}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    Context: <span className="text-amber-600 font-semibold">{item.brand}</span> • Status: {item.age}
                  </div>
                </div>

                <div className="text-right font-mono">
                  <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-700 font-bold text-[10px] border border-rose-200">
                    Risk {item.risk}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-slate-400 text-xs font-mono">
              No threat domains or malicious links extracted yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
