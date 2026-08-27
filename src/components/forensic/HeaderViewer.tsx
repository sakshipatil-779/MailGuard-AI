"use client";

import React, { useState } from "react";
import { EmailHeaders } from "@/types/analysis";
import { Search, Copy, Check, AlertTriangle, Terminal, Code2 } from "lucide-react";
import { toast } from "sonner";

interface HeaderViewerProps {
  headers: EmailHeaders;
}

export function HeaderViewer({ headers }: HeaderViewerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [copied, setCopied] = useState(false);

  const headerEntries = Object.entries(headers.allHeaders || {});

  const filtered = headerEntries.filter(([key, val]) =>
    searchTerm.trim() === ""
      ? true
      : key.toLowerCase().includes(searchTerm.toLowerCase()) ||
        val.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const copyRawHeaders = () => {
    const raw = headerEntries.map(([k, v]) => `${k}: ${v}`).join("\n");
    navigator.clipboard.writeText(raw);
    setCopied(true);
    toast.success("All raw email headers copied to clipboard.");
    setTimeout(() => setCopied(false), 2000);
  };

  const isAnomalousHeader = (key: string, val: string) => {
    const lKey = key.toLowerCase();
    const lVal = val.toLowerCase();
    if (lKey === "reply-to" && headers.fromAddress && !val.includes(headers.fromAddress.split("@")[1])) return true;
    if (lKey === "authentication-results" && (lVal.includes("fail") || lVal.includes("softfail"))) return true;
    if (lKey === "x-mailer" && (lVal.includes("phpmailer") || lVal.includes("python") || lVal.includes("curl"))) return true;
    if (lKey === "x-priority" && lVal.includes("1")) return true;
    return false;
  };

  return (
    <div className="space-y-4">
      {/* Identity Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-[#1a242f] border border-[#384959] text-xs">
          <div className="text-[10px] font-mono uppercase text-[#6A89A7]">Header From</div>
          <div className="font-mono font-bold text-[#BDDDFC] mt-1 truncate" title={headers.from}>
            {headers.from}
          </div>
          <div className="text-[10px] text-[#6A89A7] font-mono mt-0.5">Address: {headers.fromAddress}</div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#1a242f] border border-[#384959] text-xs">
          <div className="text-[10px] font-mono uppercase text-[#6A89A7]">Reply-To Directive</div>
          <div
            className={`font-mono font-bold mt-1 truncate ${
              headers.replyTo && !headers.replyTo.includes(headers.fromAddress.split("@")[1])
                ? "text-rose-400"
                : "text-slate-200"
            }`}
            title={headers.replyTo || "Same as From"}
          >
            {headers.replyTo || "Default (None specified)"}
          </div>
          {headers.replyTo && !headers.replyTo.includes(headers.fromAddress.split("@")[1]) && (
            <div className="text-[10px] text-rose-400 font-mono font-bold mt-0.5">
              ⚠️ Divergent Address (High Risk)
            </div>
          )}
        </div>

        <div className="p-3.5 rounded-xl bg-[#1a242f] border border-[#384959] text-xs">
          <div className="text-[10px] font-mono uppercase text-[#6A89A7]">Message-ID</div>
          <div className="font-mono text-slate-300 mt-1 truncate" title={headers.messageId}>
            {headers.messageId}
          </div>
          <div className="text-[10px] text-[#6A89A7] font-mono mt-0.5">RFC 5322 Identifier</div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#1a242f] border border-[#384959] text-xs">
          <div className="text-[10px] font-mono uppercase text-[#6A89A7]">Date Timestamp</div>
          <div className="font-mono text-slate-200 mt-1 truncate" title={headers.date}>
            {headers.date}
          </div>
          <div className="text-[10px] text-[#6A89A7] font-mono mt-0.5">Origin Transmission Time</div>
        </div>
      </div>

      {/* Full Headers Search & Table */}
      <div className="rounded-xl bg-[#1a242f] border border-[#384959] overflow-hidden">
        {/* Search & Actions Bar */}
        <div className="p-3 sm:p-4 bg-[#243240] border-b border-[#384959] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#6A89A7] absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search header fields (e.g. Received, SPF, DKIM)..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#1a242f] border border-[#384959] text-xs text-[#BDDDFC] placeholder-[#6A89A7] focus:outline-none focus:border-[#88BDF2]/50 font-mono"
            />
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2">
            <span className="text-xs font-mono text-[#6A89A7]">
              {filtered.length} / {headerEntries.length} headers
            </span>
            <button
              onClick={copyRawHeaders}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#243240] hover:bg-[#384959] text-xs font-mono text-[#BDDDFC] transition-colors border border-[#384959]"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#88BDF2]" />}
              <span>{copied ? "Copied" : "Copy Raw"}</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto max-h-96">
          <table className="w-full text-left text-xs font-mono min-w-[500px]">
            <thead className="bg-[#1a242f] text-[10px] text-[#6A89A7] uppercase tracking-wider sticky top-0 border-b border-[#384959]">
              <tr>
                <th className="py-2.5 px-4 w-48">Header Field</th>
                <th className="py-2.5 px-4">Value & Anomaly Detection</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#384959]/50">
              {filtered.map(([key, val], idx) => {
                const isAnomaly = isAnomalousHeader(key, val);

                return (
                  <tr
                    key={idx}
                    className={`hover:bg-[#384959]/30 transition-colors ${
                      isAnomaly ? "bg-rose-500/5" : ""
                    }`}
                  >
                    <td className="py-2.5 px-4 font-bold text-slate-300 align-top flex items-center gap-1.5">
                      {isAnomaly && <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                      <span className={isAnomaly ? "text-amber-300" : ""}>{key}</span>
                    </td>
                    <td className="py-2.5 px-4 text-slate-300 break-all leading-relaxed align-top">
                      <span className={isAnomaly ? "text-rose-300 font-semibold" : ""}>{val}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
