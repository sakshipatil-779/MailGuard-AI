"use client";

import React from "react";
import { DomainIntelligence, IpIntelligence } from "@/types/threat";
import { Globe, Server, AlertTriangle, ShieldAlert, CheckCircle2, Copy, ExternalLink, Calendar, Hash } from "lucide-react";
import { maskIp } from "@/lib/utils";
import { useSecurity } from "@/context/SecurityContext";
import { toast } from "sonner";

interface DomainIpIntelligenceProps {
  domains: DomainIntelligence[];
  ips: IpIntelligence[];
}

export function DomainIpIntelligence({ domains, ips }: DomainIpIntelligenceProps) {
  const { maskIps } = useSecurity();

  return (
    <div className="space-y-6">
      {/* Domain Intelligence Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Globe className="w-4 h-4 text-[#88BDF2]" />
          <span>Domain Threat Intelligence & Typo-squatting Analysis</span>
        </h3>

        {domains.map((dom) => (
          <div
            key={dom.domain}
            className="p-5 rounded-xl bg-[#1a242f] border border-[#384959] space-y-4"
          >
            {/* Domain Title Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#384959]">
              <div>
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-base font-bold text-[#BDDDFC]">{dom.domain}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(dom.domain);
                      toast.success(`Copied domain ${dom.domain}`);
                    }}
                    className="text-[#6A89A7] hover:text-[#BDDDFC]"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="text-[11px] text-[#6A89A7] font-mono mt-0.5">
                  Registrar: <span className="text-slate-200">{dom.registrar}</span> • Age:{" "}
                  <strong className={dom.domainAgeDays < 30 ? "text-rose-400 font-bold" : "text-slate-200"}>
                    {dom.domainAgeDays} days
                  </strong>
                </div>
              </div>

              <div className="flex items-center gap-2 font-mono">
                <span
                  className={`px-2.5 py-1 rounded text-xs font-bold ${
                    dom.riskScore >= 75
                      ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                      : dom.riskScore >= 50
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  }`}
                >
                  Domain Risk: {dom.riskScore}/100
                </span>
              </div>
            </div>

            {/* Lookalike Warning Box if applicable */}
            {dom.isLookalike && (
              <div className="p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs font-mono space-y-1">
                <div className="flex items-center gap-2 text-rose-400 font-bold">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Target Brand Lookalike / Typosquat Impersonation Detected</span>
                </div>
                <div className="text-slate-200">
                  Targeted Brand: <strong className="text-amber-300">{dom.lookalikeBrand}</strong> (Similarity Score:{" "}
                  {Math.round((dom.lookalikeSimilarity || 0.85) * 100)}%)
                </div>
                <div className="text-[#6A89A7] text-[11px]">{dom.lookalikeReason}</div>
              </div>
            )}

            {/* DNS & Registration Metadata Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3 rounded-lg bg-[#243240] border border-[#384959]">
                <span className="text-[10px] text-[#6A89A7] uppercase">Creation / Expiration</span>
                <div className="font-bold text-white mt-1">
                  {new Date(dom.createdDate).toLocaleDateString()}
                </div>
                <div className="text-[10px] text-[#6A89A7] mt-0.5">
                  Expires: {new Date(dom.expiryDate).toLocaleDateString()}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#243240] border border-[#384959]">
                <span className="text-[10px] text-[#6A89A7] uppercase">Hosting & ASN</span>
                <div className="font-bold text-[#BDDDFC] mt-1 truncate">{dom.hostingProvider}</div>
                <div className="text-[10px] text-[#6A89A7] mt-0.5">{dom.asn}</div>
              </div>

              <div className="p-3 rounded-lg bg-[#243240] border border-[#384959]">
                <span className="text-[10px] text-[#6A89A7] uppercase">MX Mail Exchanger</span>
                <div className="font-bold text-white mt-1 truncate">{dom.mxRecords[0] || "None"}</div>
                <div className="text-[10px] text-[#6A89A7] mt-0.5">A Record: {dom.aRecords[0] || "N/A"}</div>
              </div>

              <div className="p-3 rounded-lg bg-[#243240] border border-[#384959]">
                <span className="text-[10px] text-[#6A89A7] uppercase">DMARC Published Policy</span>
                <div className="font-bold text-white mt-1">p={dom.dmarcPolicy || "none"}</div>
                <div className="text-[10px] text-[#6A89A7] mt-0.5">DNS Resolution: Valid</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* IP Intelligence Section */}
      <div className="space-y-4 pt-4 border-t border-[#384959]">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Server className="w-4 h-4 text-[#88BDF2]" />
          <span>IP Address Threat Intelligence & Reputation</span>
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {ips.map((ip) => {
            const displayIp = maskIps ? maskIp(ip.ip) : ip.ip;

            return (
              <div
                key={ip.ip}
                className="p-5 rounded-xl bg-[#1a242f] border border-[#384959] space-y-3 font-mono text-xs"
              >
                <div className="flex items-center justify-between pb-2 border-b border-[#384959]">
                  <div className="flex items-center gap-2 font-bold text-sm text-[#BDDDFC]">
                    <span>{displayIp}</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(ip.ip);
                        toast.success(`Copied IP ${ip.ip}`);
                      }}
                      className="text-[#6A89A7] hover:text-[#BDDDFC]"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      ip.threatScore >= 75
                        ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                        : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    }`}
                  >
                    Threat Score: {ip.threatScore}/100
                  </span>
                </div>

                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-[#6A89A7]">Organization:</span>
                    <span className="text-slate-200 font-bold">{ip.organization}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6A89A7]">Autonomous System:</span>
                    <span className="text-[#BDDDFC]">{ip.asn}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6A89A7]">Location:</span>
                    <span className="text-slate-200">{ip.city}, {ip.country} ({ip.countryCode})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6A89A7]">Reverse DNS PTR:</span>
                    <span className="text-slate-300 truncate max-w-[200px]">{ip.reverseDns}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6A89A7]">Abuse Reports:</span>
                    <span className={ip.abuseReportsCount > 0 ? "text-rose-400 font-bold" : "text-[#6A89A7]"}>
                      {ip.abuseReportsCount} reports logged
                    </span>
                  </div>
                </div>

                {/* Flags */}
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[#384959]">
                  {ip.isVpnOrProxy && (
                    <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 text-[10px] border border-amber-500/20">
                      VPN / Proxy
                    </span>
                  )}
                  {ip.isTorExit && (
                    <span className="px-1.5 py-0.5 rounded bg-[#88BDF2]/10 text-[#BDDDFC] text-[10px] border border-[#88BDF2]/20">
                      Tor Exit Node
                    </span>
                  )}
                  {ip.isHosting && (
                    <span className="px-1.5 py-0.5 rounded bg-[#88BDF2]/15 text-[#BDDDFC] text-[10px] border border-[#88BDF2]/30">
                      Datacenter / Cloud
                    </span>
                  )}
                  {ip.isKnownAbuser && (
                    <span className="px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-300 text-[10px] border border-rose-500/20">
                      Known Threat Actor
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
