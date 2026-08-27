"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { MockStorage } from "@/lib/storage/mock-store";
import { InvestigationCase } from "@/types/investigation";
import { MOCK_CAMPAIGN_GRAPH } from "@/lib/data/mock-cases";
import { CampaignGraph } from "@/components/cases/CampaignGraph";
import { CaseTimeline } from "@/components/cases/CaseTimeline";
import {
  FolderGit2,
  Mail,
  Share2,
  Lock,
  Clock,
  MessageSquare,
  ArrowLeft,
  CheckCircle2,
  ShieldAlert,
  Plus,
  Send,
  FileCheck,
  UserCheck
} from "lucide-react";
import Link from "next/link";
import { getSeverityBadge, formatBytes } from "@/lib/utils";
import { toast } from "sonner";

type CaseTab = "overview" | "graph" | "evidence" | "timeline" | "notes";

export default function CaseDetailPage() {
  const params = useParams();
  const caseId = params.caseId as string;
  const [caseObj, setCaseObj] = useState<InvestigationCase | null>(null);
  const [activeTab, setActiveTab] = useState<CaseTab>("overview");
  const [newNote, setNewNote] = useState("");

  useEffect(() => {
    const found = MockStorage.getCaseById(caseId);
    if (found) {
      setCaseObj(found);
    }
  }, [caseId]);

  if (!caseObj) {
    return (
      <div className="p-12 text-center text-[#6A89A7] font-mono space-y-4">
        <FolderGit2 className="w-12 h-12 text-[#88BDF2] mx-auto" />
        <div className="text-sm font-bold text-white">Investigation Case Not Found</div>
        <Link
          href="/investigations"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#88BDF2] text-[#1a242f] font-bold text-xs"
        >
          Return to Cases
        </Link>
      </div>
    );
  }

  const sevBadge = getSeverityBadge(caseObj.severity);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    MockStorage.addNoteToCase(caseObj.id, "Alex Mercer", newNote);
    const updated = MockStorage.getCaseById(caseObj.id);
    if (updated) setCaseObj(updated);
    setNewNote("");
    toast.success("Analyst case note appended.");
  };

  const handleUpdateStatus = (newStatus: InvestigationCase["status"]) => {
    caseObj.status = newStatus;
    caseObj.timeline.unshift({
      id: `tl-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: "STATUS_CHANGED",
      actor: "Alex Mercer",
      title: `Case Status Changed to ${newStatus}`,
      details: `Investigation status transitioned to ${newStatus}.`
    });
    MockStorage.saveCase(caseObj);
    setCaseObj({ ...caseObj });
    toast.success(`Case status set to ${newStatus}`);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Back Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/investigations"
          className="inline-flex items-center gap-2 text-xs font-mono text-[#6A89A7] hover:text-[#BDDDFC] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Investigation Cases</span>
        </Link>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-[#6A89A7]">Status:</span>
          {(["OPEN", "IN_PROGRESS", "CONTAINED", "RESOLVED"] as const).map((st) => (
            <button
              key={st}
              onClick={() => handleUpdateStatus(st)}
              className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
                caseObj.status === st
                  ? "bg-[#88BDF2] text-[#1a242f]"
                  : "bg-[#243240] text-[#6A89A7] hover:text-white"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Case Header Dossier */}
      <div className="p-6 rounded-2xl bg-[#243240]/90 border border-[#384959] backdrop-blur-xl shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="text-sm font-bold font-mono text-[#BDDDFC]">
              {caseObj.caseNumber}
            </span>
            <span
              className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold ${sevBadge.bg} ${sevBadge.text} border ${sevBadge.border}`}
            >
              {sevBadge.label}
            </span>
            <span className="px-2 py-0.5 rounded bg-[#1a242f] text-[11px] font-mono text-[#BDDDFC]">
              {caseObj.status}
            </span>
          </div>

          <div className="text-xs font-mono text-[#6A89A7]">
            Created: {new Date(caseObj.createdAt).toLocaleString()}
          </div>
        </div>

        <h1 className="text-xl font-black text-white">{caseObj.title}</h1>
        <p className="text-xs text-slate-300 leading-relaxed max-w-3xl font-sans">
          {caseObj.description}
        </p>

        {/* Metadata Badges */}
        <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-[#384959] text-xs font-mono text-[#6A89A7]">
          <div className="flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-[#88BDF2]" />
            <span>Lead: <strong className="text-white">{caseObj.leadAnalyst}</strong></span>
          </div>
          <div>
            Team: <strong className="text-slate-200">{caseObj.assignedTeam}</strong>
          </div>
          <div>
            Target Victims: <strong className="text-slate-200">{caseObj.targetVictims.join(", ")}</strong>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#384959] overflow-x-auto">
        <div className="flex items-center gap-1 min-w-[500px]">
          {[
            { key: "overview", label: "Associated Emails", icon: Mail, count: caseObj.emailIds.length },
            { key: "graph", label: "Campaign Correlation Graph", icon: Share2, count: null },
            { key: "evidence", label: "Evidence Locker", icon: Lock, count: caseObj.evidence.length },
            { key: "timeline", label: "Investigation Timeline", icon: Clock, count: caseObj.timeline.length },
            { key: "notes", label: "Analyst Notes", icon: MessageSquare, count: caseObj.analystNotes.length }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;

            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as CaseTab)}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-mono font-medium border-b-2 transition-all shrink-0 ${
                  isActive
                    ? "border-[#88BDF2] text-[#BDDDFC] bg-[#88BDF2]/10 font-bold"
                    : "border-transparent text-[#6A89A7] hover:text-[#BDDDFC]"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-[#88BDF2]" : "text-[#6A89A7]"}`} />
                <span>{tab.label}</span>
                {tab.count !== null && (
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-[#1a242f] text-[#BDDDFC]">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="pt-2">
        {/* OVERVIEW: Associated Emails */}
        {activeTab === "overview" && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
              Associated Threat Email Payloads ({caseObj.emailIds.length})
            </h3>

            {caseObj.associatedEmails && caseObj.associatedEmails.length > 0 ? (
              <div className="space-y-3">
                {caseObj.associatedEmails.map((eml) => (
                  <div
                    key={eml.id}
                    className="p-4 rounded-xl bg-[#1a242f] border border-[#384959] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono"
                  >
                    <div>
                      <div className="font-bold text-white text-sm">{eml.headers.subject}</div>
                      <div className="text-[#6A89A7] mt-1">
                        From: {eml.headers.fromAddress} • Origin: {eml.origin.city}, {eml.origin.country} ({eml.origin.ip})
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 rounded bg-rose-500/20 text-rose-400 font-bold">
                        Score: {eml.riskScore}/100
                      </span>
                      <Link
                        href={`/emails/${eml.id}`}
                        className="px-3 py-1.5 rounded-lg bg-[#88BDF2] hover:bg-[#BDDDFC] text-[#1a242f] font-bold"
                      >
                        Inspect Dossier
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-xl bg-[#1a242f] border border-[#384959] text-center text-xs font-mono text-[#6A89A7]">
                No specific email payload linked yet.
              </div>
            )}
          </div>
        )}

        {/* CAMPAIGN GRAPH */}
        {activeTab === "graph" && <CampaignGraph data={MOCK_CAMPAIGN_GRAPH} />}

        {/* EVIDENCE LOCKER */}
        {activeTab === "evidence" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                Cryptographic Evidence Locker & Sealed Artifacts
              </h3>
            </div>

            <div className="space-y-3">
              {caseObj.evidence.map((evd) => (
                <div
                  key={evd.id}
                  className="p-4 rounded-xl bg-[#1a242f] border border-[#384959] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="font-bold text-white">{evd.name}</span>
                      <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[10px]">
                        {evd.integrityStatus}
                      </span>
                    </div>
                    <div className="text-[#6A89A7] text-[11px]">{evd.description}</div>
                    <div className="text-[10px] text-[#BDDDFC] break-all">SHA-256: {evd.sha256}</div>
                  </div>

                  <div className="text-right text-[10px] text-[#6A89A7] shrink-0">
                    <div>Collected: {new Date(evd.collectedAt).toLocaleDateString()}</div>
                    <div>By: {evd.collectedBy}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TIMELINE */}
        {activeTab === "timeline" && <CaseTimeline events={caseObj.timeline} />}

        {/* NOTES */}
        {activeTab === "notes" && (
          <div className="space-y-6">
            {/* Add Note Form */}
            <form onSubmit={handleAddNote} className="p-4 rounded-xl bg-[#1a242f] border border-[#384959] space-y-3">
              <div className="text-xs font-bold text-white font-mono">Append Analyst Case Log</div>
              <textarea
                rows={3}
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Type investigation findings, victim contact status, containment actions..."
                className="w-full p-3 rounded-lg bg-[#243240] border border-[#384959] text-xs text-white placeholder-[#6A89A7] focus:outline-none focus:border-[#88BDF2]/50 font-sans"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#88BDF2] hover:bg-[#BDDDFC] text-[#1a242f] font-bold text-xs font-mono flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Append Note</span>
                </button>
              </div>
            </form>

            {/* Notes List */}
            <div className="space-y-3">
              {caseObj.analystNotes.map((note) => (
                <div
                  key={note.id}
                  className="p-4 rounded-xl bg-[#1a242f] border border-[#384959] space-y-1.5 text-xs font-mono"
                >
                  <div className="flex items-center justify-between text-[11px] pb-1 border-b border-[#384959]">
                    <span className="font-bold text-[#BDDDFC]">{note.author}</span>
                    <span className="text-[#6A89A7]">{new Date(note.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-slate-200 text-xs font-sans leading-relaxed pt-1">
                    {note.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
