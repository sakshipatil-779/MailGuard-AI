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
  Tag
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
      leadAnalyst: "Alex Mercer",
      assignedTeam: "Tier 2 Incident Response",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      targetVictims: ["corp-users@acmeworks.com"],
      mitreAttckIds: ["T1566"],
      tags: ["Manual-Case", newSeverity.toUpperCase()],
      emailIds: [],
      evidence: [],
      timeline: [
        {
          id: `tl-${Date.now()}`,
          timestamp: new Date().toISOString(),
          type: "CASE_CREATED",
          actor: "Alex Mercer",
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-[#1a242f] border border-[#384959]">
        <div>
          <div className="flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-[#88BDF2]" />
            <h2 className="text-base font-bold text-white">Incident Response & Case Management</h2>
          </div>
          <p className="text-xs text-[#6A89A7] font-mono mt-0.5">
            Active forensic investigations, evidence locker preservation, campaign correlation & remediation
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#88BDF2] hover:bg-[#BDDDFC] text-[#1a242f] font-bold text-xs font-mono transition-all shadow-glow"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Investigation Case</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-xl bg-[#1a242f] border border-[#384959] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-[#6A89A7] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search cases by title, analyst, tags..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#243240] border border-[#384959] text-xs text-[#BDDDFC] placeholder-[#6A89A7] focus:outline-none focus:border-[#88BDF2]/50 font-mono"
          />
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap items-center bg-[#243240] border border-[#384959] rounded-lg p-1 text-[11px] font-mono">
          {["ALL", "OPEN", "IN_PROGRESS", "CONTAINED", "RESOLVED"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1 rounded transition-all ${
                statusFilter === status
                  ? "bg-[#88BDF2]/20 text-[#BDDDFC] font-bold border border-[#88BDF2]/30"
                  : "text-[#6A89A7] hover:text-[#BDDDFC]"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Cases Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((caseItem) => {
          const sevBadge = getSeverityBadge(caseItem.severity);

          return (
            <Link
              key={caseItem.id}
              href={`/investigations/${caseItem.id}`}
              className="p-5 rounded-xl bg-[#243240]/85 border border-[#384959] hover:border-[#88BDF2]/50 transition-all duration-200 flex flex-col justify-between space-y-4 group backdrop-blur-md"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#88BDF2]">
                    {caseItem.caseNumber}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${sevBadge.bg} ${sevBadge.text} border ${sevBadge.border}`}
                  >
                    {sevBadge.label}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white group-hover:text-[#BDDDFC] transition-colors line-clamp-2">
                  {caseItem.title}
                </h3>

                <p className="text-xs text-slate-300 line-clamp-2 font-sans leading-relaxed">
                  {caseItem.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {caseItem.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded bg-[#1a242f] text-[10px] font-mono text-[#BDDDFC] border border-[#384959]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-[#384959] flex items-center justify-between text-[11px] font-mono text-[#6A89A7]">
                <div className="flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-[#6A89A7]" />
                  <span>{caseItem.leadAnalyst}</span>
                </div>

                <div className="flex items-center gap-1 text-[#88BDF2] group-hover:translate-x-0.5 transition-transform">
                  <span>Open Dossier</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Create Case Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-[#243240] border border-[#384959] rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#384959]">
              <div className="text-sm font-bold text-white font-mono flex items-center gap-2">
                <FolderGit2 className="w-4 h-4 text-[#88BDF2]" />
                <span>Establish Investigation Case</span>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#6A89A7] hover:text-[#BDDDFC] text-xs font-mono"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleCreateNewCase} className="space-y-4 font-mono text-xs">
              <div className="space-y-1.5">
                <label className="text-slate-300">Case Investigation Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Operation Wire Phantom BEC Campaign"
                  className="w-full p-2.5 rounded-lg bg-[#1a242f] border border-[#384959] text-white focus:outline-none focus:border-[#88BDF2]/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300">Case Severity Level</label>
                <select
                  value={newSeverity}
                  onChange={(e) => setNewSeverity(e.target.value as any)}
                  className="w-full p-2.5 rounded-lg bg-[#1a242f] border border-[#384959] text-white focus:outline-none focus:border-[#88BDF2]/50"
                >
                  <option value="critical">CRITICAL (Immediate containment)</option>
                  <option value="high">HIGH (P1 Incident)</option>
                  <option value="medium">MEDIUM (Standard triage)</option>
                  <option value="low">LOW (Informational)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300">Description & Scope</label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Summarize target victims, threat vector, and initial findings..."
                  className="w-full p-2.5 rounded-lg bg-[#1a242f] border border-[#384959] text-white focus:outline-none focus:border-[#88BDF2]/50 font-sans"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-[#1a242f] text-slate-300 hover:bg-[#384959]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#88BDF2] hover:bg-[#BDDDFC] text-[#1a242f] font-bold"
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
