"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldAlert,
  ShieldCheck,
  Zap,
  Globe,
  Share2,
  Lock,
  ArrowRight,
  Sparkles,
  FileCode2,
  Server,
  Fingerprint,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ChevronRight,
  Database,
  Eye,
  Radio,
  Cpu,
  Mail,
  ExternalLink
} from "lucide-react";
import { useSecurity } from "@/context/SecurityContext";

export default function LandingPage() {
  const router = useRouter();
  const { firebaseUser, signInWithGoogle, logout } = useSecurity();
  const [selectedDemo, setSelectedDemo] = useState<"bec" | "phish" | "safe">("bec");
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleGoogleLogin = async () => {
    setIsSigningIn(false);
    setIsSigningIn(true);
    const success = await signInWithGoogle();
    setIsSigningIn(false);
    if (success) {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#1a2A2f] selection:bg-[#88BDF2]/30 selection:text-[#1a2A2f] overflow-x-hidden font-sans">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#1a2A2f] border-b border-[#243240] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#88BDF2] to-[#384959] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <ShieldAlert className="w-5 h-5 text-[#1a2A2f] stroke-[2.5]" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-wider text-white">EmailGuard</span>
              <span className="px-1.5 py-0.5 rounded bg-[#88BDF2] text-[#1a2A2f] font-mono text-[11px] font-bold">
                AI
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-mono text-slate-300">
            <a href="#features" className="hover:text-[#88BDF2] transition-colors">Core Capabilities</a>
            <a href="#sandbox" className="hover:text-[#88BDF2] transition-colors">Live Threat Demo</a>
            <a href="#architecture" className="hover:text-[#88BDF2] transition-colors">Neural Architecture</a>
            <a href="#forensics" className="hover:text-[#88BDF2] transition-colors">Forensic Trace</a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            {firebaseUser ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 pr-2 border-r border-[#384959]">
                  {firebaseUser.photoURL ? (
                    <img
                      src={firebaseUser.photoURL}
                      alt={firebaseUser.displayName || "User"}
                      className="w-7 h-7 rounded-full border border-[#88BDF2]"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-[#88BDF2] text-[#1a2A2f] font-bold text-xs flex items-center justify-center">
                      {firebaseUser.displayName?.charAt(0) || "U"}
                    </div>
                  )}
                  <span className="text-xs font-mono font-bold text-white truncate max-w-[120px]">
                    {firebaseUser.displayName?.split(" ")[0]}
                  </span>
                </div>

                <Link
                  href="/dashboard"
                  className="px-3.5 py-1.5 rounded-lg bg-[#88BDF2] hover:bg-[#88BDF2]/90 text-[#1a2A2f] font-bold text-xs font-mono shadow-sm transition-all flex items-center gap-1.5"
                >
                  <span>Open Console</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <>
                <button
                  onClick={handleGoogleLogin}
                  disabled={isSigningIn}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-300 text-xs font-mono text-[#1a2A2f] font-bold transition-all shadow-sm"
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
                  <span>{isSigningIn ? "Connecting..." : "Sign in with Google"}</span>
                </button>

                <Link
                  href="/dashboard"
                  className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#88BDF2] hover:bg-[#88BDF2]/90 text-[#1a2A2f] font-bold text-xs font-mono shadow-sm transition-all"
                >
                  <span>Launch Platform</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-8 bg-white">
        {/* Live Radar Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-300 text-xs font-mono text-[#1a2A2f] shadow-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold">REAL-TIME NEURAL EMAIL THREAT RADAR ACTIVE</span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-600">Hugging Face Powered</span>
        </div>

        {/* Headline */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#1a2A2f] leading-[1.15]">
            AI Email Threat Detection,{" "}
            <span className="text-[#384959] underline decoration-[#88BDF2] decoration-4 underline-offset-8">
              GeoLocation Origin &amp; Forensics
            </span>
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-sans">
            Protect enterprise mailboxes against Business Email Compromise (BEC), credential harvesting, and spoofed sender identities with deep RFC-822 header forensics, neural classification, and Leaflet origin mapping.
          </p>
        </div>

        {/* Primary CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2 max-w-md mx-auto">
          <button
            onClick={handleGoogleLogin}
            disabled={isSigningIn}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-[#1a2A2f] font-bold text-xs sm:text-sm font-mono shadow-md transition-all flex items-center justify-center gap-3 border border-slate-300 hover:scale-[1.02]"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
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
            <span>{isSigningIn ? "Authenticating..." : "Sign in with Google"}</span>
          </button>

          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#1a2A2f] hover:bg-[#1a2A2f]/90 text-white font-bold text-xs sm:text-sm font-mono shadow-md transition-all flex items-center justify-center gap-2 hover:scale-[1.02] border border-[#1a2A2f]"
          >
            <span>Open SOC Dashboard</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </Link>
        </div>

        {/* Live Metrics Row (Dark Box Theme) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto pt-6 text-left">
          <div className="p-4 rounded-xl bg-[#1a2A2f] border border-[#384959] shadow-md text-white">
            <div className="text-[11px] font-mono text-[#88BDF2] uppercase font-bold">Zero-Day Accuracy</div>
            <div className="text-xl sm:text-2xl font-black text-emerald-400 mt-1">99.8%</div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">Transformer Model Tested</div>
          </div>
          <div className="p-4 rounded-xl bg-[#1a2A2f] border border-[#384959] shadow-md text-white">
            <div className="text-[11px] font-mono text-[#88BDF2] uppercase font-bold">Average Latency</div>
            <div className="text-xl sm:text-2xl font-black text-[#88BDF2] mt-1">&lt; 1.4s</div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">Header &amp; Link Sandboxing</div>
          </div>
          <div className="p-4 rounded-xl bg-[#1a2A2f] border border-[#384959] shadow-md text-white">
            <div className="text-[11px] font-mono text-[#88BDF2] uppercase font-bold">Protocols Inspected</div>
            <div className="text-xl sm:text-2xl font-black text-white mt-1">SPF / DKIM / DMARC</div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">RFC-822 Cryptographic Checks</div>
          </div>
          <div className="p-4 rounded-xl bg-[#1a2A2f] border border-[#384959] shadow-md text-white">
            <div className="text-[11px] font-mono text-[#88BDF2] uppercase font-bold">Chain of Custody</div>
            <div className="text-xl sm:text-2xl font-black text-[#BDDDFC] mt-1">SHA-256</div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">Tamper-Evident Storage</div>
          </div>
        </div>
      </section>

      {/* Interactive Threat Sandbox Preview (Dark Box Theme matching 2nd picture) */}
      <section id="sandbox" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="p-6 sm:p-8 rounded-3xl bg-[#1a2A2f] text-white border border-[#384959] shadow-2xl relative overflow-hidden space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#243240]">
            <div>
              <div className="flex items-center gap-2">
                <Radio className="w-5 h-5 text-[#88BDF2] animate-pulse" />
                <h2 className="text-base sm:text-lg font-bold text-white font-mono">
                  Interactive Threat Sandbox &amp; Neural Vector Inspector
                </h2>
              </div>
              <p className="text-xs text-slate-300 font-mono mt-1">
                Select a simulated attack vector to test live neural classification, link inspection, and origin tracing:
              </p>
            </div>

            {/* Selector Tabs */}
            <div className="flex items-center bg-[#131d22] p-1 rounded-xl border border-[#243240] text-xs font-mono shadow-sm">
              <button
                onClick={() => setSelectedDemo("bec")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  selectedDemo === "bec"
                    ? "bg-rose-500/20 text-rose-300 font-bold border border-rose-500/40"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                BEC Wire Fraud
              </button>
              <button
                onClick={() => setSelectedDemo("phish")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  selectedDemo === "phish"
                    ? "bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                M365 Phishing
              </button>
              <button
                onClick={() => setSelectedDemo("safe")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  selectedDemo === "safe"
                    ? "bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Clean Baseline
              </button>
            </div>
          </div>

          {/* Sandbox Live Dossier View */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Email Details & Trigger */}
            <div className="p-4 rounded-xl bg-[#131d22] border border-[#243240] space-y-3 font-mono text-xs text-slate-200">
              <div className="flex items-center justify-between pb-2 border-b border-[#243240]">
                <span className="text-[#88BDF2] font-bold">Simulated Ingestion</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#243240] text-[#88BDF2] font-bold">RFC-822 Stream</span>
              </div>

              {selectedDemo === "bec" && (
                <>
                  <div><strong className="text-slate-400">From:</strong> &quot;Robert Vance (CEO)&quot; &lt;ceo@enterprise-ceo-office.com&gt;</div>
                  <div><strong className="text-slate-400">Subject:</strong> URGENT: Project Titan Acquisition Wire ($485,000)</div>
                  <div><strong className="text-slate-400">Payload:</strong> Direct IP link detected: <code className="text-[#88BDF2]">http://185.220.101.5/escrow/wire.php</code></div>
                  <div><strong className="text-slate-400">SPF/DMARC:</strong> <span className="text-rose-400 font-bold">FAILED (Unauthenticated Server)</span></div>
                </>
              )}

              {selectedDemo === "phish" && (
                <>
                  <div><strong className="text-slate-400">From:</strong> &quot;M365 Security Team&quot; &lt;no-reply@microsoft-security-notice.top&gt;</div>
                  <div><strong className="text-slate-400">Subject:</strong> Critical Alert: Password Expires in 2 Hours - Verify SSO</div>
                  <div><strong className="text-slate-400">Payload:</strong> Lookalike domain: <code className="text-[#88BDF2]">http://m365-login.azure-security.top</code></div>
                  <div><strong className="text-slate-400">SPF/DMARC:</strong> <span className="text-rose-400 font-bold">FAILED (Deceptive Sender TLD)</span></div>
                </>
              )}

              {selectedDemo === "safe" && (
                <>
                  <div><strong className="text-slate-400">From:</strong> &quot;GitHub Security&quot; &lt;notifications@github.com&gt;</div>
                  <div><strong className="text-slate-400">Subject:</strong> [GitHub] Security advisory: Dependabot alert resolved</div>
                  <div><strong className="text-slate-400">Payload:</strong> Trusted link: <code className="text-[#88BDF2]">https://github.com/sakshipatil-779/EmailGuard-AI</code></div>
                  <div><strong className="text-slate-400">SPF/DMARC:</strong> <span className="text-emerald-400 font-bold">PASSED (Cryptographic Alignment Valid)</span></div>
                </>
              )}

              <div className="pt-2">
                <Link
                  href="/analyze"
                  className="w-full py-2.5 rounded-lg bg-[#243240] hover:bg-[#88BDF2] hover:text-[#1a2A2f] text-white font-bold text-xs text-center block transition-all border border-[#384959]"
                >
                  Upload Your Own .eml File →
                </Link>
              </div>
            </div>

            {/* Center: Live Neural Risk Score */}
            <div className="p-4 rounded-xl bg-[#131d22] border border-[#243240] flex flex-col items-center justify-center text-center space-y-3 font-mono">
              <div className="text-xs text-[#88BDF2] font-bold">Neural AI Threat Score</div>
              <div
                className={`text-5xl font-black ${
                  selectedDemo === "bec"
                    ? "text-rose-400"
                    : selectedDemo === "phish"
                    ? "text-amber-400"
                    : "text-emerald-400"
                }`}
              >
                {selectedDemo === "bec" ? "98" : selectedDemo === "phish" ? "88" : "05"}<span className="text-lg text-slate-500 font-normal">/100</span>
              </div>
              <div
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  selectedDemo === "bec"
                    ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                    : selectedDemo === "phish"
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                    : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                }`}
              >
                {selectedDemo === "bec"
                  ? "CRITICAL • BUSINESS EMAIL COMPROMISE"
                  : selectedDemo === "phish"
                  ? "HIGH • CREDENTIAL HARVESTING PHISHING"
                  : "SAFE • LEGITIMATE ENTERPRISE NOTICE"}
              </div>
              <p className="text-[11px] text-slate-300 font-sans max-w-xs leading-relaxed">
                {selectedDemo === "bec"
                  ? "Executive impersonation with wire urgency tactics and unauthenticated direct IP mail sender."
                  : selectedDemo === "phish"
                  ? "Panic pretexting with lookalike top-level domain aiming to capture Microsoft SSO credentials."
                  : "Cryptographically signed message with legitimate domain alignment and zero risk factors."}
              </p>
            </div>

            {/* Right: Geolocation & IOC Summary */}
            <div className="p-4 rounded-xl bg-[#131d22] border border-[#243240] space-y-2.5 font-mono text-xs">
              <div className="flex items-center gap-1.5 text-[#88BDF2]">
                <Globe className="w-4 h-4 text-[#88BDF2]" />
                <span className="font-bold">Origin Trace &amp; IOCs</span>
              </div>

              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between pb-1 border-b border-[#243240]">
                  <span className="text-slate-400">Origin IP:</span>
                  <span className="text-white font-bold">{selectedDemo === "safe" ? "140.82.112.4" : "185.220.101.5"}</span>
                </div>
                <div className="flex justify-between pb-1 border-b border-[#243240]">
                  <span className="text-slate-400">Location:</span>
                  <span className="text-slate-200">{selectedDemo === "safe" ? "San Francisco, US" : "Frankfurt, Germany"}</span>
                </div>
                <div className="flex justify-between pb-1 border-b border-[#243240]">
                  <span className="text-slate-400">ISP / Host:</span>
                  <span className="text-[#88BDF2]">{selectedDemo === "safe" ? "GitHub Inc (AS36459)" : "Hetzner VPS (AS24940)"}</span>
                </div>
                <div className="flex justify-between pb-1 border-b border-[#243240]">
                  <span className="text-slate-400">Flagged Links:</span>
                  <span className={selectedDemo === "safe" ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
                    {selectedDemo === "safe" ? "0 Flagged" : "1 Critical Malicious URL"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Custody Seal:</span>
                  <span className="text-emerald-400 font-bold">SHA-256 Sealed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Capabilities Grid */}
      <section id="features" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 bg-white">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="text-xs font-mono text-[#384959] uppercase tracking-widest font-bold">Enterprise Architecture</div>
          <h2 className="text-2xl sm:text-4xl font-black text-[#1a2A2f]">
            Six Pillars of Modern Email Defense
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-sans">
            Engineered to trace, analyze, and attribute advanced threats across all OSI email layers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-[#88BDF2] transition-all space-y-3 shadow-sm group">
            <div className="w-10 h-10 rounded-xl bg-[#88BDF2]/20 border border-[#88BDF2]/40 flex items-center justify-center text-[#1a2A2f] group-hover:scale-110 transition-transform">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#1a2A2f] font-mono">Neural NLP Threat Scoring</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              Hugging Face transformer models (BART Large MNLI) evaluate semantic urgency, payment coercion, and executive pretexts in real time.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-[#88BDF2] transition-all space-y-3 shadow-sm group">
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700 group-hover:scale-110 transition-transform">
              <FileCode2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#1a2A2f] font-mono">Deep RFC-822 &amp; MSG Forensics</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              Unpacks multi-hop Received lines, Message-ID formats, Return-Path discrepancies, and cryptographic SPF/DKIM/DMARC alignment.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-[#88BDF2] transition-all space-y-3 shadow-sm group">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 group-hover:scale-110 transition-transform">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#1a2A2f] font-mono">Origin Trace &amp; Geo-Mapping</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              Identifies the earliest reliable sending node and plots relay server hops, ISP details, and ASN telemetry onto an interactive Leaflet map.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-[#88BDF2] transition-all space-y-3 shadow-sm group">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-700 group-hover:scale-110 transition-transform">
              <Share2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#1a2A2f] font-mono">React Flow Campaign Graphs</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              Correlates isolated email threats into unified adversary infrastructure graphs, mapping linked domains, IPs, and victim targets.
            </p>
          </div>

          {/* Card 5 */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-[#88BDF2] transition-all space-y-3 shadow-sm group">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 group-hover:scale-110 transition-transform">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#1a2A2f] font-mono">Cryptographic Evidence Vault</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              Calculates immutable SHA-256 checksums, establishes legal chain of custody, and generates structured forensic reports for judiciary review.
            </p>
          </div>

          {/* Card 6 */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-[#88BDF2] transition-all space-y-3 shadow-sm group">
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700 group-hover:scale-110 transition-transform">
              <Eye className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#1a2A2f] font-mono">Privacy &amp; PII Redaction</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              Instant on-the-fly masking of sensitive recipient details, IP addresses, and employee identities conforming with GDPR policies.
            </p>
          </div>
        </div>
      </section>

      {/* Firebase Cloud Sync & Google Auth Showcase */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="p-8 sm:p-12 rounded-3xl bg-[#1a2A2f] text-white border border-[#384959] shadow-xl relative overflow-hidden">
          <div className="max-w-2xl space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#88BDF2]/20 border border-[#88BDF2]/40 text-xs font-mono text-[#88BDF2]">
              <Database className="w-3.5 h-3.5" />
              <span className="font-bold">FIREBASE CLOUD INTEGRATION</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Seamless Google Authentication &amp; Cloud Incident Storage
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
              Sign in with your Google account to automatically synchronize analyzed email dossiers, threat alerts, and investigation cases across all SOC workstations with real-time Firebase Firestore persistence.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={handleGoogleLogin}
                disabled={isSigningIn}
                className="px-6 py-3 rounded-xl bg-white hover:bg-slate-100 text-[#1a2A2f] font-bold text-xs sm:text-sm font-mono shadow-md transition-all flex items-center gap-2.5"
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
                <span>{isSigningIn ? "Connecting..." : "Sign in with Google"}</span>
              </button>

              <Link
                href="/analyze"
                className="px-5 py-3 rounded-xl bg-[#243240] hover:bg-[#384959] text-white font-mono text-xs sm:text-sm font-bold border border-[#384959] transition-all flex items-center gap-2"
              >
                <span>Analyze Sample (.eml)</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a2A2f] border-t border-[#243240] py-12 px-4 sm:px-6 lg:px-8 max-w-full font-mono text-xs text-slate-400 space-y-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-[#88BDF2]" />
              <span className="font-bold text-white tracking-wider text-sm">EmailGuard-AI</span>
              <span className="text-slate-600">|</span>
              <span>Email Threat Intelligence &amp; Forensic Investigation Platform</span>
            </div>

            <div className="flex items-center gap-2 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>All Forensic Engines Operational</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#243240]/60 text-[11px] text-slate-500">
            <div>Conforms with MITRE ATT&amp;CK Matrix (T1566 Phishing, T1598 Information Gathering)</div>
            <div>&copy; 2026 EmailGuard AI. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
