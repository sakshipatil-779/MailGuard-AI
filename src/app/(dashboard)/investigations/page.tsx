"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { MockStorage } from "@/lib/storage/mock-store";
import { InvestigationCase, CaseStatus } from "@/types/investigation";
import {
  FolderGit2,
  PlusCircle,
  Search,
  Filter,
  ShieldAlert,
  ArrowRight,
  Clock,
  UserCheck,
  Tag,
  Inbox
} from "lucide-react";
import { getSeverityBadge, getClassificationMeta } from "@/lib/utils";
import { toast } from "sonner";

export default function InvestigationsPage() {
  const [cases, setCases] = useState<InvestigationCase[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newSeverity, setNewSeverity] = useState<"low" | "medium" | "high" | "critical">("high");

  useEffect(() => {
    setCases(MockStorage.getCases());
  }, []);

  const filtered = cases.filter((c) => {
    if (statusFilter !== "ALL" && c.status !== statusFilter) return false;
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      return (
        c.title.toLowerCase().includes(term) ||
        c.caseNumber.toLowerCase().includes(term) ||
        c.leadAnalyst.toLowerCase().includes(term) ||
        c.tags.some((t) => t.toLowerCase().includes(term))
      );
    }
    return true;
  });

  const handleCreateNewCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const caseId = `CASE-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newCase: InvestigationCase = {
      id: caseId,
      caseNumber: caseId,
      title: newTitle,
      description: newDescription || "Incident investigation created by analyst.",
      status: "OPEN",
      severity: newSeverity,
      primaryClassification: "business_email_compromise",
      leadAnalyst: "Security Analyst",
      assignedTeam: "Tier 2 Incident Response",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      targetVictims: ["corp-users@enterprise.com"],
      mitreAttckIds: ["T1566"],
      tags: ["Manual-Case", newSeverity.toUpperCase()],
      emailIds: [],
      evidence: [],
      timeline: [
        {
          id: `tl-${Date.now()}`,
          timestamp: new Date().toISOString(),
          type: "CASE_CREATED",
          actor: "Security Analyst",
          title: "Investigation Case Opened",
          details: `Manual investigation dossier established for ${newTitle}.`
        }
      ],
      iocs: [],
      analystNotes: []
    };

    MockStorage.saveCase(newCase);
    setCases(MockStorage.getCases());
    setIsModalOpen(false);
    setNewTitle("");
    setNewDescription("");
    toast.success(`Case ${caseId} created successfully.`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-[#88BDF2] shrink-0" />
            <h2 className="text-sm sm:text-base font-bold text-[#1a2A2f]">Incident Response & Case Management</h2>
          </div>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Active forensic investigations & campaign correlation ({cases.length} total)
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#1a2A2f] hover:bg-[#1a2A2f]/90 text-white font-bold text-xs font-mono transition-all shadow-sm border border-[#1a2A2f] shrink-0 w-full sm:w-auto"
        >
          <PlusCircle className="w-4 h-4 text-white" />
          <span>New Investigation Case</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="p-3 sm:p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search cases by title, analyst, tags..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-[#1a2A2f] placeholder-slate-400 focus:outline-none focus:border-[#1a2A2f] font-mono"
          />
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap items-center bg-slate-100 border border-slate-200 rounded-lg p-0.5 sm:p-1 text-[11px] font-mono">
          {["ALL", "OPEN", "IN_PROGRESS", "CONTAINED", "RESOLVED"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-2 sm:px-3 py-1 rounded transition-all ${
                statusFilter === status
                  ? "bg-[#1a2A2f] text-white font-bold shadow-sm"
                  : "text-[#1a2A2f] hover:text-black"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Cases Grid or Empty State */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((caseItem) => {
            const sevBadge = getSeverityBadge(caseItem.severity);

            return (
              <Link
                key={caseItem.id}
                href={`/investigations/${caseItem.id}`}
                className="p-5 rounded-xl bg-white border border-slate-200 hover:border-[#88BDF2] transition-all duration-200 flex flex-col justify-between space-y-4 group shadow-sm hover:shadow-md"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#1a2A2f]">
                      {caseItem.caseNumber}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${sevBadge.bg} ${sevBadge.text} border ${sevBadge.border}`}
                    >
                      {sevBadge.label}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-[#1a2A2f] group-hover:text-[#88BDF2] transition-colors line-clamp-2">
                    {caseItem.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 font-sans leading-relaxed">
                    {caseItem.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {caseItem.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded bg-slate-100 text-[10px] font-mono text-[#1a2A2f] border border-slate-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Footer */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                    <span>{caseItem.leadAnalyst}</span>
                  </div>

                  <div className="flex items-center gap-1 text-[#1a2A2f] font-bold group-hover:translate-x-0.5 transition-transform">
                    <span>Open Dossier</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="p-12 rounded-2xl bg-white border border-slate-200 shadow-sm text-center max-w-lg mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#88BDF2]/20 border border-[#88BDF2]/40 flex items-center justify-center mx-auto text-[#1a2A2f]">
            <Inbox className="w-7 h-7 text-[#1a2A2f]" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#1a2A2f]">No Active Investigation Cases</h3>
            <p className="text-xs text-slate-500 font-mono mt-1">
              Create a new case manually or escalate directly from high-risk email threat alerts.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1a2A2f] text-white font-bold text-xs font-mono shadow-sm hover:bg-[#1a2A2f]/90"
          >
            <PlusCircle className="w-4 h-4 text-white" />
            <span>Open First Investigation Case</span>
          </button>
        </div>
      )}

      {/* Create Case Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="text-sm font-bold text-[#1a2A2f] font-mono flex items-center gap-2">
                <FolderGit2 className="w-4 h-4 text-[#88BDF2]" />
                <span>Establish Investigation Case</span>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-[#1a2A2f] text-xs font-mono"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleCreateNewCase} className="space-y-4 font-mono text-xs">
              <div className="space-y-1.5">
                <label className="text-slate-700 font-semibold">Case Investigation Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Operation Wire Phantom BEC Campaign"
                  className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-300 text-[#1a2A2f] focus:outline-none focus:border-[#1a2A2f]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-700 font-semibold">Case Severity Level</label>
                <select
                  value={newSeverity}
                  onChange={(e) => setNewSeverity(e.target.value as any)}
                  className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-300 text-[#1a2A2f] focus:outline-none focus:border-[#1a2A2f]"
                >
                  <option value="critical">CRITICAL (Immediate containment)</option>
                  <option value="high">HIGH (P1 Incident)</option>
                  <option value="medium">MEDIUM (Standard triage)</option>
                  <option value="low">LOW (Informational)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-700 font-semibold">Description & Scope</label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Summarize target victims, threat vector, and initial findings..."
                  className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-300 text-[#1a2A2f] focus:outline-none focus:border-[#1a2A2f] font-sans"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#1a2A2f] text-white font-bold hover:bg-[#1a2A2f]/90"
                >
                  Create Case
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
