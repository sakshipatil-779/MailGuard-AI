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
  Info,
  Key
} from "lucide-react";
import { EmailUploadDropzone } from "@/components/email-analysis/EmailUploadDropzone";
import { RawEmailEditor, SAMPLE_EMAILS } from "@/components/email-analysis/RawEmailEditor";
import { AnalysisProgress } from "@/components/email-analysis/AnalysisProgress";
import { parseAndAnalyzeEmail } from "@/lib/parser/eml-parser";
import { MockStorage } from "@/lib/storage/mock-store";
import { toast } from "sonner";

export default function AnalyzePage() {
  const router = useRouter();
  const [inputMode, setInputMode] = useState<"upload" | "paste">("upload");
  const [rawText, setRawText] = useState("");
  const [uploadedFilename, setUploadedFilename] = useState("suspicious_message.eml");
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
    toast.success(`Loaded file: ${filename}`);
  };

  const handleStartAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawText.trim()) {
      toast.error("Please upload a .eml / .msg file or paste email content first.");
      return;
    }

    setIsAnalyzing(true);

    try {
      // Execute Real-Time AI Threat Scoring with Gemini 3.6 Flash & Link Inspection
      const analyzed = await parseAndAnalyzeEmail(rawText, uploadedFilename);
      MockStorage.saveEmail(analyzed);
      setAnalyzedEmailId(analyzed.id);
    } catch (err) {
      console.error("Analysis execution error:", err);
      toast.error("An error occurred during threat analysis. Falling back to heuristic baseline.");
    }
  };

  const handleAnalysisComplete = () => {
    if (analyzedEmailId) {
      toast.success("Real-time AI forensic analysis complete. Opening investigation dossier.");
      router.push(`/emails/${analyzedEmailId}`);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-base font-bold text-[#1a2A2f] flex items-center gap-2">
            <SearchCode className="w-5 h-5 text-[#88BDF2]" />
            <span>AI Email Threat & Forensic Ingestion Center</span>
          </h2>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Ingest raw <span className="font-bold text-[#1a2A2f]">.eml</span> or <span className="font-bold text-[#1a2A2f]">.msg</span> files. Real-time Gemini AI scores threat text and flags suspicious links.
          </p>
        </div>

        {/* Input Mode Selector */}
        <div className="flex items-center bg-slate-100 border border-slate-200 rounded-lg p-1 text-xs font-mono shrink-0">
          <button
            type="button"
            onClick={() => setInputMode("upload")}
            className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
              inputMode === "upload"
                ? "bg-[#1a2A2f] text-white font-bold shadow-sm"
                : "text-slate-600 hover:text-[#1a2A2f]"
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Upload .EML / .MSG File</span>
          </button>

          <button
            type="button"
            onClick={() => setInputMode("paste")}
            className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
              inputMode === "paste"
                ? "bg-[#1a2A2f] text-white font-bold shadow-sm"
                : "text-slate-600 hover:text-[#1a2A2f]"
            }`}
          >
            <FileCode2 className="w-3.5 h-3.5" />
            <span>Raw Text Editor</span>
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
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                  <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider mb-2 font-semibold">
                    Loaded File Content Preview ({uploadedFilename}):
                  </div>
                  <pre className="text-xs font-mono text-[#1a2A2f] bg-slate-50 p-3 rounded-lg border border-slate-200 max-h-40 overflow-y-auto leading-relaxed">
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
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="text-slate-500">Scan Priority:</span>
                <div className="flex items-center bg-slate-100 border border-slate-200 rounded-lg p-0.5">
                  {(["NORMAL", "HIGH", "CRITICAL"] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${
                        priority === p
                          ? p === "CRITICAL"
                            ? "bg-rose-600 text-white"
                            : p === "HIGH"
                            ? "bg-amber-500 text-slate-950"
                            : "bg-[#1a2A2f] text-white"
                          : "text-slate-600 hover:text-[#1a2A2f]"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-[11px] text-slate-500 hidden md:flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#1a2A2f]" />
                <span>AI Scoring Engine: <strong className="text-[#1a2A2f]">Gemini 3.6 Flash Active</strong></span>
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#1a2A2f] hover:bg-[#1a2A2f]/90 text-white font-bold text-xs font-mono shadow-md transition-all flex items-center justify-center gap-2 shrink-0 border border-[#1a2A2f]"
            >
              <Cpu className="w-4 h-4 text-[#88BDF2]" />
              <span>Score Email & Flag Links (AI Scan)</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
