"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { useSecurity } from "@/context/SecurityContext";
import { ShieldAlert, Lock, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, authLoading } = useSecurity();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast.error("Authentication required. Please sign in to access the SOC Operations Dashboard.", {
        id: "auth-required-toast"
      });
      router.replace("/");
    }
  }, [isAuthenticated, authLoading, router]);

  // Loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#1a2A2f] text-white flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-sm p-6 rounded-2xl bg-[#131d22] border border-[#88BDF2]/30 shadow-2xl text-center space-y-4 font-mono">
          <div className="w-12 h-12 rounded-2xl bg-[#88BDF2] flex items-center justify-center mx-auto shadow-lg animate-pulse">
            <ShieldAlert className="w-6 h-6 text-[#1a2A2f] stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wider">EMAILGUARD AI</h2>
            <p className="text-[11px] text-[#88BDF2] mt-1">Verifying SOC Analyst Clearance...</p>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
            <Loader2 className="w-4 h-4 text-[#88BDF2] animate-spin" />
            <span>Establishing Secure Session</span>
          </div>
        </div>
      </div>
    );
  }

  // If not authenticated, do not render dashboard content while redirecting
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#1a2A2f] text-white flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-sm p-6 rounded-2xl bg-[#131d22] border border-rose-500/40 shadow-2xl text-center space-y-4 font-mono">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500 flex items-center justify-center mx-auto shadow-lg text-rose-400">
            <Lock className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wider">ACCESS RESTRICTED</h2>
            <p className="text-[11px] text-rose-300 mt-1">Authentication required for SOC operations.</p>
          </div>
          <p className="text-xs text-slate-400">Redirecting to home page...</p>
        </div>
      </div>
    );
  }

  return <AppShell>{children}</AppShell>;
}

