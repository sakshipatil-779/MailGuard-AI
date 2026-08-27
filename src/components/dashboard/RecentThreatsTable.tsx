"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  ArrowUpRight,
  Filter,
  Search,
  ExternalLink,
  ShieldCheck,
  FolderPlus,
  FileSpreadsheet,
  Globe,
  Radio
} from "lucide-react";
import { EmailAnalysis } from "@/types/analysis";
import { getSeverityBadge, getClassificationMeta, maskEmail, maskIp } from "@/lib/utils";
import { useSecurity } from "@/context/SecurityContext";
import { toast } from "sonner";
import { MockStorage } from "@/lib/storage/mock-store";
import { useRouter } from "next/navigation";

interface RecentThreatsTableProps {
  emails: EmailAnalysis[];
}

export function RecentThreatsTable({ emails }: RecentThreatsTableProps) {
  const router = useRouter();
  const { maskPii, maskIps } = useSecurity();
  const [filterSeverity, setFilterSeverity] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filtered = emails.filter((email) => {
    if (filterSeverity !== "ALL" && email.severity !== filterSeverity.toLowerCase()) {
      return false;
    }
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      return (
        email.headers.subject.toLowerCase().includes(term) ||
        email.headers.fromAddress.toLowerCase().includes(term) ||
        email.origin.ip.includes(term) ||
        email.classification.toLowerCase().includes(term)
      );
    }
    return true;
  });

  const handleQuarantine = (email: EmailAnalysis) => {
    email.status = "QUARANTINED";
    MockStorage.saveEmail(email);
    toast.success(`Message '${email.headers.subject.substring(0, 30)}...' quarantined across enterprise mailboxes.`);
  };

  const handleCreateCase = (email: EmailAnalysis) => {
    const caseId = `CASE-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    MockStorage.saveCase({
      id: caseId,
      caseNumber: caseId,
      title: `Investigation: ${email.headers.subject}`,
      description: email.executiveSummary,
      status: "OPEN",
      severity: email.severity,
      primaryClassification: email.classification,
      leadAnalyst: "Alex Mercer",
      assignedTeam: "SOC Tier 2",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      targetVictims: email.headers.to,
      mitreAttckIds: email.findings.map(f => f.mitreTechnique || "T1566").slice(0, 3),
      tags: ["Auto-Created", email.classification.toUpperCase(), email.severity.toUpperCase()],
      emailIds: [email.id],
      evidence: [
        {
          id: `EVD-${Date.now()}`,
          caseId: caseId,
          type: "RAW_EMAIL",
          name: email.filename || "threat_email.eml",
          description: "Raw RFC-822 message payload preserved from gateway.",
          sha256: email.sha256,
          collectedAt: email.createdAt,
          collectedBy: "Automated SOC Ingestion",
          integrityStatus: "VERIFIED",
          storageRef: `s3://forensic-vault-us-east/evidence/${email.id}.eml`,
          fileSizeBytes: email.rawSize
        }
      ],
      timeline: [
        {
          id: `tl-${Date.now()}`,
          timestamp: new Date().toISOString(),
          type: "CASE_CREATED",
          actor: "Alex Mercer",
          title: "Investigation Case Spawned",
          details: `Case created directly from Email Threat Analysis ID ${email.analysisId}.`
        }
      ],
      iocs: email.iocs,
      analystNotes: []
    });

    email.caseId = caseId;
    MockStorage.saveEmail(email);
    toast.success(`Case ${caseId} created and linked to email.`);
    router.push(`/investigations/${caseId}`);
  };

  return (
    <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-[#1a2A2f]">Live Threat Stream & Detections</h3>
            <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-rose-50 text-rose-600 border border-rose-200 font-semibold">
              <Radio className="w-3 h-3 animate-pulse text-rose-600" />
              REAL-TIME
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-mono mt-0.5">
            Inspected messages, heuristic risk scoring & automated triage actions
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter threat feed..."
              className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-[#1a2A2f] placeholder-slate-400 focus:outline-none focus:border-[#1a2A2f] w-44 font-mono"
            />
          </div>

          {/* Severity Filter Buttons on background (Dark Color #1a2A2f with white text when active) */}
          <div className="flex items-center bg-slate-100 border border-slate-200 rounded-lg p-1 text-[11px] font-mono">
            {["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"].map((sev) => (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className={`px-2.5 py-1 rounded transition-all ${
                  filterSeverity === sev
                    ? "bg-[#1a2A2f] text-white font-bold shadow-sm"
                    : "text-[#1a2A2f] hover:text-black"
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto mt-4">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-[#1a2A2f] text-white text-[10px] font-mono uppercase tracking-wider rounded-lg">
              <th className="py-2.5 px-3 rounded-l-lg">Severity & Threat</th>
              <th className="py-2.5 px-3">Email Subject & Sender</th>
              <th className="py-2.5 px-3">Risk Score</th>
              <th className="py-2.5 px-3">Origin IP / Geolocation</th>
              <th className="py-2.5 px-3">Auth Alignment</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3 text-right rounded-r-lg">Forensic Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((email) => {
              const sevBadge = getSeverityBadge(email.severity);
              const classMeta = getClassificationMeta(email.classification);
              const displaySender = maskPii ? maskEmail(email.headers.fromAddress) : email.headers.fromAddress;
              const displayIp = maskIps ? maskIp(email.origin.ip) : email.origin.ip;

              return (
                <tr key={email.id} className="hover:bg-slate-50 transition-colors group">
                  {/* Severity & Threat Classification */}
                  <td className="py-3 px-3">
                    <div className="flex flex-col gap-1">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold w-fit ${sevBadge.bg} ${sevBadge.text} border ${sevBadge.border}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${sevBadge.dot}`}></span>
                        {sevBadge.label}
                      </span>
                      <span className="text-[10px] font-mono text-[#1a2A2f] font-medium">
                        {classMeta.label}
                      </span>
                    </div>
                  </td>

                  {/* Subject & Sender */}
                  <td className="py-3 px-3 max-w-xs">
                    <Link
                      href={`/emails/${email.id}`}
                      className="font-semibold text-[#1a2A2f] group-hover:text-[#88BDF2] transition-colors line-clamp-1 flex items-center gap-1"
                    >
                      <span>{email.headers.subject}</span>
                    </Link>
                    <div className="text-[11px] text-slate-500 font-mono truncate mt-0.5">
                      From: {displaySender}
                    </div>
                  </td>

                  {/* Risk Score */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            email.riskScore >= 75
                              ? "bg-rose-500"
                              : email.riskScore >= 50
                              ? "bg-amber-500"
                              : "bg-[#1a2A2f]"
                          }`}
                          style={{ width: `${email.riskScore}%` }}
                        />
                      </div>
                      <span className="font-mono font-bold text-[#1a2A2f] text-xs">
                        {email.riskScore}
                        <span className="text-[10px] text-slate-400">/100</span>
                      </span>
                    </div>
                  </td>

                  {/* Origin IP & Geo */}
                  <td className="py-3 px-3 font-mono text-[11px]">
                    <div className="flex items-center gap-1.5 text-[#1a2A2f] font-medium">
                      <Globe className="w-3.5 h-3.5 text-[#88BDF2]" />
                      <span>{email.origin.country}</span>
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {displayIp}
                    </div>
                  </td>

                  {/* SPF / DKIM / DMARC Auth Status */}
                  <td className="py-3 px-3 font-mono text-[10px]">
                    <div className="flex items-center gap-1">
                      <span className={`px-1 rounded ${email.authentication.spf === 'pass' ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'}`}>
                        SPF:{email.authentication.spf.toUpperCase()}
                      </span>
                      <span className={`px-1 rounded ${email.authentication.dkim === 'pass' ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'}`}>
                        DKIM:{email.authentication.dkim.toUpperCase()}
                      </span>
                      <span className={`px-1 rounded ${email.authentication.dmarc === 'pass' ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'}`}>
                        DMARC:{email.authentication.dmarc.toUpperCase()}
                      </span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      email.status === "QUARANTINED"
                        ? "bg-rose-50 text-rose-600 border border-rose-200"
                        : email.status === "ESCALATED"
                        ? "bg-[#88BDF2]/20 text-[#1a2A2f] border border-[#88BDF2]"
                        : "bg-slate-100 text-[#1a2A2f] border border-slate-200"
                    }`}>
                      {email.status}
                    </span>
                  </td>

                  {/* Action Buttons on background (Dark Color #1a2A2f with white text) */}
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/emails/${email.id}`}
                        title="Open Deep Forensics Dossier"
                        className="p-1.5 rounded-lg bg-[#1a2A2f] hover:bg-[#1a2A2f]/90 text-white transition-colors shadow-sm"
                      >
                        <ArrowUpRight className="w-3.5 h-3.5 text-white" />
                      </Link>

                      {email.status !== "QUARANTINED" && (
                        <button
                          onClick={() => handleQuarantine(email)}
                          title="Quarantine Message"
                          className="p-1.5 rounded-lg bg-[#1a2A2f] hover:bg-rose-700 text-white transition-colors shadow-sm"
                        >
                          <ShieldAlert className="w-3.5 h-3.5 text-white" />
                        </button>
                      )}

                      {!email.caseId && (
                        <button
                          onClick={() => handleCreateCase(email)}
                          title="Create Investigation Case"
                          className="p-1.5 rounded-lg bg-[#1a2A2f] hover:bg-[#1a2A2f]/90 text-white transition-colors shadow-sm"
                        >
                          <FolderPlus className="w-3.5 h-3.5 text-white" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="py-12 text-center text-slate-400 text-xs font-mono">
            No threat detections matching filter criteria.
          </div>
        )}
      </div>
    </div>
  );
}
