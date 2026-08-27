"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { MockStorage } from "@/lib/storage/mock-store";
import { ForensicReport } from "@/types/report";
import { ReportPreview } from "@/components/reports/ReportPreview";
import { ArrowLeft, FileSpreadsheet } from "lucide-react";
import Link from "next/link";

export default function ReportDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [report, setReport] = useState<ForensicReport | null>(null);

  useEffect(() => {
    // Try finding by report id or email id
    let found = MockStorage.getReportById(id);
    if (!found) {
      // Check if this id is an email id and generate/get
      const email = MockStorage.getEmailById(id);
      if (email) {
        found = MockStorage.generateReportFromEmail(email);
      }
    }
    if (found) {
      setReport(found);
    }
  }, [id]);

  if (!report) {
    return (
      <div className="p-12 text-center text-[#6A89A7] font-mono space-y-4">
        <FileSpreadsheet className="w-12 h-12 text-[#88BDF2] mx-auto" />
        <div className="text-sm font-bold text-white">Forensic Report Not Found</div>
        <Link
          href="/reports"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#88BDF2] text-[#1a242f] font-bold text-xs"
        >
          Return to Reports
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="print:hidden">
        <Link
          href="/reports"
          className="inline-flex items-center gap-2 text-xs font-mono text-[#6A89A7] hover:text-[#BDDDFC] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Reports</span>
        </Link>
      </div>

      <ReportPreview report={report} />
    </div>
  );
}
