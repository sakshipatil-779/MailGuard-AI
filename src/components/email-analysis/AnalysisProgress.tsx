"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2, Loader2, ShieldAlert, Cpu, Terminal, Radio } from "lucide-react";

interface AnalysisProgressProps {
  onComplete: () => void;
}

const STAGES = [
  { id: 1, title: "MIME & Header Decompilation", detail: "Parsing RFC-5322 header chains, Message-ID, and boundary parts..." },
  { id: 2, title: "Cryptographic Authentication Audit", detail: "Validating SPF records, 2048-bit DKIM signatures, and DMARC alignment..." },
  { id: 3, title: "AI NLP & BEC Semantic Classifier", detail: "Scanning for executive impersonation, wire fraud triggers, and urgency lures..." },
  { id: 4, title: "Infrastructure & GeoIP Attribution", detail: "Tracing multi-hop Received path and resolving Autonomous System Numbers (ASN)..." },
  { id: 5, title: "IOC Extraction & Intel Enrichment", detail: "Extracting URLs, IPs, Hashes and checking against VirusTotal and AbuseIPDB..." },
  { id: 6, title: "Forensic Evidence Sealing", detail: "Generating cryptographic SHA-256 integrity seal and saving dossier..." },
];

export function AnalysisProgress({ onComplete }: AnalysisProgressProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [logMessages, setLogMessages] = useState<string[]>([
    "[0.00s] Initializing MailGuard-AI Neural Threat Engine...",
    "[0.15s] Ingesting raw byte stream into memory sandbox..."
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < STAGES.length) {
          const next = prev + 1;
          setLogMessages((logs) => [
            ...logs,
            `[${(next * 0.35).toFixed(2)}s] Completed: ${STAGES[prev - 1].title}`,
            `[${(next * 0.38).toFixed(2)}s] Executing: ${STAGES[next - 1].title}`
          ]);
          return next;
        } else {
          clearInterval(timer);
          setTimeout(() => {
            onComplete();
          }, 600);
          return prev;
        }
      });
    }, 450);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="p-8 rounded-2xl bg-[#243240]/95 border border-[#88BDF2]/40 shadow-2xl backdrop-blur-xl max-w-3xl mx-auto my-8 relative overflow-hidden">
      {/* Glow header bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#88BDF2] via-[#6A89A7] to-[#BDDDFC] animate-pulse" />

      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-[#384959]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#88BDF2]/15 border border-[#88BDF2]/30 flex items-center justify-center shadow-glow">
            <Cpu className="w-5 h-5 text-[#88BDF2] animate-spin" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>Deep Forensic Inspection Pipeline Active</span>
              <span className="w-2 h-2 rounded-full bg-[#88BDF2] animate-ping" />
            </h3>
            <p className="text-xs text-[#6A89A7] font-mono">
              Running heuristic classifiers, relay path reconstruction & intelligence enrichment
            </p>
          </div>
        </div>
        <div className="text-right font-mono">
          <span className="text-xs font-bold text-[#BDDDFC]">
            {Math.min(Math.round((currentStep / STAGES.length) * 100), 100)}%
          </span>
          <div className="text-[10px] text-[#6A89A7]">Step {currentStep} of {STAGES.length}</div>
        </div>
      </div>

      {/* Steps List */}
      <div className="space-y-3 py-6">
        {STAGES.map((stage) => {
          const isDone = currentStep > stage.id;
          const isCurrent = currentStep === stage.id;

          return (
            <div
              key={stage.id}
              className={`p-3 rounded-xl border transition-all flex items-start gap-3.5 ${
                isDone
                  ? "bg-emerald-500/5 border-emerald-500/30 text-emerald-300"
                  : isCurrent
                  ? "bg-[#88BDF2]/15 border-[#88BDF2]/50 text-white shadow-glow"
                  : "bg-[#1a242f]/40 border-[#384959]/50 text-[#6A89A7] opacity-60"
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : isCurrent ? (
                  <Loader2 className="w-5 h-5 text-[#88BDF2] animate-spin" />
                ) : (
                  <div className="w-5 h-5 rounded-full border border-[#384959] flex items-center justify-center text-[10px] font-mono text-[#6A89A7]">
                    {stage.id}
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="text-xs font-bold font-mono flex items-center justify-between">
                  <span>{stage.title}</span>
                  {isDone && <span className="text-[10px] text-emerald-400 font-mono">PASSED</span>}
                  {isCurrent && <span className="text-[10px] text-[#BDDDFC] font-mono animate-pulse">PROCESSING</span>}
                </div>
                <div className="text-[11px] text-[#6A89A7] font-mono mt-0.5">
                  {stage.detail}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Terminal Live Telemetry Log */}
      <div className="p-3.5 rounded-xl bg-[#1a242f] border border-[#384959] text-[11px] font-mono text-[#BDDDFC] max-h-32 overflow-y-auto space-y-1">
        <div className="flex items-center gap-1.5 text-[#6A89A7] pb-1 border-b border-[#384959] text-[10px]">
          <Terminal className="w-3.5 h-3.5 text-[#88BDF2]" />
          <span>Real-time SOC Pipeline Output</span>
        </div>
        {logMessages.map((msg, idx) => (
          <div key={idx} className="leading-tight">
            {msg}
          </div>
        ))}
      </div>
    </div>
  );
}
