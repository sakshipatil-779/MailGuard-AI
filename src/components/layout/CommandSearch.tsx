"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Mail,
  FolderGit2,
  ShieldAlert,
  FileText,
  X,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { useSecurity } from "@/context/SecurityContext";
import { MockStorage } from "@/lib/storage/mock-store";
import { EmailAnalysis } from "@/types/analysis";
import { InvestigationCase } from "@/types/investigation";

export function CommandSearch() {
  const router = useRouter();
  const { isSearchOpen, setIsSearchOpen } = useSecurity();
  const [query, setQuery] = useState("");
  const [emails, setEmails] = useState<EmailAnalysis[]>([]);
  const [cases, setCases] = useState<InvestigationCase[]>([]);

  useEffect(() => {
    if (isSearchOpen) {
      setEmails(MockStorage.getEmails());
      setCases(MockStorage.getCases());
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const filteredEmails = emails.filter((e) =>
    query.trim() === ""
      ? true
      : e.headers.subject.toLowerCase().includes(query.toLowerCase()) ||
        e.headers.fromAddress.toLowerCase().includes(query.toLowerCase()) ||
        e.origin.ip.includes(query) ||
        e.iocs.some((ioc) => ioc.value.toLowerCase().includes(query.toLowerCase()))
  ).slice(0, 5);

  const filteredCases = cases.filter((c) =>
    query.trim() === ""
      ? true
      : c.title.toLowerCase().includes(query.toLowerCase()) ||
        c.caseNumber.toLowerCase().includes(query.toLowerCase()) ||
        c.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
  ).slice(0, 3);

  const handleSelect = (url: string) => {
    setIsSearchOpen(false);
    setQuery("");
    router.push(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/75 backdrop-blur-md animate-in fade-in duration-150 p-4">
      <div
        className="w-full max-w-2xl bg-[#1a2A2f] border border-[#88BDF2]/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Input (#1a2A2f) */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 gap-3 bg-[#131d22]">
          <Search className="w-5 h-5 text-[#88BDF2]" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search email subjects, sender addresses, IOCs, IP addresses, cases..."
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none font-mono"
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="px-2 py-0.5 text-xs font-mono bg-[#88BDF2] text-[#1a2A2f] font-bold rounded"
          >
            ESC
          </button>
        </div>

        {/* Results Body */}
        <div className="p-3 max-h-[60vh] overflow-y-auto space-y-4 bg-[#1a2A2f]">
          {/* Quick Actions */}
          {query.trim() === "" && (
            <div>
              <div className="px-2 pb-1.5 text-[10px] font-mono uppercase text-[#88BDF2] tracking-wider font-bold">
                Quick Shortcuts
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleSelect("/analyze")}
                  className="flex items-center gap-2.5 p-2.5 rounded-lg bg-[#131d22] border border-[#88BDF2]/20 hover:border-[#88BDF2] text-left text-xs text-white transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-[#88BDF2]" />
                  <div>
                    <div className="font-semibold text-white">New Email Threat Analysis</div>
                    <div className="text-[10px] text-[#88BDF2]">Upload or paste .eml payload</div>
                  </div>
                </button>
                <button
                  onClick={() => handleSelect("/investigations")}
                  className="flex items-center gap-2.5 p-2.5 rounded-lg bg-[#131d22] border border-[#88BDF2]/20 hover:border-[#88BDF2] text-left text-xs text-white transition-colors"
                >
                  <FolderGit2 className="w-4 h-4 text-[#88BDF2]" />
                  <div>
                    <div className="font-semibold text-white">Investigation Cases</div>
                    <div className="text-[10px] text-[#88BDF2]">View active forensic cases</div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Email Matches */}
          {filteredEmails.length > 0 && (
            <div>
              <div className="px-2 pb-1.5 text-[10px] font-mono uppercase text-[#88BDF2] tracking-wider flex items-center justify-between">
                <span>Analyzed Threat Messages</span>
                <span className="text-[#88BDF2]">{filteredEmails.length} found</span>
              </div>
              <div className="space-y-1">
                {filteredEmails.map((email) => (
                  <button
                    key={email.id}
                    onClick={() => handleSelect(`/emails/${email.id}`)}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg bg-[#131d22] hover:bg-[#88BDF2]/20 border border-slate-800 text-left transition-all group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-7 h-7 rounded bg-rose-500/20 border border-rose-500/40 flex items-center justify-center shrink-0">
                        <Mail className="w-3.5 h-3.5 text-rose-300" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-white truncate">
                          {email.headers.subject}
                        </div>
                        <div className="text-[11px] text-[#88BDF2] font-mono truncate">
                          {email.headers.fromAddress} • Score: {email.riskScore}/100
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#88BDF2] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Investigation Case Matches */}
          {filteredCases.length > 0 && (
            <div>
              <div className="px-2 pb-1.5 text-[10px] font-mono uppercase text-[#88BDF2] tracking-wider">
                Active Cases
              </div>
              <div className="space-y-1">
                {filteredCases.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleSelect(`/investigations/${c.id}`)}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg bg-[#131d22] hover:bg-[#88BDF2]/20 border border-slate-800 text-left transition-all group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-7 h-7 rounded bg-[#88BDF2]/20 border border-[#88BDF2]/40 flex items-center justify-center shrink-0">
                        <FolderGit2 className="w-3.5 h-3.5 text-[#88BDF2]" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-white truncate">
                          {c.caseNumber}: {c.title}
                        </div>
                        <div className="text-[11px] text-[#88BDF2] font-mono truncate">
                          Status: {c.status} • Lead: {c.leadAnalyst}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#88BDF2] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredEmails.length === 0 && filteredCases.length === 0 && query.trim() !== "" && (
            <div className="py-8 text-center text-slate-400 text-xs">
              No matching threats, IPs, or cases found for &quot;{query}&quot;.
            </div>
          )}
        </div>

        {/* Footer (#1a2A2f) */}
        <div className="px-4 py-2 bg-[#131d22] border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <div className="flex items-center gap-2">
            <span>Navigation:</span>
            <kbd className="px-1 bg-[#1a2A2f] text-[#88BDF2] rounded border border-slate-700">↑</kbd>
            <kbd className="px-1 bg-[#1a2A2f] text-[#88BDF2] rounded border border-slate-700">↓</kbd>
            <kbd className="px-1 bg-[#1a2A2f] text-[#88BDF2] rounded border border-slate-700">Enter</kbd>
          </div>
          <span className="text-[#88BDF2]">Sentinel Threat Graph v2.4</span>
        </div>
      </div>
    </div>
  );
}
