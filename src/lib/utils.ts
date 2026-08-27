import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Severity, ThreatClassification } from "@/types/threat";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export function getSeverityBadge(severity: Severity) {
  switch (severity) {
    case "critical":
      return {
        bg: "bg-rose-500/15",
        text: "text-rose-400",
        border: "border-rose-500/30",
        glow: "shadow-glow-red",
        dot: "bg-rose-400",
        label: "CRITICAL"
      };
    case "high":
      return {
        bg: "bg-orange-500/15",
        text: "text-orange-400",
        border: "border-orange-500/30",
        glow: "shadow-glow-amber",
        dot: "bg-orange-400",
        label: "HIGH"
      };
    case "medium":
      return {
        bg: "bg-amber-500/15",
        text: "text-amber-400",
        border: "border-amber-500/30",
        glow: "shadow-glow-amber",
        dot: "bg-amber-400",
        label: "MEDIUM"
      };
    case "low":
    default:
      return {
        bg: "bg-emerald-500/15",
        text: "text-emerald-400",
        border: "border-emerald-500/30",
        glow: "shadow-glow-emerald",
        dot: "bg-emerald-400",
        label: "LOW"
      };
  }
}

export function getClassificationMeta(classification: ThreatClassification) {
  switch (classification) {
    case "business_email_compromise":
      return {
        label: "BEC / Executive Impersonation",
        color: "text-rose-400",
        bg: "bg-rose-500/10 border-rose-500/20",
        icon: "Briefcase"
      };
    case "phishing":
      return {
        label: "Credential Phishing",
        color: "text-rose-400",
        bg: "bg-rose-500/10 border-rose-500/20",
        icon: "ShieldAlert"
      };
    case "malware_delivery":
      return {
        label: "Malware / Ransomware Delivery",
        color: "text-purple-400",
        bg: "bg-purple-500/10 border-purple-500/20",
        icon: "Skull"
      };
    case "impersonation":
      return {
        label: "Brand Impersonation",
        color: "text-orange-400",
        bg: "bg-orange-500/10 border-orange-500/20",
        icon: "UserX"
      };
    case "financial_fraud":
      return {
        label: "Financial Invoice Fraud",
        color: "text-amber-400",
        bg: "bg-amber-500/10 border-amber-500/20",
        icon: "DollarSign"
      };
    case "spoofing":
      return {
        label: "Domain / Header Spoofing",
        color: "text-yellow-400",
        bg: "bg-yellow-500/10 border-yellow-500/20",
        icon: "Mask"
      };
    case "suspicious":
      return {
        label: "Suspicious Anomaly",
        color: "text-amber-400",
        bg: "bg-amber-500/10 border-amber-500/20",
        icon: "AlertTriangle"
      };
    case "legitimate":
      return {
        label: "Legitimate Message",
        color: "text-emerald-400",
        bg: "bg-emerald-500/10 border-emerald-500/20",
        icon: "CheckCircle2"
      };
    default:
      return {
        label: "Unclassified Threat",
        color: "text-slate-400",
        bg: "bg-slate-500/10 border-slate-500/20",
        icon: "HelpCircle"
      };
  }
}

export function maskEmail(email: string): string {
  if (!email || !email.includes("@")) return email;
  const [user, domain] = email.split("@");
  if (user.length <= 2) return `${user[0]}*@${domain}`;
  return `${user.substring(0, 2)}***${user.slice(-1)}@${domain}`;
}

export function maskIp(ip: string): string {
  if (!ip || !ip.includes(".")) return ip;
  const parts = ip.split(".");
  if (parts.length !== 4) return ip;
  return `${parts[0]}.${parts[1]}.${parts[2]}.xxx`;
}

export function generateId(prefix = "id"): string {
  return `${prefix}_${Math.random().toString(36).substring(2, 9)}_${Date.now().toString(36)}`;
}
