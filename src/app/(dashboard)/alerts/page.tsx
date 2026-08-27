"use client";

import React, { useState, useEffect } from "react";
import { MockStorage } from "@/lib/storage/mock-store";
import { ThreatAlert } from "@/lib/data/mock-alerts";
import { AlertDrawer } from "@/components/alerts/AlertDrawer";
import {
  BellRing,
  Filter,
  Search,
  Radio,
  CheckCircle2,
  FolderPlus,
  ArrowUpRight,
  ShieldAlert,
  Globe,
  Inbox
} from "lucide-react";
import { getSeverityBadge, maskEmail, maskIp } from "@/lib/utils";
import { useSecurity } from "@/context/SecurityContext";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function AlertsPage() {
  const router = useRouter();
  const { maskPii, maskIps, refreshAlerts } = useSecurity();
  const [alerts, setAlerts] = useState<ThreatAlert[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<ThreatAlert | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [sevFilter, setSevFilter] = useState<string>("ALL");

  useEffect(() => {
    setAlerts(MockStorage.getAlerts());
  }, []);

  const handleAcknowledge = (id: string) => {
    MockStorage.updateAlertStatus(id, "ACKNOWLEDGED");
    setAlerts(MockStorage.getAlerts());
    refreshAlerts();
    toast.success(`Alert ${id} marked as Acknowledged`);
  };

  const handleEscalateCase = (alert: ThreatAlert) => {
    const caseId = `CASE-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    MockStorage.saveCase({
      id: caseId,
      caseNumber: caseId,
      title: `Escalated Alert: ${alert.subject}`,
      description: `Incident case spawned from Threat Alert ${alert.id} (${alert.ruleName}).`,
      status: "OPEN",
      severity: alert.severity,
      primaryClassification: alert.threatType,
      leadAnalyst: "Security Analyst",
      assignedTeam: "Tier 2 SOC",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      targetVictims: [alert.recipient],
      mitreAttckIds: ["T1566"],
      tags: ["Alert-Escalation", alert.threatType.toUpperCase()],
      emailIds: [alert.emailId],
      evidence: [],
      timeline: [
        {
          id: `tl-${Date.now()}`,
          timestamp: new Date().toISOString(),
          type: "CASE_CREATED",
          actor: "Security Analyst",
          title: "Alert Escalated to Formal Case",
          details: `Threat alert ${alert.id} escalated to case ${caseId}.`
        }
      ],
      iocs: [],
      analystNotes: []
    });

    MockStorage.updateAlertStatus(alert.id, "INVESTIGATING");
    setAlerts(MockStorage.getAlerts());
    refreshAlerts();
    toast.success(`Escalated to Case ${caseId}`);
    router.push(`/investigations/${caseId}`);
  };

  const filtered = alerts.filter((a) => {
    if (statusFilter !== "ALL" && a.status !== statusFilter) return false;
    if (sevFilter !== "ALL" && a.severity !== sevFilter.toLowerCase()) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <BellRing className="w-5 h-5 text-rose-600 shrink-0" />
            <h2 className="text-sm sm:text-base font-bold text-[#1a2A2f]">Real-Time Threat Alert Center</h2>
            <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-rose-50 text-rose-600 font-bold border border-rose-200">
              <Radio className="w-3 h-3 animate-pulse" />
              LIVE TELEMETRY
            </span>
          </div>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Automated AI detections & priority triage queue ({alerts.length} total alerts)
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-slate-600 shrink-0">
          <span>Unresolved:</span>
          <strong className="text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
            {alerts.filter((a) => a.status === "NEW").length}
          </strong>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-3 sm:p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        {/* Severity Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className="text-slate-500">Severity:</span>
          <div className="flex flex-wrap items-center bg-slate-100 border border-slate-200 rounded-lg p-0.5">
            {["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"].map((s) => (
              <button
                key={s}
                onClick={() => setSevFilter(s)}
                className={`px-2 sm:px-2.5 py-1 rounded text-[10px] font-bold transition-all ${
                  sevFilter === s
                    ? "bg-[#1a2A2f] text-white shadow-sm"
                    : "text-[#1a2A2f] hover:text-black"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className="text-slate-500">Status:</span>
          <div className="flex flex-wrap items-center bg-slate-100 border border-slate-200 rounded-lg p-0.5">
            {["ALL", "NEW", "ACKNOWLEDGED", "INVESTIGATING", "RESOLVED"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2 sm:px-2.5 py-1 rounded text-[10px] font-bold transition-all ${
                  statusFilter === st
                    ? "bg-[#1a2A2f] text-white shadow-sm"
                    : "text-[#1a2A2f] hover:text-black"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts Table or Empty State */}
      {filtered.length > 0 ? (
        <div className="rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono min-w-[700px]">
              <thead className="bg-[#1a2A2f] text-[10px] text-white uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Alert ID & Severity</th>
                  <th className="py-3 px-4">Subject & Sender</th>
                  <th className="py-3 px-4">Origin IP & Country</th>
                  <th className="py-3 px-4">Trigger Rule</th>
                  <th className="py-3 px-4">Detected</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Triage Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((alert) => {
                  const sevBadge = getSeverityBadge(alert.severity);
                  const displaySender = maskPii ? maskEmail(alert.sender) : alert.sender;
                  const displayIp = maskIps ? maskIp(alert.sourceIp) : alert.sourceIp;

                  return (
                    <tr
                      key={alert.id}
                      className="hover:bg-slate-50 transition-colors cursor-pointer"
                      onClick={() => setSelectedAlert(alert)}
                    >
                      <td className="py-3 px-4">
                        <div className="flex flex-col gap-1">
                          <span className="font-bold text-[#1a2A2f] text-xs">{alert.id}</span>
                          <span className={`px-2 py-0.2 rounded text-[10px] font-bold w-fit ${sevBadge.bg} ${sevBadge.text} border ${sevBadge.border}`}>
                            {sevBadge.label} ({alert.riskScore})
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-4 max-w-xs font-sans">
                        <div className="font-semibold text-[#1a2A2f] truncate">{alert.subject}</div>
                        <div className="text-[11px] text-slate-500 font-mono truncate mt-0.5">
                          From: {displaySender}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 text-[#1a2A2f]">
                          <Globe className="w-3.5 h-3.5 text-[#88BDF2]" />
                          <span>{displayIp}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{alert.sourceCountry}</div>
                      </td>

                      <td className="py-3 px-4 text-slate-600 text-[11px]">
                        {alert.ruleName}
                      </td>

                      <td className="py-3 px-4 text-slate-500 text-[10px]">
                        {new Date(alert.detectedAt).toLocaleTimeString()}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            alert.status === "NEW"
                              ? "bg-rose-50 text-rose-600 border border-rose-200"
                              : alert.status === "INVESTIGATING"
                              ? "bg-[#88BDF2]/20 text-[#1a2A2f] border border-[#88BDF2]"
                              : "bg-slate-100 text-slate-600 border border-slate-200"
                          }`}
                        >
                          {alert.status}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedAlert(alert)}
                            className="px-2.5 py-1 rounded bg-[#1a2A2f] hover:bg-[#1a2A2f]/90 text-white text-[11px] font-bold shadow-sm"
                          >
                            Triage
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="p-12 rounded-2xl bg-white border border-slate-200 shadow-sm text-center max-w-lg mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#88BDF2]/20 border border-[#88BDF2]/40 flex items-center justify-center mx-auto text-[#1a2A2f]">
            <Inbox className="w-7 h-7 text-[#1a2A2f]" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#1a2A2f]">No Alerts Triggered</h3>
            <p className="text-xs text-slate-500 font-mono mt-1">
              When ingested emails score &ge; 50/100, real-time threat alerts are automatically generated here.
            </p>
          </div>
        </div>
      )}

      {/* Alert Drawer Slideover */}
      <AlertDrawer
        alert={selectedAlert}
        onClose={() => setSelectedAlert(null)}
        onAcknowledge={handleAcknowledge}
        onEscalateCase={handleEscalateCase}
      />
    </div>
  );
}
