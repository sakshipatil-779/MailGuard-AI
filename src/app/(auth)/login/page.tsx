"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldAlert,
  Lock,
  Mail,
  Fingerprint,
  ArrowRight,
  ShieldCheck,
  Zap,
  UserCheck
} from "lucide-react";
import { useSecurity, SecurityProvider } from "@/context/SecurityContext";
import { UserRole } from "@/types/threat";
import { toast, Toaster } from "sonner";

function LoginContent() {
  const router = useRouter();
  const { setUserRole } = useSecurity();
  const [email, setEmail] = useState("alex.mercer@acmeworks.com");
  const [password, setPassword] = useState("••••••••••••");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setUserRole("SECURITY_ANALYST");
    toast.success("Authenticated as Security Analyst (Tier 2)");
    router.push("/dashboard");
  };

  const handleQuickRole = (role: UserRole, roleName: string) => {
    setUserRole(role);
    toast.success(`Authenticated with ${roleName} credentials`);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#1a242f] bg-cyber-grid flex items-center justify-center p-4 relative overflow-hidden">
      {/* Glow Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#88BDF2]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#6A89A7]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-[#243240]/90 border border-[#384959] rounded-2xl shadow-2xl p-8 backdrop-blur-xl relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#88BDF2] to-[#384959] flex items-center justify-center mx-auto shadow-glow">
            <ShieldAlert className="w-6 h-6 text-[#1a242f] stroke-[2.5]" />
          </div>
          <div className="flex items-center justify-center gap-1.5 pt-2">
            <span className="text-xl font-black tracking-wider text-white">MailGuard</span>
            <span className="px-2 py-0.5 rounded bg-[#88BDF2] text-[#1a2A2f] font-mono text-xs font-bold">
              AI
            </span>
          </div>
          <p className="text-xs text-[#6A89A7] font-mono">
            Email Threat Intelligence & Forensic Investigation Portal
          </p>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono text-[#BDDDFC] uppercase tracking-wider">
              Analyst Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#6A89A7] absolute left-3 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#1a242f] border border-[#384959] text-xs text-[#BDDDFC] placeholder-[#6A89A7] focus:outline-none focus:border-[#88BDF2]/60 font-mono"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-mono text-[#BDDDFC] uppercase tracking-wider">
              Security Token / Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#6A89A7] absolute left-3 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#1a242f] border border-[#384959] text-xs text-[#BDDDFC] placeholder-[#6A89A7] focus:outline-none focus:border-[#88BDF2]/60 font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#88BDF2] to-[#6A89A7] hover:from-[#BDDDFC] hover:to-[#88BDF2] text-[#1a242f] font-bold text-xs font-mono shadow-glow transition-all flex items-center justify-center gap-2"
          >
            <span>Authenticate SOC Session</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* 1-Click Demo Roles Section */}
        <div className="pt-4 border-t border-[#384959] space-y-2.5">
          <div className="text-[10px] font-mono text-[#6A89A7] uppercase tracking-wider text-center">
            Or Instant 1-Click Access by Role:
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickRole("SECURITY_ANALYST", "Security Analyst")}
              className="p-2 rounded-lg bg-[#1a242f] hover:bg-[#384959] border border-[#384959] hover:border-[#88BDF2]/40 text-left text-[11px] font-mono text-[#BDDDFC] transition-colors"
            >
              <div className="font-bold">Security Analyst</div>
              <div className="text-[9px] text-[#6A89A7]">Full Triage & Forensics</div>
            </button>

            <button
              onClick={() => handleQuickRole("INVESTIGATOR", "Lead Investigator")}
              className="p-2 rounded-lg bg-[#1a242f] hover:bg-[#384959] border border-[#384959] hover:border-[#88BDF2]/40 text-left text-[11px] font-mono text-[#BDDDFC] transition-colors"
            >
              <div className="font-bold">Lead Investigator</div>
              <div className="text-[9px] text-[#6A89A7]">Cases & Campaign Graph</div>
            </button>

            <button
              onClick={() => handleQuickRole("ADMIN", "SOC Admin / CISO")}
              className="p-2 rounded-lg bg-[#1a242f] hover:bg-[#384959] border border-[#384959] hover:border-[#88BDF2]/40 text-left text-[11px] font-mono text-[#BDDDFC] transition-colors"
            >
              <div className="font-bold">SOC Admin / CISO</div>
              <div className="text-[9px] text-[#6A89A7]">Global System Admin</div>
            </button>

            <button
              onClick={() => handleQuickRole("AUDITOR", "Compliance Auditor")}
              className="p-2 rounded-lg bg-[#1a242f] hover:bg-[#384959] border border-[#384959] hover:border-[#88BDF2]/40 text-left text-[11px] font-mono text-[#BDDDFC] transition-colors"
            >
              <div className="font-bold">Compliance Auditor</div>
              <div className="text-[9px] text-[#6A89A7]">Chain of Custody</div>
            </button>
          </div>
        </div>
      </div>
      <Toaster theme="dark" position="top-right" richColors />
    </div>
  );
}

export default function LoginPage() {
  return (
    <SecurityProvider>
      <LoginContent />
    </SecurityProvider>
  );
}
