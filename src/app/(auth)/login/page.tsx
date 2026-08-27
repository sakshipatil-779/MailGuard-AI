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
import { useSecurity } from "@/context/SecurityContext";
import { UserRole } from "@/types/threat";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const { setUserRole, signInWithGoogle } = useSecurity();
  const [email, setEmail] = useState("alex.mercer@acmeworks.com");
  const [password, setPassword] = useState("••••••••••••");
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    const ok = await signInWithGoogle();
    setIsGoogleLoading(false);
    if (ok) {
      router.push("/dashboard");
    }
  };

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

      <div className="w-full max-w-md bg-[#243240]/90 border border-[#384959] rounded-2xl shadow-2xl p-5 sm:p-8 backdrop-blur-xl relative z-10 space-y-5 sm:space-y-6">
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

        {/* Primary Google Login Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading}
          className="w-full py-3 rounded-xl bg-white hover:bg-slate-100 text-[#1a242f] font-bold text-xs font-mono shadow-md transition-all flex items-center justify-center gap-2.5 border border-slate-200"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>{isGoogleLoading ? "Connecting to Google..." : "Continue with Google Account"}</span>
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="h-px bg-[#384959] flex-1" />
          <span className="text-[10px] font-mono text-[#6A89A7] uppercase tracking-wider">Or Standard Credentials</span>
          <div className="h-px bg-[#384959] flex-1" />
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
    </div>
  );
}

