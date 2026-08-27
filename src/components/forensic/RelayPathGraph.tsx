"use client";

import React, { useState } from "react";
import { RelayHop } from "@/types/threat";
import {
  Server,
  ArrowRight,
  ShieldAlert,
  Clock,
  Lock,
  Globe,
  Radio,
  X,
  Info,
  ChevronRight,
  Layers
} from "lucide-react";
import { maskIp } from "@/lib/utils";
import { useSecurity } from "@/context/SecurityContext";

interface RelayPathGraphProps {
  relayPath: RelayHop[];
}

export function RelayPathGraph({ relayPath }: RelayPathGraphProps) {
  const { maskIps } = useSecurity();
  const [selectedHop, setSelectedHop] = useState<RelayHop | null>(relayPath[0] || null);

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-[#1a242f] border border-[#384959]">
        <div>
          <h3 className="text-xs font-bold text-white flex items-center gap-2">
            <span>Email Transmission Relay Sequence ({relayPath.length} Hops Reconstructed)</span>
            <span className="w-2 h-2 rounded-full bg-[#88BDF2] animate-pulse glow-dot-sky" />
          </h3>
          <p className="text-[11px] text-[#6A89A7] font-mono mt-0.5">
            Chronological mail transport chain extracted from RFC-822 Received headers
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="flex items-center gap-1.5 text-rose-400">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            Anomalous / Threat Node
          </span>
          <span className="flex items-center gap-1.5 text-[#88BDF2]">
            <span className="w-2 h-2 rounded-full bg-[#88BDF2]" />
            Verified Gateway
          </span>
        </div>
      </div>

      {/* Interactive Visual Hop Flow */}
      <div className="p-6 rounded-2xl bg-[#1a242f] border border-[#384959] overflow-x-auto">
        <div className="flex items-stretch gap-3 min-w-[700px]">
          {relayPath.map((hop, index) => {
            const isSelected = selectedHop?.id === hop.id;
            const displayIp = maskIps ? maskIp(hop.ip) : hop.ip;

            return (
              <React.Fragment key={hop.id}>
                {/* Hop Node Card */}
                <div
                  onClick={() => setSelectedHop(hop)}
                  className={`flex-1 p-4 rounded-xl border cursor-pointer transition-all duration-200 relative ${
                    isSelected
                      ? "bg-[#243240] border-[#88BDF2] shadow-glow ring-1 ring-[#88BDF2]"
                      : hop.anomaly
                      ? "bg-rose-500/10 border-rose-500/40 hover:border-rose-500/80"
                      : "bg-[#243240]/60 border-[#384959] hover:border-[#6A89A7]"
                  }`}
                >
                  {/* Hop Tag */}
                  <div className="flex items-center justify-between pb-2 border-b border-[#384959]">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#1a242f] text-[#BDDDFC]">
                      HOP #{hop.hopNumber}
                    </span>

                    {hop.isOrigin && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                        ORIGIN NODE
                      </span>
                    )}

                    {hop.isDestination && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        INBOX GATEWAY
                      </span>
                    )}
                  </div>

                  {/* Node Server Body */}
                  <div className="mt-3 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-white truncate" title={hop.fromHost}>
                      <Server className="w-3.5 h-3.5 text-[#88BDF2] shrink-0" />
                      <span className="truncate">{hop.fromHost || hop.ip}</span>
                    </div>

                    <div className="text-[11px] font-mono text-[#BDDDFC]">
                      IP: {displayIp}
                    </div>

                    <div className="text-[10px] text-[#6A89A7] font-mono flex items-center gap-1">
                      <Globe className="w-3 h-3 text-[#6A89A7]" />
                      <span>{hop.city}, {hop.country} ({hop.countryCode})</span>
                    </div>

                    <div className="text-[10px] text-[#6A89A7] font-mono truncate">
                      ASN: {hop.asn}
                    </div>
                  </div>

                  {/* Anomaly Badge */}
                  {hop.anomaly && (
                    <div className="mt-3 p-1.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-mono border border-rose-500/30 flex items-center gap-1">
                      <ShieldAlert className="w-3 h-3 text-rose-400 shrink-0" />
                      <span className="truncate">Relay Anomaly Flagged</span>
                    </div>
                  )}

                  {/* TLS & Delay Footer */}
                  <div className="mt-3 pt-2 border-t border-[#384959] flex items-center justify-between text-[10px] font-mono text-[#6A89A7]">
                    <span className="flex items-center gap-1">
                      <Lock className="w-3 h-3 text-[#88BDF2]" />
                      {hop.tlsVersion || "No TLS"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#6A89A7]" />
                      +{hop.delaySeconds}s
                    </span>
                  </div>
                </div>

                {/* Arrow Connector */}
                {index < relayPath.length - 1 && (
                  <div className="flex flex-col items-center justify-center text-[#6A89A7] px-1">
                    <ArrowRight className="w-5 h-5 text-[#88BDF2] animate-pulse" />
                    <span className="text-[9px] font-mono text-[#6A89A7] mt-1">
                      {relayPath[index + 1].delaySeconds}s
                    </span>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Detailed Hop Inspection Drawer */}
      {selectedHop && (
        <div className="p-5 rounded-xl bg-[#243240] border border-[#88BDF2]/40 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#384959]">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-[#88BDF2]/20 text-[#BDDDFC] font-mono font-bold text-xs border border-[#88BDF2]/30">
                HOP #{selectedHop.hopNumber} INSPECTION
              </span>
              <span className="text-sm font-bold text-white font-mono">
                {selectedHop.fromHost || selectedHop.ip}
              </span>
            </div>

            <div className="text-xs font-mono text-[#6A89A7]">
              Timestamp: {selectedHop.timestamp}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-3 rounded-lg bg-[#1a242f] border border-[#384959]">
              <div className="text-[10px] text-[#6A89A7] uppercase">IP Address & PTR</div>
              <div className="font-bold text-[#BDDDFC] mt-1">
                {maskIps ? maskIp(selectedHop.ip) : selectedHop.ip}
              </div>
              <div className="text-[10px] text-[#6A89A7] truncate mt-0.5">
                rDNS: {selectedHop.reverseDns || "None"}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#1a242f] border border-[#384959]">
              <div className="text-[10px] text-[#6A89A7] uppercase">Autonomous System & ISP</div>
              <div className="font-bold text-white mt-1 truncate">{selectedHop.asn}</div>
              <div className="text-[10px] text-[#6A89A7] truncate mt-0.5">{selectedHop.isp}</div>
            </div>

            <div className="p-3 rounded-lg bg-[#1a242f] border border-[#384959]">
              <div className="text-[10px] text-[#6A89A7] uppercase">Geolocation Estimate</div>
              <div className="font-bold text-white mt-1">
                {selectedHop.city}, {selectedHop.country}
              </div>
              <div className="text-[10px] text-[#6A89A7] mt-0.5">
                Coords: {selectedHop.latitude.toFixed(4)}, {selectedHop.longitude.toFixed(4)}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#1a242f] border border-[#384959]">
              <div className="text-[10px] text-[#6A89A7] uppercase">Transport Security</div>
              <div className="font-bold text-[#88BDF2] mt-1">
                {selectedHop.tlsVersion || "Cleartext (No TLS)"}
              </div>
              <div className="text-[10px] text-[#6A89A7] mt-0.5">
                Protocol: {selectedHop.protocol}
              </div>
            </div>
          </div>

          {selectedHop.anomaly && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 font-mono">
              <div className="font-bold flex items-center gap-1.5 mb-1 text-rose-400">
                <ShieldAlert className="w-4 h-4" />
                Relay Hop Anomaly Intelligence:
              </div>
              <div>{selectedHop.anomalyReason}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
