"use client";

import React, { useState } from "react";
import { IocItem } from "@/types/threat";
import { Copy, Check, ExternalLink, ShieldAlert, FolderPlus, Download, Filter } from "lucide-react";
import { toast } from "sonner";

interface IocTableProps {
  iocs: IocItem[];
  onAddToCase?: (ioc: IocItem) => void;
}

export function IocTable({ iocs, onAddToCase }: IocTableProps) {
  const [filterType, setFilterType] = useState<string>("ALL");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = iocs.filter((ioc) =>
    filterType === "ALL" ? true : ioc.type.toLowerCase() === filterType.toLowerCase()
  );

  const handleCopy = (ioc: IocItem) => {
    navigator.clipboard.writeText(ioc.value);
    setCopiedId(ioc.id);
    toast.success(`Copied IOC: ${ioc.value}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportCsv = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Type,Value,Category,RiskScore,Malicious,FirstSeen,ReputationSource"]
        .concat(
          iocs.map(
            (i) =>
              `${i.type},"${i.value}","${i.category}",${i.riskScore},${i.malicious},${i.firstSeen || ""},"${i.reputationSource || ""}"`
          )
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `IOC_Export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Exported IOCs to CSV");
  };

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="p-4 rounded-xl bg-[#1a242f] border border-[#384959] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-[#88BDF2]" />
          <span className="text-xs font-bold text-white font-mono">
            Extracted Indicators of Compromise ({iocs.length} Observables)
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Type Filter Buttons */}
          <div className="flex items-center bg-[#243240] border border-[#384959] rounded-lg p-1 text-[10px] font-mono">
            {["ALL", "IP", "DOMAIN", "URL", "HASH", "EMAIL"].map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-2 py-0.5 rounded transition-all ${
                  filterType === t
                    ? "bg-[#88BDF2]/20 text-[#BDDDFC] font-bold border border-[#88BDF2]/30"
                    : "text-[#6A89A7] hover:text-[#BDDDFC]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#243240] hover:bg-[#384959] text-xs font-mono text-[#BDDDFC] border border-[#384959] transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#88BDF2]" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* IOC Table */}
      <div className="rounded-xl bg-[#1a242f] border border-[#384959] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#243240] text-[10px] text-[#6A89A7] uppercase tracking-wider border-b border-[#384959]">
              <tr>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Observable Indicator Value</th>
                <th className="py-3 px-4">Classification Category</th>
                <th className="py-3 px-4">Threat Score</th>
                <th className="py-3 px-4">Reputation Source</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#384959]/50">
              {filtered.map((ioc) => (
                <tr key={ioc.id} className="hover:bg-[#384959]/30 transition-colors">
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#243240] text-[#BDDDFC] border border-[#384959]">
                      {ioc.type.toUpperCase()}
                    </span>
                  </td>

                  <td className="py-3 px-4 font-bold text-slate-200 break-all max-w-sm">
                    {ioc.value}
                  </td>

                  <td className="py-3 px-4 text-[#6A89A7] text-[11px]">
                    {ioc.category}
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        ioc.riskScore >= 75
                          ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                          : ioc.riskScore >= 50
                          ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                          : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      }`}
                    >
                      {ioc.riskScore}/100
                    </span>
                  </td>

                  <td className="py-3 px-4 text-[#6A89A7] text-[11px]">
                    {ioc.reputationSource || "SOC Heuristics Engine"}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleCopy(ioc)}
                        title="Copy Observable"
                        className="p-1.5 rounded bg-[#243240] hover:bg-[#384959] text-slate-300 hover:text-[#BDDDFC] transition-colors"
                      >
                        {copiedId === ioc.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#88BDF2]" />}
                      </button>

                      {onAddToCase && (
                        <button
                          onClick={() => onAddToCase(ioc)}
                          title="Add IOC to Case Locker"
                          className="p-1.5 rounded bg-[#6A89A7]/20 hover:bg-[#6A89A7]/30 text-[#BDDDFC] border border-[#6A89A7]/40 transition-colors"
                        >
                          <FolderPlus className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="py-10 text-center text-[#6A89A7] text-xs font-mono">
              No IOCs matching filter &quot;{filterType}&quot;.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
