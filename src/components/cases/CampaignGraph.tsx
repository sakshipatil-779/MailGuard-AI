"use client";

import React, { useState } from "react";
import { CampaignGraphData, CampaignNode, CampaignEdge } from "@/types/investigation";
import {
  FolderGit2,
  Globe,
  Server,
  Mail,
  ShieldAlert,
  Skull,
  Info,
  Radio,
  Share2,
  ZoomIn,
  ZoomOut
} from "lucide-react";

interface CampaignGraphProps {
  data: CampaignGraphData;
}

export function CampaignGraph({ data }: CampaignGraphProps) {
  const [selectedNode, setSelectedNode] = useState<CampaignNode | null>(data.nodes[0] || null);

  const getNodeIcon = (type: CampaignNode["type"]) => {
    switch (type) {
      case "campaign":
        return FolderGit2;
      case "domain":
        return Globe;
      case "ip":
        return Server;
      case "email":
        return Mail;
      case "malware":
        return Skull;
      default:
        return ShieldAlert;
    }
  };

  const getNodeColor = (type: CampaignNode["type"]) => {
    switch (type) {
      case "campaign":
        return "border-rose-500 bg-rose-500/10 text-rose-400";
      case "domain":
        return "border-[#88BDF2] bg-[#88BDF2]/10 text-[#BDDDFC]";
      case "ip":
        return "border-[#6A89A7] bg-[#6A89A7]/10 text-[#BDDDFC]";
      case "email":
        return "border-amber-500 bg-amber-500/10 text-amber-400";
      case "malware":
        return "border-purple-500 bg-purple-500/10 text-purple-400";
      default:
        return "border-[#384959] bg-[#384959]/10 text-[#6A89A7]";
    }
  };

  return (
    <div className="space-y-4">
      {/* Campaign Graph Header */}
      <div className="p-4 rounded-xl bg-[#1a242f] border border-[#384959] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-[#88BDF2]" />
            <span className="text-xs font-bold text-white font-mono">
              {data.campaignName}
            </span>
            <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 text-[10px] font-mono font-bold border border-rose-500/30">
              Confidence: {data.confidence}
            </span>
          </div>
          <p className="text-[11px] text-[#6A89A7] font-mono mt-0.5">
            Threat Actor: <strong className="text-slate-200">{data.threatActor || "UNC-3891"}</strong> • Active Window: {data.firstSeen} to {data.lastSeen}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded bg-[#243240] border border-[#384959] text-slate-300">
            {data.nodes.length} Nodes / {data.edges.length} Edges
          </span>
        </div>
      </div>

      {/* Visual Graph Canvas Representation */}
      <div className="p-6 rounded-2xl bg-[#1a242f] border border-[#384959] relative overflow-hidden min-h-[380px]">
        <div className="absolute inset-0 bg-cyber-dots opacity-20 pointer-events-none" />

        {/* Nodes Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
          {data.nodes.map((node) => {
            const Icon = getNodeIcon(node.type);
            const colorClass = getNodeColor(node.type);
            const isSelected = selectedNode?.id === node.id;

            return (
              <div
                key={node.id}
                onClick={() => setSelectedNode(node)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? "ring-2 ring-[#88BDF2] shadow-glow bg-[#243240] scale-[1.02]"
                    : "bg-[#243240]/80 hover:bg-[#243240]"
                } ${colorClass}`}
              >
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="text-[10px] font-mono uppercase font-bold tracking-wider">
                    {node.type}
                  </span>
                  <span className="font-mono text-[10px] font-bold text-white">
                    Risk {node.riskScore}
                  </span>
                </div>

                <div className="mt-2.5 flex items-start gap-2.5">
                  <div className="p-2 rounded-lg bg-black/40 border border-white/10 shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white font-mono truncate" title={node.label}>
                      {node.label}
                    </div>
                    {node.sublabel && (
                      <div className="text-[10px] text-[#6A89A7] font-mono truncate mt-0.5">
                        {node.sublabel}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Relationships List / Edges */}
        <div className="mt-6 pt-4 border-t border-[#384959] relative z-10">
          <div className="text-[10px] font-mono uppercase text-[#6A89A7] mb-2">
            Discovered Campaign Infrastructure Linkages
          </div>
          <div className="flex flex-wrap gap-2">
            {data.edges.map((edge) => {
              const srcNode = data.nodes.find((n) => n.id === edge.source);
              const tgtNode = data.nodes.find((n) => n.id === edge.target);

              return (
                <div
                  key={edge.id}
                  className="px-2.5 py-1.5 rounded-lg bg-[#243240] border border-[#384959] text-[11px] font-mono text-slate-300 flex items-center gap-1.5"
                >
                  <span className="text-[#BDDDFC]">{srcNode?.label || edge.source}</span>
                  <span className="text-[#6A89A7] font-bold">→ [{edge.label || edge.relationType}] →</span>
                  <span className="text-amber-300">{tgtNode?.label || edge.target}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
