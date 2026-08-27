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
      className={`p-8 rounded-xl border-2 border-dashed cursor-pointer transition-all text-center flex flex-col items-center justify-center ${
        isDragging
          ? "border-[#88BDF2] bg-[#88BDF2]/15 shadow-glow"
          : fileName
          ? "border-emerald-500/40 bg-emerald-500/5"
          : "border-[#384959] hover:border-[#88BDF2]/40 bg-[#1a242f]/70 hover:bg-[#243240]/80"
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

      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#88BDF2]/20 to-[#6A89A7]/20 border border-[#88BDF2]/30 flex items-center justify-center mb-4 shadow-glow">
        {fileName ? (
          <CheckCircle2 className="w-7 h-7 text-emerald-400" />
        ) : (
          <UploadCloud className="w-7 h-7 text-[#88BDF2] animate-bounce" />
        )}
      </div>

      {fileName ? (
        <div>
          <div className="text-sm font-bold text-white font-mono flex items-center justify-center gap-2">
            <FileText className="w-4 h-4 text-[#88BDF2]" />
            {fileName}
          </div>
          <div className="text-xs text-emerald-400 font-mono mt-1">
            File loaded ({fileSize ? formatBytes(fileSize) : ""}) • Ready for deep forensic ingestion
          </div>
          <p className="text-[11px] text-[#6A89A7] font-mono mt-2">
            Click or drag another file to replace
          </p>
        </div>
      ) : (
        <div>
          <div className="text-sm font-bold text-white">
            Drag & drop raw <span className="text-[#88BDF2] font-mono">.eml</span> or{" "}
            <span className="text-[#88BDF2] font-mono">.msg</span> file here
          </div>
          <p className="text-xs text-[#6A89A7] font-mono mt-1">
            Accepts RFC-822 formatted email files, raw MIME payloads & RFC-5322 exports
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#243240] border border-[#384959] text-xs font-mono text-[#BDDDFC] hover:bg-[#384959] transition-colors">
            <FileCode2 className="w-3.5 h-3.5 text-[#88BDF2]" />
            <span>Browse local disk</span>
          </div>
        </div>
      )}
    </div>
  );
}
