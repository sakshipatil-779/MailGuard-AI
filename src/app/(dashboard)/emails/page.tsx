"use client";

import React, { useState, useEffect } from "react";
import { MockStorage } from "@/lib/storage/mock-store";
import { EmailAnalysis } from "@/types/analysis";
import { RecentThreatsTable } from "@/components/dashboard/RecentThreatsTable";
import { Mail, SearchCode, PlusCircle } from "lucide-react";
import Link from "next/link";

export default function EmailsPage() {
  const [emails, setEmails] = useState<EmailAnalysis[]>([]);

  useEffect(() => {
    setEmails(MockStorage.getEmails());
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-[#1a242f] border border-[#384959]">
        <div>
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-[#88BDF2]" />
            <h2 className="text-base font-bold text-white">Analyzed Email Threat Repository</h2>
          </div>
          <p className="text-xs text-[#6A89A7] font-mono mt-0.5">
            Archived message analyses, heuristic threat classifications, and cryptographic forensics
          </p>
        </div>

        <Link
          href="/analyze"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#88BDF2] hover:bg-[#BDDDFC] text-[#1a242f] font-bold text-xs font-mono transition-all shadow-glow"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Analyze New Email</span>
        </Link>
      </div>

      {/* Main Table */}
      <RecentThreatsTable emails={emails} />
    </div>
  );
}
