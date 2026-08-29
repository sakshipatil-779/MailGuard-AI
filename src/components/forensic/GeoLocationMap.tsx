"use client";

import React from "react";
import dynamic from "next/dynamic";
import { EmailAnalysis } from "@/types/analysis";
import { Globe, Loader2 } from "lucide-react";

// Dynamically import the real Leaflet interactive map with SSR disabled
const RealLeafletMap = dynamic(
  () => import("@/components/forensic/RealLeafletMap"),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-2xl bg-white border border-slate-200 p-12 text-center flex flex-col items-center justify-center min-h-[450px] space-y-4">
        <div className="relative">
          <Globe className="w-10 h-10 text-[#88BDF2] animate-spin" />
        </div>
        <div className="font-mono text-xs text-slate-500">
          Initializing Real-World Interactive Leaflet Map &amp; Resolving Coordinates...
        </div>
      </div>
    ),
  }
);

interface GeoLocationMapProps {
  email: EmailAnalysis;
}

export function GeoLocationMap({ email }: GeoLocationMapProps) {
  return <RealLeafletMap email={email} />;
}
