"use client";

import React, { useState, useEffect } from "react";
import { MockStorage } from "@/lib/storage/mock-store";
import { ForensicReport } from "@/types/report";
import { EmailAnalysis } from "@/types/analysis";
import {
  FileSpreadsheet,
  PlusCircle,
  Printer,
  Download,
  ShieldAlert,
  ArrowRight,
  Lock,
  FileCheck
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { getSeverityBadge } from "@/lib/utils";

export default function ReportsPage() {
  const [reports, setReports] = useState<ForensicReport[]>([]);
  const [emails, setEmails] = useState<EmailAnalysis[]>([]);
  const [selectedEmailId, setSelectedEmailId] = useState<string>("");

  useEffect(() => {
    const storedReports = MockStorage.getReports();
    const storedEmails = MockStorage.getEmails();
    setEmails(storedEmails);

    if (storedReports.length === 0 && storedEmails.length > 0) {
      // Generate default reports from seed emails
      const r1 = MockStorage.generateReportFromEmail(storedEmails[0]);
      if (storedEmails[1]) MockStorage.generateReportFromEmail(storedEmails[1]);
      setReports(MockStorage.getReports());
    } else {
      setReports(storedReports);
    }
  }, []);

  const handleGenerateReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmailId) return;

    const email = MockStorage.getEmailById(selectedEmailId);
    if (email) {
      const report = MockStorage.generateReportFromEmail(email);
      setReports(MockStorage.getReports());
      toast.success(`Generated Forensic Report ${report.reportNumber}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-[#1a242f] border border-[#384959]">
        <div>
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-[#88BDF2]" />
            <h2 className="text-base font-bold text-white">Forensic Investigation Reports</h2>
          </div>
          <p className="text-xs text-[#6A89A7] font-mono mt-0.5">
            Executive threat briefs, cryptographic chain of custody certificates, and export-ready artifacts
          </p>
        </div>

        {/* Generate Report Form */}
        <form onSubmit={handleGenerateReport} className="flex items-center gap-2 font-mono text-xs">
          <select
            value={selectedEmailId}
            onChange={(e) => setSelectedEmailId(e.target.value)}
            className="p-2 rounded-lg bg-[#243240] border border-[#384959] text-[#BDDDFC] focus:outline-none focus:border-[#88BDF2]/50 max-w-xs truncate"
          >
            <option value="">Select analyzed email to generate report...</option>
            {emails.map((eml) => (
              <option key={eml.id} value={eml.id}>
                {eml.headers.subject.substring(0, 45)}... ({eml.classification})
              </option>
            ))}
          </select>

          <button
            type="submit"
            disabled={!selectedEmailId}
            className="px-3.5 py-2 rounded-lg bg-[#88BDF2] hover:bg-[#BDDDFC] disabled:opacity-50 text-[#1a242f] font-bold transition-all shadow-glow shrink-0"
          >
            Generate
          </button>
        </form>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {reports.map((report) => {
          const sevBadge = getSeverityBadge(report.severity);

          return (
            <Link
              key={report.id}
              href={`/reports/${report.id}`}
              className="p-5 rounded-xl bg-[#243240]/85 border border-[#384959] hover:border-[#88BDF2]/50 transition-all duration-200 flex flex-col justify-between space-y-4 group backdrop-blur-md"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#88BDF2]">
                    {report.reportNumber}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${sevBadge.bg} ${sevBadge.text} border ${sevBadge.border}`}
                  >
                    RISK {report.riskScore}/100
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white group-hover:text-[#BDDDFC] transition-colors line-clamp-2">
                  {report.title}
                </h3>

                <p className="text-xs text-slate-300 line-clamp-3 font-sans leading-relaxed">
                  {report.executiveSummary}
                </p>

                {/* Evidence Metrics */}
                <div className="p-2.5 rounded-lg bg-[#1a242f] border border-[#384959] text-[10px] font-mono text-[#6A89A7] space-y-1">
                  <div className="flex justify-between">
                    <span>SPF / DKIM / DMARC:</span>
                    <span className="text-[#BDDDFC]">
                      {report.evidenceSummary.spfStatus}/{report.evidenceSummary.dkimStatus}/{report.evidenceSummary.dmarcStatus}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Extracted IOCs:</span>
                    <span className="text-white font-bold">{report.evidenceSummary.totalIocs} observables</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Origin IP:</span>
                    <span className="text-slate-300">{report.evidenceSummary.originIp}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-[#384959] flex items-center justify-between text-[11px] font-mono text-[#6A89A7]">
                <span>{new Date(report.generatedAt).toLocaleDateString()}</span>

                <div className="flex items-center gap-1 text-[#88BDF2] group-hover:translate-x-0.5 transition-transform">
                  <span>View / Print PDF</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
