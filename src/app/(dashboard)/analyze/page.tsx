"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  SearchCode,
  UploadCloud,
  FileCode2,
  Cpu,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Info
} from "lucide-react";
import { EmailUploadDropzone } from "@/components/email-analysis/EmailUploadDropzone";
import { RawEmailEditor, SAMPLE_EMAILS } from "@/components/email-analysis/RawEmailEditor";
import { AnalysisProgress } from "@/components/email-analysis/AnalysisProgress";
import { parseEmlContent } from "@/lib/parser/eml-parser";
import { MockStorage } from "@/lib/storage/mock-store";
import { toast } from "sonner";

export default function AnalyzePage() {
  const router = useRouter();
  const [inputMode, setInputMode] = useState<"paste" | "upload">("paste");
  const [rawText, setRawText] = useState(SAMPLE_EMAILS.bec_wire.content);
  const [uploadedFilename, setUploadedFilename] = useState("URGENT_CONFIDENTIAL_Acquisition_Wire_Transfer.eml");
  const [priority, setPriority] = useState<"NORMAL" | "HIGH" | "CRITICAL">("CRITICAL");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzedEmailId, setAnalyzedEmailId] = useState<string | null>(null);

  const handleSelectSample = (sampleKey: string) => {
    const sample = SAMPLE_EMAILS[sampleKey];
    if (sample) {
      setRawText(sample.content);
      setUploadedFilename(`${sampleKey}.eml`);
    }
  };

  const handleFileLoaded = (content: string, filename: string) => {
    setRawText(content);
    setUploadedFilename(filename);
    toast.success(`Loaded file ${filename}`);
  };

  const handleStartAnalysis = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawText.trim()) {
      toast.error("Please paste an email or upload a .eml file first.");
      return;
    }

    // Parse email
    const parsed = parseEmlContent(rawText, uploadedFilename);
    MockStorage.saveEmail(parsed);
    setAnalyzedEmailId(parsed.id);
    setIsAnalyzing(true);
  };

  const handleAnalysisComplete = () => {
    if (analyzedEmailId) {
      toast.success("Forensic analysis complete. Opening investigation dossier.");
      router.push(`/emails/${analyzedEmailId}`);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-[#1a242f] border border-[#384959]">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <SearchCode className="w-5 h-5 text-[#88BDF2]" />
            <span>AI Email Threat & Forensic Analysis Workstation</span>
          </h2>
          <p className="text-xs text-[#6A89A7] font-mono mt-0.5">
            Ingest raw RFC-822 messages, decompile headers, verify cryptographic alignments, and resolve multi-hop relay infrastructure
          </p>
        </div>

        {/* Input Mode Selector */}
        <div className="flex items-center bg-[#243240] border border-[#384959] rounded-lg p-1 text-xs font-mono shrink-0">
          <button
            onClick={() => setInputMode("paste")}
            className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
              inputMode === "paste"
                ? "bg-[#88BDF2]/20 text-[#BDDDFC] font-bold border border-[#88BDF2]/30"
                : "text-[#6A89A7] hover:text-[#BDDDFC]"
            }`}
          >
            <FileCode2 className="w-3.5 h-3.5" />
            <span>Raw EML Editor</span>
          </button>

          <button
            onClick={() => setInputMode("upload")}
            className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
              inputMode === "upload"
                ? "bg-[#88BDF2]/20 text-[#BDDDFC] font-bold border border-[#88BDF2]/30"
                : "text-[#6A89A7] hover:text-[#BDDDFC]"
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Upload .EML File</span>
          </button>
        </div>
      </div>

      {/* Main Analysis Form or Animated Pipeline */}
      {isAnalyzing ? (
        <AnalysisProgress onComplete={handleAnalysisComplete} />
      ) : (
        <form onSubmit={handleStartAnalysis} className="space-y-6">
          {inputMode === "upload" ? (
            <div className="space-y-4">
              <EmailUploadDropzone onFileLoaded={handleFileLoaded} />
              {rawText && (
                <div className="p-4 rounded-xl bg-[#1a242f] border border-[#384959]">
                  <div className="text-[11px] font-mono text-[#6A89A7] uppercase tracking-wider mb-2">
                    Loaded File Preview ({uploadedFilename}):
                  </div>
                  <pre className="text-xs font-mono text-[#BDDDFC] bg-[#243240] p-3 rounded-lg border border-[#384959] max-h-40 overflow-y-auto leading-relaxed">
                    {rawText.substring(0, 1000)}...
                  </pre>
                </div>
              )}
            </div>
          ) : (
            <RawEmailEditor
              value={rawText}
              onChange={setRawText}
              onSelectSample={handleSelectSample}
            />
          )}

          {/* Analysis Configuration Bar */}
          <div className="p-4 rounded-xl bg-[#1a242f] border border-[#384959] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="text-[#6A89A7]">Scan Priority:</span>
                <div className="flex items-center bg-[#243240] border border-[#384959] rounded-lg p-0.5">
                  {(["NORMAL", "HIGH", "CRITICAL"] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${
                        priority === p
                          ? p === "CRITICAL"
                            ? "bg-rose-500 text-white"
                            : p === "HIGH"
                            ? "bg-amber-500 text-slate-950"
                            : "bg-[#88BDF2] text-[#1a242f]"
                          : "text-[#6A89A7] hover:text-[#BDDDFC]"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-[11px] text-[#6A89A7] hidden md:block">
                Enrichment: <span className="text-emerald-400 font-semibold">VirusTotal + GeoIP + AbuseIPDB</span>
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#88BDF2] via-[#6A89A7] to-[#BDDDFC] hover:opacity-95 text-[#1a242f] font-black text-xs font-mono shadow-glow transition-all flex items-center justify-center gap-2 shrink-0"
            >
              <Cpu className="w-4 h-4 text-[#1a242f]" />
              <span>Execute Deep Threat Analysis</span>
              <ArrowRight className="w-4 h-4 text-[#1a242f]" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
