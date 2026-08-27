"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, FileCode2, CheckCircle2, AlertCircle, FileText } from "lucide-react";
import { formatBytes } from "@/lib/utils";

interface EmailUploadDropzoneProps {
  onFileLoaded: (content: string, filename: string) => void;
}

export function EmailUploadDropzone({ onFileLoaded }: EmailUploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file) return;
    setFileName(file.name);
    setFileSize(file.size);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text) {
        onFileLoaded(text, file.name);
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      className={`p-6 sm:p-10 rounded-2xl border-2 border-dashed cursor-pointer transition-all text-center flex flex-col items-center justify-center ${
        isDragging
          ? "border-[#88BDF2] bg-[#88BDF2]/15 shadow-md scale-[1.01]"
          : fileName
          ? "border-emerald-500 bg-emerald-50/50 shadow-sm"
          : "border-slate-300 hover:border-[#88BDF2] bg-white hover:bg-slate-50/80 shadow-sm"
      }`}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleFile(e.target.files[0]);
          }
        }}
        accept=".eml,.msg,.txt"
        className="hidden"
      />

      <div className="w-16 h-16 rounded-2xl bg-[#88BDF2]/20 border border-[#88BDF2]/40 flex items-center justify-center mb-4">
        {fileName ? (
          <CheckCircle2 className="w-8 h-8 text-emerald-600" />
        ) : (
          <UploadCloud className="w-8 h-8 text-[#1a2A2f] animate-bounce" />
        )}
      </div>

      {fileName ? (
        <div>
          <div className="text-sm font-bold text-[#1a2A2f] font-mono flex items-center justify-center gap-2">
            <FileText className="w-4 h-4 text-[#88BDF2]" />
            <span>{fileName}</span>
          </div>
          <div className="text-xs text-emerald-600 font-mono mt-1 font-semibold">
            File loaded ({fileSize ? formatBytes(fileSize) : ""}) • Ready for real-time Hugging Face AI scoring
          </div>
          <p className="text-[11px] text-slate-400 font-mono mt-2">
            Click or drag another file to replace
          </p>
        </div>
      ) : (
        <div>
          <div className="text-sm font-bold text-[#1a2A2f]">
            Drag & drop raw <span className="text-[#1a2A2f] bg-[#88BDF2]/30 px-1.5 py-0.5 rounded font-mono">.eml</span> or{" "}
            <span className="text-[#1a2A2f] bg-[#88BDF2]/30 px-1.5 py-0.5 rounded font-mono">.msg</span> file here
          </div>
          <p className="text-xs text-slate-500 font-mono mt-1.5 max-w-md">
            Accepts RFC-822 formatted messages, Outlook .MSG payloads, MIME headers, and text exports
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1a2A2f] text-xs font-mono text-white hover:bg-[#1a2A2f]/90 transition-colors shadow-sm">
            <FileCode2 className="w-4 h-4 text-white" />
            <span>Browse Local File (.eml / .msg)</span>
          </div>
        </div>
      )}
    </div>
  );
}
