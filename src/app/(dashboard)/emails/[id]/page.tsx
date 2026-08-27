"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { MockStorage } from "@/lib/storage/mock-store";
import { EmailAnalysis } from "@/types/analysis";
import { ThreatScoreCard } from "@/components/forensic/ThreatScoreCard";
import { HeaderViewer } from "@/components/forensic/HeaderViewer";
import { AuthenticationStatus } from "@/components/forensic/AuthenticationStatus";
import { RelayPathGraph } from "@/components/forensic/RelayPathGraph";
import { GeoLocationMap } from "@/components/forensic/GeoLocationMap";
import { DomainIpIntelligence } from "@/components/forensic/DomainIpIntelligence";
import { IocTable } from "@/components/forensic/IocTable";
import { EvidenceChainOfCustody } from "@/components/forensic/EvidenceChainOfCustody";
import {
  FileText,
  KeyRound,
  Network,
  Globe,
  Server,
  ShieldAlert,
  Lock,
  Paperclip,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Eye,
  Code2
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { getSeverityBadge, formatBytes } from "@/lib/utils";

type TabKey = "overview" | "headers" | "auth" | "relay" | "geo" | "intel" | "iocs" | "evidence";

export default function EmailDetailPage() {
  const params = useParams();
  const router = useRouter();
  const emailId = params.id as string;
  const [email, setEmail] = useState<EmailAnalysis | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [bodyViewMode, setBodyViewMode] = useState<"html" | "text" | "raw">("html");

  useEffect(() => {
    const found = MockStorage.getEmailById(emailId);
    if (found) {
      setEmail(found);
    }
  }, [emailId]);

  if (!email) {
    return (
      <div className="p-12 text-center text-[#6A89A7] font-mono space-y-4">
        <ShieldAlert className="w-12 h-12 text-amber-400 mx-auto" />
        <div className="text-sm font-bold text-white">Email Analysis Dossier Not Found</div>
        <p className="text-xs text-[#6A89A7]">Analysis ID &quot;{emailId}&quot; could not be retrieved from vault storage.</p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#88BDF2] text-[#1a242f] font-bold text-xs"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const handleQuarantine = () => {
    email.status = "QUARANTINED";
    MockStorage.saveEmail(email);
    setEmail({ ...email });
    toast.success("Message successfully quarantined on mail server gateway.");
  };

  const handleCreateCase = () => {
    const caseId = `CASE-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    MockStorage.saveCase({
      id: caseId,
      caseNumber: caseId,
      title: `Investigation: ${email.headers.subject}`,
      description: email.executiveSummary,
      status: "OPEN",
      severity: email.severity,
      primaryClassification: email.classification,
      leadAnalyst: "Alex Mercer",
      assignedTeam: "SOC Tier 2",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      targetVictims: email.headers.to,
      mitreAttckIds: email.findings.map(f => f.mitreTechnique || "T1566").slice(0, 3),
      tags: ["Auto-Created", email.classification.toUpperCase(), email.severity.toUpperCase()],
      emailIds: [email.id],
      evidence: [
        {
          id: `EVD-${Date.now()}`,
          caseId: caseId,
          type: "RAW_EMAIL",
          name: email.filename || "threat_email.eml",
          description: "Raw RFC-822 message payload preserved from gateway.",
          sha256: email.sha256,
          collectedAt: email.createdAt,
          collectedBy: "Automated SOC Ingestion",
          integrityStatus: "VERIFIED",
          storageRef: `s3://forensic-vault-us-east/evidence/${email.id}.eml`,
          fileSizeBytes: email.rawSize
        }
      ],
      timeline: [
        {
          id: `tl-${Date.now()}`,
          timestamp: new Date().toISOString(),
          type: "CASE_CREATED",
          actor: "Alex Mercer",
          title: "Investigation Case Spawned",
          details: `Case created directly from Email Threat Analysis ID ${email.analysisId}.`
        }
      ],
      iocs: email.iocs,
      analystNotes: []
    });

    email.caseId = caseId;
    MockStorage.saveEmail(email);
    setEmail({ ...email });
    toast.success(`Case ${caseId} created and linked.`);
    router.push(`/investigations/${caseId}`);
  };

  const tabs = [
    { key: "overview", label: "Overview & Message Body", icon: FileText, count: null },
    { key: "headers", label: "Technical RFC Headers", icon: Code2, count: Object.keys(email.headers.allHeaders).length },
    { key: "auth", label: "Authentication (SPF/DKIM/DMARC)", icon: KeyRound, count: null },
    { key: "relay", label: "Relay Path Sequence", icon: Network, count: `${email.relayPath.length} Hops` },
    { key: "geo", label: "Origin Geolocation & Map", icon: Globe, count: email.origin.country },
    { key: "intel", label: "Domain & IP Intelligence", icon: Server, count: null },
    { key: "iocs", label: "Extracted IOCs", icon: ShieldAlert, count: email.iocs.length },
    { key: "evidence", label: "Chain of Custody", icon: Lock, count: "VERIFIED" }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Back Navigation & Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/emails"
          className="inline-flex items-center gap-2 text-xs font-mono text-[#6A89A7] hover:text-[#BDDDFC] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Analyzed Emails Repository</span>
        </Link>

        <div className="text-xs font-mono text-[#6A89A7]">
          Forensic Timestamp: <strong className="text-slate-200">{new Date(email.createdAt).toLocaleString()}</strong>
        </div>
      </div>

      {/* Hero Threat Score Card */}
      <ThreatScoreCard
        email={email}
        onQuarantine={handleQuarantine}
        onCreateCase={handleCreateCase}
      />

      {/* AI Threat Explanation Panel (Why is this email suspicious?) */}
      <div className="p-5 rounded-xl bg-[#1a242f] border border-[#384959] space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#384959]">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <h3 className="text-sm font-bold text-white font-mono">
              AI Threat Explanation & Contributing Risk Factors ({email.findings.length} Indicators)
            </h3>
          </div>
          <span className="text-[10px] font-mono text-[#88BDF2]">
            Explainable SHAP Model Contribution
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {email.findings.map((fnd) => {
            const sevBadge = getSeverityBadge(fnd.severity);

            return (
              <div
                key={fnd.id}
                className="p-3.5 rounded-xl bg-[#243240]/80 border border-[#384959] hover:border-[#88BDF2]/40 transition-all space-y-1.5 font-mono text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${sevBadge.bg} ${sevBadge.text} border ${sevBadge.border}`}>
                    {fnd.severity.toUpperCase()}
                  </span>
                  {fnd.mitreTechnique && (
                    <span className="text-[10px] text-[#BDDDFC] truncate max-w-[180px]">
                      {fnd.mitreTechnique}
                    </span>
                  )}
                </div>

                <div className="font-bold text-white text-xs">{fnd.title}</div>
                <div className="text-[11px] text-slate-300 font-sans leading-relaxed">
                  {fnd.explanation}
                </div>

                {fnd.evidenceRefs && fnd.evidenceRefs.length > 0 && (
                  <div className="text-[10px] text-[#6A89A7] pt-1 flex items-center gap-1">
                    <span>Evidence:</span>
                    <span className="text-[#BDDDFC] font-semibold">{fnd.evidenceRefs.join(", ")}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Forensic Workstation Tabs Bar */}
      <div className="border-b border-[#384959] overflow-x-auto">
        <div className="flex items-center gap-1 min-w-[750px]">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;

            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as TabKey)}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-mono font-medium border-b-2 transition-all shrink-0 ${
                  isActive
                    ? "border-[#88BDF2] text-[#BDDDFC] bg-[#88BDF2]/10 font-bold"
                    : "border-transparent text-[#6A89A7] hover:text-[#BDDDFC] hover:bg-[#384959]/20"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-[#88BDF2]" : "text-[#6A89A7]"}`} />
                <span>{tab.label}</span>
                {tab.count !== null && (
                  <span
                    className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                      isActive
                        ? "bg-[#88BDF2]/20 text-[#BDDDFC]"
                        : "bg-[#1a242f] text-[#6A89A7]"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Panels */}
      <div className="pt-2">
        {/* TAB 1: Overview & Message Body */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Sender / Identity Box */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-[#1a242f] border border-[#384959] text-xs font-mono">
                <span className="text-[10px] text-[#6A89A7] uppercase">From Sender</span>
                <div className="font-bold text-white mt-1 break-all">{email.headers.from}</div>
                <div className="text-[10px] text-[#BDDDFC] mt-0.5">{email.headers.fromAddress}</div>
              </div>

              <div className="p-4 rounded-xl bg-[#1a242f] border border-[#384959] text-xs font-mono">
                <span className="text-[10px] text-[#6A89A7] uppercase">Recipients (To)</span>
                <div className="font-bold text-white mt-1 break-all">{email.headers.to.join(", ")}</div>
                {email.headers.replyTo && (
                  <div className="text-[10px] text-amber-400 mt-0.5">Reply-To: {email.headers.replyTo}</div>
                )}
              </div>

              <div className="p-4 rounded-xl bg-[#1a242f] border border-[#384959] text-xs font-mono">
                <span className="text-[10px] text-[#6A89A7] uppercase">Originating Host & Node</span>
                <div className="font-bold text-[#BDDDFC] mt-1">{email.origin.ip}</div>
                <div className="text-[10px] text-[#6A89A7] mt-0.5">{email.origin.city}, {email.origin.country} ({email.origin.isp})</div>
              </div>
            </div>

            {/* Attachments Section if present */}
            {email.attachments && email.attachments.length > 0 && (
              <div className="p-5 rounded-xl bg-[#1a242f] border border-rose-500/30 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-rose-400 font-mono">
                  <Paperclip className="w-4 h-4" />
                  <span>Preserved Email Attachments & Malware Verdict ({email.attachments.length})</span>
                </div>

                <div className="space-y-2">
                  {email.attachments.map((att) => (
                    <div
                      key={att.id}
                      className="p-3.5 rounded-lg bg-[#243240] border border-[#384959] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono"
                    >
                      <div>
                        <div className="font-bold text-white flex items-center gap-2">
                          <span>{att.filename}</span>
                          <span className="text-[10px] text-[#6A89A7]">({formatBytes(att.filesize)})</span>
                        </div>
                        <div className="text-[11px] text-rose-300 mt-0.5 font-sans">{att.verdict}</div>
                        <div className="text-[10px] text-[#6A89A7] mt-1">SHA-256: {att.sha256}</div>
                      </div>

                      <div className="text-right">
                        <span className="px-2 py-1 rounded bg-rose-500/20 text-rose-400 font-bold text-xs border border-rose-500/30">
                          Threat Score: {att.threatScore}/100
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sanitized Message Body Sandbox */}
            <div className="rounded-xl bg-[#1a242f] border border-[#384959] overflow-hidden">
              <div className="p-3 bg-[#243240] border-b border-[#384959] flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-white font-mono">
                  <Eye className="w-4 h-4 text-[#88BDF2]" />
                  <span>Sanitized Email Body Sandbox (Scripts & Trackers Neutralized)</span>
                </div>

                <div className="flex items-center bg-[#1a242f] border border-[#384959] rounded-lg p-0.5 text-xs font-mono">
                  <button
                    onClick={() => setBodyViewMode("html")}
                    className={`px-2.5 py-1 rounded transition-all ${
                      bodyViewMode === "html"
                        ? "bg-[#88BDF2]/20 text-[#BDDDFC] font-bold"
                        : "text-[#6A89A7] hover:text-[#BDDDFC]"
                    }`}
                  >
                    Rendered View
                  </button>
                  <button
                    onClick={() => setBodyViewMode("text")}
                    className={`px-2.5 py-1 rounded transition-all ${
                      bodyViewMode === "text"
                        ? "bg-[#88BDF2]/20 text-[#BDDDFC] font-bold"
                        : "text-[#6A89A7] hover:text-[#BDDDFC]"
                    }`}
                  >
                    Plaintext
                  </button>
                </div>
              </div>

              <div className="p-6 bg-[#1a242f]">
                {bodyViewMode === "html" && email.bodyHtml ? (
                  <div
                    className="p-6 rounded-xl bg-white text-slate-900 overflow-auto max-h-[500px]"
                    dangerouslySetInnerHTML={{ __html: email.bodyHtml }}
                  />
                ) : (
                  <pre className="text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed">
                    {email.bodyText}
                  </pre>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Technical RFC Headers */}
        {activeTab === "headers" && <HeaderViewer headers={email.headers} />}

        {/* TAB 3: Authentication Status */}
        {activeTab === "auth" && <AuthenticationStatus auth={email.authentication} />}

        {/* TAB 4: Relay Path Graph */}
        {activeTab === "relay" && <RelayPathGraph relayPath={email.relayPath} />}

        {/* TAB 5: Origin Geolocation */}
        {activeTab === "geo" && <GeoLocationMap email={email} />}

        {/* TAB 6: Domain & IP Intelligence */}
        {activeTab === "intel" && (
          <DomainIpIntelligence
            domains={email.domainIntelligence}
            ips={email.ipIntelligence}
          />
        )}

        {/* TAB 7: IOC Extraction */}
        {activeTab === "iocs" && (
          <IocTable
            iocs={email.iocs}
            onAddToCase={(ioc) => {
              if (email.caseId) {
                MockStorage.addEvidenceToCase(email.caseId, {
                  caseId: email.caseId,
                  type: "IOC",
                  name: `${ioc.type.toUpperCase()}: ${ioc.value}`,
                  description: ioc.category,
                  sha256: email.sha256,
                  collectedAt: new Date().toISOString(),
                  collectedBy: "Alex Mercer",
                  integrityStatus: "VERIFIED",
                  storageRef: `ioc://${ioc.type}/${ioc.value}`
                });
                toast.success(`IOC added to Case ${email.caseId}`);
              } else {
                toast.error("Please create or link an investigation case first.");
              }
            }}
          />
        )}

        {/* TAB 8: Evidence Chain of Custody */}
        {activeTab === "evidence" && <EvidenceChainOfCustody email={email} />}
      </div>
    </div>
  );
}
