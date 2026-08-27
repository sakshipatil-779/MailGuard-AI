"use client";

import React, { useState, useEffect } from "react";
import { MockStorage } from "@/lib/storage/mock-store";
import { EmailAnalysis } from "@/types/analysis";
import { RecentThreatsTable } from "@/components/dashboard/RecentThreatsTable";
import { Mail, SearchCode, PlusCircle, Inbox, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function EmailsPage() {
  const [emails, setEmails] = useState<EmailAnalysis[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    setEmails(MockStorage.getEmails());
    setIsLoaded(true);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-[#88BDF2]" />
            <h2 className="text-base font-bold text-[#1a2A2f]">Analyzed Email Threat Repository</h2>
          </div>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Archived message analyses, AI threat scoring, flagged suspicious links, and cryptographic forensics ({emails.length} total)
          </p>
        </div>

        <Link
          href="/analyze"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1a2A2f] hover:bg-[#1a2A2f]/90 text-white font-bold text-xs font-mono transition-all shadow-sm border border-[#1a2A2f]"
        >
          <PlusCircle className="w-4 h-4 text-white" />
          <span>Analyze New Email (.eml / .msg)</span>
        </Link>
      </div>

      {/* Main Table or Empty State */}
      {emails.length === 0 && isLoaded ? (
        <div className="p-12 rounded-2xl bg-white border border-slate-200 shadow-sm text-center max-w-lg mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#88BDF2]/20 border border-[#88BDF2]/40 flex items-center justify-center mx-auto text-[#1a2A2f]">
            <Inbox className="w-7 h-7 text-[#1a2A2f]" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#1a2A2f]">No Emails Ingested Yet</h3>
            <p className="text-xs text-slate-500 font-mono mt-1">
              Upload a .eml or .msg file to trigger real-time AI scoring and link flagging.
            </p>
          </div>
          <Link
            href="/analyze"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1a2A2f] text-white font-bold text-xs font-mono shadow-sm hover:bg-[#1a2A2f]/90"
          >
            <span>Analyze First Email</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <RecentThreatsTable emails={emails} />
      )}
    </div>
  );
}
