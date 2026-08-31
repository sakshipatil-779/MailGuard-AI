"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldAlert,
  Lock,
  Mail,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Zap,
  UserCheck
} from "lucide-react";
import { useSecurity } from "@/context/SecurityContext";
import { UserRole } from "@/types/threat";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, authLoading, loginWithCredentials, loginWithRole, signInWithGoogle } = useSecurity();
  const [email, setEmail] = useState("alex.mercer@acmeworks.com");
  const [password, setPassword] = useState("••••••••••••");
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, authLoading, router]);

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    const ok = await signInWithGoogle();
    setIsGoogleLoading(false);
    if (ok) {
      router.push("/dashboard");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    const ok = await loginWithCredentials(email, "SECURITY_ANALYST");
    setIsLoggingIn(false);
    if (ok) {
      router.push("/dashboard");
    }
  };

  const handleQuickRole = async (role: UserRole, roleName: string) => {
    setIsLoggingIn(true);
    const ok = await loginWithRole(role, roleName);
    setIsLoggingIn(false);
    if (ok) {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-6 sm:p-8 relative z-10 space-y-5 sm:space-y-6">
        {/* Navigation back to Main Page */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-500 hover:text-[#1a2A2f] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Home</span>
          </Link>
          <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
            SOC PORTAL
          </span>
        </div>

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#88BDF2] to-[#1a2A2f] flex items-center justify-center mx-auto shadow-md">
            <ShieldAlert className="w-6 h-6 text-white stroke-[2.5]" />
          </div>
          <div className="flex items-center justify-center gap-1.5 pt-2">
            <span className="text-xl font-black tracking-wider text-[#1a2A2f]">EmailGuard</span>
            <span className="px-2 py-0.5 rounded bg-[#88BDF2] text-[#1a2A2f] font-mono text-xs font-bold">
              AI
            </span>
          </div>
          <p className="text-xs text-slate-500 font-mono">
            Email Threat Intelligence &amp; Forensic Investigation Portal
          </p>
        </div>

        {/* Primary Google Login Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading || isLoggingIn}
          className="w-full py-3 rounded-xl bg-white hover:bg-slate-50 text-[#1a2A2f] font-bold text-xs font-mono shadow-sm transition-all flex items-center justify-center gap-2.5 border border-slate-300 disabled:opacity-50"
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
          <div className="h-px bg-slate-200 flex-1" />
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold">Or Standard Credentials</span>
          <div className="h-px bg-slate-200 flex-1" />
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono text-slate-600 uppercase tracking-wider font-bold">
              Analyst Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-[#1a2A2f] placeholder-slate-400 focus:outline-none focus:border-[#1a2A2f] font-mono"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-mono text-slate-600 uppercase tracking-wider font-bold">
              Security Token / Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-[#1a2A2f] placeholder-slate-400 focus:outline-none focus:border-[#1a2A2f] font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoggingIn || isGoogleLoading}
            className="w-full py-2.5 rounded-xl bg-[#1a2A2f] hover:bg-[#1a2A2f]/90 text-white font-bold text-xs font-mono shadow-md transition-all flex items-center justify-center gap-2 border border-[#1a2A2f] disabled:opacity-50"
          >
            <span>{isLoggingIn ? "Authenticating..." : "Authenticate SOC Session"}</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        </form>

        {/* 1-Click Demo Roles Section */}
        <div className="pt-4 border-t border-slate-200 space-y-2.5">
          <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider text-center font-bold">
            Or Instant 1-Click Access by Role:
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickRole("SECURITY_ANALYST", "Security Analyst")}
              disabled={isLoggingIn}
              className="p-2 rounded-lg bg-slate-50 hover:bg-[#88BDF2]/20 border border-slate-200 hover:border-[#88BDF2] text-left text-[11px] font-mono text-[#1a2A2f] transition-colors"
            >
              <div className="font-bold">Security Analyst</div>
              <div className="text-[9px] text-slate-500">Full Triage &amp; Forensics</div>
            </button>

            <button
              onClick={() => handleQuickRole("INVESTIGATOR", "Lead Investigator")}
              disabled={isLoggingIn}
              className="p-2 rounded-lg bg-slate-50 hover:bg-[#88BDF2]/20 border border-slate-200 hover:border-[#88BDF2] text-left text-[11px] font-mono text-[#1a2A2f] transition-colors"
            >
              <div className="font-bold">Lead Investigator</div>
              <div className="text-[9px] text-slate-500">Cases &amp; Campaign Graph</div>
            </button>

            <button
              onClick={() => handleQuickRole("ADMIN", "SOC Admin / CISO")}
              disabled={isLoggingIn}
              className="p-2 rounded-lg bg-slate-50 hover:bg-[#88BDF2]/20 border border-slate-200 hover:border-[#88BDF2] text-left text-[11px] font-mono text-[#1a2A2f] transition-colors"
            >
              <div className="font-bold">SOC Admin / CISO</div>
              <div className="text-[9px] text-slate-500">Global System Admin</div>
            </button>

            <button
              onClick={() => handleQuickRole("AUDITOR", "Compliance Auditor")}
              disabled={isLoggingIn}
              className="p-2 rounded-lg bg-slate-50 hover:bg-[#88BDF2]/20 border border-slate-200 hover:border-[#88BDF2] text-left text-[11px] font-mono text-[#1a2A2f] transition-colors"
            >
              <div className="font-bold">Compliance Auditor</div>
              <div className="text-[9px] text-slate-500">Chain of Custody</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

