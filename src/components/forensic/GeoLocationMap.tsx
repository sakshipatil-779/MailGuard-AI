"use client";

import React, { useState } from "react";
import { EmailAnalysis } from "@/types/analysis";
import { Globe, MapPin, ShieldAlert, Radio, Server, Lock, ExternalLink, HelpCircle } from "lucide-react";
import { maskIp } from "@/lib/utils";
import { useSecurity } from "@/context/SecurityContext";

interface GeoLocationMapProps {
  email: EmailAnalysis;
}

export function GeoLocationMap({ email }: GeoLocationMapProps) {
  const { maskIps } = useSecurity();
  const origin = email.origin;
  const displayIp = maskIps ? maskIp(origin.ip) : origin.ip;

  // Convert lat/long to SVG 2D mercator projection coordinates (width 800, height 400)
  const projectCoords = (lat: number, lng: number) => {
    const x = ((lng + 180) / 360) * 800;
    const latRad = (lat * Math.PI) / 180;
    const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
    const y = 200 - (mercN / Math.PI) * 160;
    return { x: Math.max(10, Math.min(790, x)), y: Math.max(10, Math.min(390, y)) };
  };

  const originPoint = projectCoords(origin.latitude, origin.longitude);
  
  // Hop coordinates
  const hopPoints = email.relayPath.map(h => ({
    ...h,
    point: projectCoords(h.latitude, h.longitude)
  }));

  return (
    <div className="space-y-4">
      {/* Forensic Intelligence Disclaimer Banner */}
      <div className="p-3 rounded-xl bg-[#1a242f] border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-300 font-mono">
        <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Forensic Attribution Notice: </span>
          IP Geolocation represents hosting / ISP infrastructure location estimates, and does not conclusively prove physical human actor identity or jurisdiction.
        </div>
      </div>

      {/* Main Map Canvas + Telemetry Overlay */}
      <div className="rounded-2xl bg-[#1a242f] border border-[#384959] overflow-hidden relative shadow-2xl">
        {/* Map Header */}
        <div className="p-4 bg-[#243240]/90 border-b border-[#384959] flex items-center justify-between z-10 relative">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#88BDF2]" />
            <span className="text-xs font-bold text-white font-mono">
              Infrastructure Geolocation & Origin Trace
            </span>
            <span className="px-2 py-0.5 rounded bg-[#88BDF2]/20 text-[#BDDDFC] text-[10px] font-mono font-semibold">
              Confidence: {origin.confidence}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="text-[#6A89A7]">
              Origin: <strong className="text-rose-400">{origin.city}, {origin.country}</strong>
            </span>
            <span className="text-[#6A89A7]">
              Coordinates: <strong className="text-[#BDDDFC]">{origin.latitude.toFixed(2)}°, {origin.longitude.toFixed(2)}°</strong>
            </span>
          </div>
        </div>

        {/* SVG World Vector Map Representation */}
        <div className="relative w-full h-80 bg-[#1a242f]/40 flex items-center justify-center overflow-hidden">
          {/* Cyber Grid Lines */}
          <div className="absolute inset-0 bg-cyber-grid opacity-30 pointer-events-none" />

          {/* World Map SVG Paths */}
          <svg className="w-full h-full text-slate-800/60" viewBox="0 0 800 400">
            {/* Equator & Prime Meridian Grid */}
            <line x1="0" y1="200" x2="800" y2="200" stroke="#384959" strokeDasharray="4 4" strokeWidth="1" />
            <line x1="400" y1="0" x2="400" y2="400" stroke="#384959" strokeDasharray="4 4" strokeWidth="1" />
            <circle cx="400" cy="200" r="180" stroke="#384959" strokeDasharray="2 4" fill="none" opacity="0.3" />

            {/* Approximate continent shapes for visual security map */}
            <path
              d="M150,90 Q220,70 260,110 Q280,160 210,210 Q140,180 120,130 Z"
              fill="#243240"
              stroke="#384959"
            />
            <path
              d="M230,230 Q280,240 270,330 Q220,360 200,280 Z"
              fill="#243240"
              stroke="#384959"
            />
            <path
              d="M380,80 Q470,70 460,150 Q410,160 370,120 Z"
              fill="#243240"
              stroke="#384959"
            />
            <path
              d="M380,180 Q470,170 470,300 Q400,340 370,240 Z"
              fill="#243240"
              stroke="#384959"
            />
            <path
              d="M480,70 Q680,60 690,190 Q580,240 480,180 Z"
              fill="#243240"
              stroke="#384959"
            />
            <path
              d="M620,260 Q720,250 710,330 Q630,350 600,290 Z"
              fill="#243240"
              stroke="#384959"
            />

            {/* Hop Trajectory Lines */}
            {hopPoints.length > 1 && (
              <polyline
                points={hopPoints.map(h => `${h.point.x},${h.point.y}`).join(" ")}
                fill="none"
                stroke="#88BDF2"
                strokeWidth="2"
                strokeDasharray="6 4"
                className="animate-pulse"
              />
            )}

            {/* Relay Hop Points */}
            {hopPoints.map((hop, i) => (
              <g key={hop.id} transform={`translate(${hop.point.x}, ${hop.point.y})`}>
                <circle
                  r={hop.isOrigin ? "8" : "5"}
                  className={hop.isOrigin ? "fill-rose-500" : "fill-[#88BDF2]"}
                />
                <circle
                  r={hop.isOrigin ? "16" : "10"}
                  className={hop.isOrigin ? "stroke-rose-500 animate-ping opacity-75" : "stroke-[#88BDF2] animate-ping opacity-40"}
                  fill="none"
                />
                <text
                  x="12"
                  y="4"
                  fill={hop.isOrigin ? "#f43f5e" : "#88BDF2"}
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  Hop #{hop.hopNumber} ({hop.city})
                </text>
              </g>
            ))}
          </svg>

          {/* Floating Origin Node Card Overlay */}
          <div className="absolute bottom-4 left-4 p-3 rounded-xl bg-[#243240]/95 border border-[#88BDF2]/40 shadow-2xl text-xs font-mono backdrop-blur-md max-w-sm">
            <div className="flex items-center justify-between pb-1.5 border-b border-[#384959]">
              <span className="flex items-center gap-1.5 text-rose-400 font-bold text-[11px]">
                <MapPin className="w-3.5 h-3.5" />
                Originating IP: {displayIp}
              </span>
              {origin.proxyOrVpn && (
                <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[9px] font-bold border border-amber-500/30">
                  VPN / PROXY DETECTED
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2 text-[10px]">
              <div>
                <span className="text-[#6A89A7]">Country/City:</span>
                <div className="text-white font-bold">{origin.city}, {origin.country}</div>
              </div>
              <div>
                <span className="text-[#6A89A7]">Autonomous System:</span>
                <div className="text-[#BDDDFC] font-bold">{origin.asn}</div>
              </div>
              <div className="col-span-2">
                <span className="text-[#6A89A7]">Internet Service Provider:</span>
                <div className="text-slate-200 truncate">{origin.isp}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
