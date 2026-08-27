"use client";

import React from "react";
import { CaseTimelineEvent } from "@/types/investigation";
import {
  ShieldAlert,
  FolderPlus,
  Lock,
  MessageSquare,
  FileCheck,
  CheckCircle2,
  Clock
} from "lucide-react";

interface CaseTimelineProps {
  events: CaseTimelineEvent[];
}

export function CaseTimeline({ events }: CaseTimelineProps) {
  const getEventMeta = (type: CaseTimelineEvent["type"]) => {
    switch (type) {
      case "DETECTION":
        return { icon: ShieldAlert, color: "text-rose-400 border-rose-500/40 bg-rose-500/10" };
      case "CASE_CREATED":
        return { icon: FolderPlus, color: "text-[#88BDF2] border-[#88BDF2]/40 bg-[#88BDF2]/10" };
      case "EVIDENCE_ADDED":
        return { icon: Lock, color: "text-emerald-400 border-emerald-500/40 bg-emerald-500/10" };
      case "NOTE_ADDED":
        return { icon: MessageSquare, color: "text-[#BDDDFC] border-[#6A89A7]/40 bg-[#6A89A7]/15" };
      case "REPORT_GENERATED":
        return { icon: FileCheck, color: "text-amber-400 border-amber-500/40 bg-amber-500/10" };
      default:
        return { icon: Clock, color: "text-[#6A89A7] border-[#384959] bg-[#384959]/20" };
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#384959]">
        {events.map((event) => {
          const meta = getEventMeta(event.type);
          const Icon = meta.icon;

          return (
            <div key={event.id} className="relative group">
              {/* Dot Icon */}
              <div
                className={`absolute -left-6 top-1 w-6 h-6 rounded-full border flex items-center justify-center ${meta.color} shadow-sm z-10`}
              >
                <Icon className="w-3 h-3" />
              </div>

              {/* Event Box */}
              <div className="p-4 rounded-xl bg-[#1a242f] border border-[#384959] group-hover:border-[#88BDF2]/40 transition-all font-mono text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-1.5 border-b border-[#384959]/60">
                  <span className="font-bold text-white text-xs">{event.title}</span>
                  <span className="text-[10px] text-[#6A89A7]">
                    {new Date(event.timestamp).toLocaleString()}
                  </span>
                </div>

                <div className="text-slate-300 text-[11px] mt-2 leading-relaxed font-sans">
                  {event.details}
                </div>

                <div className="mt-2 text-[10px] text-[#88BDF2] font-mono">
                  Actor: <span className="text-slate-200">{event.actor}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
