"use client";

import React from "react";
import { Sparkles, Copy, Trash2, Code2 } from "lucide-react";
import { toast } from "sonner";

interface RawEmailEditorProps {
  value: string;
  onChange: (val: string) => void;
  onSelectSample: (sampleKey: string) => void;
}

export const SAMPLE_EMAILS: Record<string, { label: string; tag: string; color: string; content: string }> = {
  bec_wire: {
    label: "BEC Wire Fraud (CEO Spoofing)",
    tag: "CRITICAL",
    color: "text-rose-700 border-rose-300 bg-rose-50",
    content: `Received: from mail-relay-04.acme-corp-holdings.co (102.89.41.118) by mx1.acmeworks.com with ESMTP id q99104; Wed, 26 Aug 2026 14:31:55 +0000
Authentication-Results: mx1.acmeworks.com; dkim=neutral header.i=@acme-corp-holdings.co; spf=softfail (102.89.41.118 not authorized) smtp.mailfrom=bounces-jvance@acme-corp-holdings.co; dmarc=fail header.from=acme-corp-holdings.co
From: "Jonathan Vance (CEO)" <jvance@acme-corp-holdings.co>
To: Sarah Jenkins <sjenkins@acmeworks.com>
Reply-To: director.board.jvance@gmail.com
Return-Path: <bounces-jvance@acme-corp-holdings.co>
Subject: URGENT & CONFIDENTIAL: Time-Sensitive M&A Acquisition Escrow Wire Instructions
Date: Wed, 26 Aug 2026 14:31:45 +0000
Message-ID: <20260826143145.89201.jvance@mail-relay-04.acme-corp-holdings.co>
X-Mailer: PHPMailer 6.8.0
X-Originating-IP: [102.89.41.118]
Content-Type: text/plain; charset=UTF-8

Sarah,

I am currently in an all-day executive board meeting and cannot take voice calls. We are finalizing the confidential acquisition of Project Keystone today before market close.

Please immediately process an initial escrow wire of $485,000 to the legal escrow account provided by our acquisition counsel below:

Beneficiary: Apex Global Escrow LLC
Bank: Standard Federal Commerce Bank
Routing / ABA: 021000021
Account: 88492019482
Ref: KEYSTONE-M&A-CONFIDENTIAL

Send me the wire confirmation receipt directly to this thread once executed. Do not discuss this with the team until the official press release at 5 PM.

Regards,
Jonathan Vance
Chief Executive Officer | Acme Works Corp`
  },

  m365_phish: {
    label: "Microsoft 365 AiTM Phishing",
    tag: "CRITICAL",
    color: "text-rose-700 border-rose-300 bg-rose-50",
    content: `Received: from relay-outbound.micros0ft-security-portal.com (194.26.29.84) by mx1.acmeworks.com with ESMTP id m365_sec_99; Wed, 26 Aug 2026 11:14:30 +0000
Authentication-Results: mx1.acmeworks.com; spf=pass (194.26.29.84 matches spf); dkim=fail (body hash mismatch); dmarc=fail
From: "Microsoft 365 Security Team" <no-reply@micros0ft-security-portal.com>
To: David Miller <dmiller@acmeworks.com>
Subject: Action Required: Your Microsoft 365 Password Expires in 24 Hours
Date: Wed, 26 Aug 2026 11:14:22 +0000
Message-ID: <MS365-SEC-20260826111422@relay-outbound.micros0ft-security-portal.com>
X-Originating-IP: [194.26.29.84]
Content-Type: text/plain; charset=UTF-8

Microsoft Security Alert

Your corporate Microsoft 365 single sign-on access password for dmiller@acmeworks.com is scheduled to expire in 24 hours.

To prevent disruption to your Outlook, Teams, and SharePoint services, please keep your current password or configure new security credentials using the official verification portal:

Keep Current Password: https://login.microsoftonline.acmeworks.micros0ft-security-portal.com/auth/sso?id=dmiller

Failure to verify within 24 hours will result in automatic account lockout.

Microsoft Corporation, One Microsoft Way, Redmond, WA 98052`
  },

  ransomware_inv: {
    label: "LockBit Ransomware Invoice",
    tag: "CRITICAL",
    color: "text-amber-800 border-amber-300 bg-amber-50",
    content: `Received: from relay.bulletproof-host.is (185.220.101.5) by mx1.acmeworks.com; Tue, 25 Aug 2026 18:39:45 +0000
From: "Global Logistics Billing" <billing@freight-invoicing-system.top>
To: Accounts Payable <ap@acmeworks.com>
Subject: FINAL DEMAND: Outstanding Balance Invoice INV-982103 Legal Action Notice
Date: Tue, 25 Aug 2026 18:39:10 +0000
Message-ID: <20260825183910.MAL_9821@freight-invoicing-system.top>
X-Originating-IP: [185.220.101.5]
Content-Type: text/plain; charset=UTF-8

Attention Accounts Payable,

Our records indicate that invoice INV-982103 for $34,810.00 is now 60 days past due. Continued non-payment will result in immediate escalation to collections and judicial enforcement.

Please review the attached certified PDF statement and remittance slip enclosed in the encrypted archive (Password: invoice2026) and confirm payment dispatch immediately:
Attachment: Invoice_Statement_INV982103.vbs.zip (SHA-256: 7d8f9e0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e)

Global Logistics Invoicing Department`
  },

  google_legit: {
    label: "Google Cloud Advisory (Legitimate)",
    tag: "VERIFIED",
    color: "text-emerald-700 border-emerald-300 bg-emerald-50",
    content: `Received: from mail-qk4-f182.google.com (209.85.222.182) by mx1.acmeworks.com with ESMTPS id gcp_legit_01; Wed, 26 Aug 2026 09:59:20 +0000
Authentication-Results: mx1.acmeworks.com; dkim=pass header.i=@google.com header.s=20230601; spf=pass (209.85.222.182 is designated IP) smtp.mailfrom=3g89@gaia.bounces.google.com; dmarc=pass (p=reject dis=none) header.from=google.com
DKIM-Signature: v=1; a=rsa-sha256; c=relaxed/relaxed; d=google.com; s=20230601; h=mime-version:date:message-id:subject:from:to; bh=s8f...; b=Q8x...
From: "Google Cloud Platform" <google-cloud-security@google.com>
To: Cloud Admin <cloud-ops@acmeworks.com>
Subject: Monthly Security & Compliance Digest: Project Acme-Production-US
Date: Wed, 26 Aug 2026 09:59:12 +0000
Message-ID: <google-gcp-sec-20260826095912.890@mail.google.com>
Content-Type: text/plain; charset=UTF-8

Google Cloud Security Digest

Hello Cloud Administrator,

Your monthly security summary for project Acme-Production-US is now available in Google Cloud Console.

Summary:
- 0 Critical vulnerabilities detected in Cloud Armor policies
- 100% Identity-Aware Proxy (IAP) enforcement
- Key rotation completed on 14 service accounts

View full audit log in Cloud Console: https://console.cloud.google.com/security/overview

Google LLC, 1600 Amphitheatre Parkway, Mountain View, CA 94043`
  }
};

export function RawEmailEditor({ value, onChange, onSelectSample }: RawEmailEditorProps) {
  return (
    <div className="space-y-3">
      {/* Preset Test Scenarios */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-[#1a2A2f]" />
          Optional Sample Previews:
        </span>

        {Object.entries(SAMPLE_EMAILS).map(([key, sample]) => (
          <button
            key={key}
            type="button"
            onClick={() => {
              onSelectSample(key);
              toast.info(`Loaded test scenario: ${sample.label}`);
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium border transition-all flex items-center gap-1.5 ${sample.color} hover:shadow-sm`}
          >
            <span>{sample.label}</span>
          </button>
        ))}
      </div>

      {/* Code Editor Box */}
      <div className="rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden focus-within:border-[#88BDF2] focus-within:ring-1 focus-within:ring-[#88BDF2] transition-all">
        {/* Editor Toolbar */}
        <div className="px-4 py-2 bg-[#1a2A2f] text-xs text-white font-mono flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-[#88BDF2]" />
            <span>Raw RFC-822 / Outlook MSG Stream Input</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-300">{value ? `${value.split("\n").length} lines` : "Empty"}</span>
            {value && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(value);
                    toast.success("Raw email copied to clipboard.");
                  }}
                  className="hover:text-[#88BDF2] flex items-center gap-1 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </button>
                <button
                  type="button"
                  onClick={() => onChange("")}
                  className="hover:text-rose-300 flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Textarea */}
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={14}
          placeholder="Paste full raw email payload including Received, Authentication-Results, From, To, Subject headers, links, and body text..."
          className="w-full bg-white p-4 text-xs font-mono text-[#1a2A2f] placeholder-slate-400 focus:outline-none resize-y leading-relaxed"
        />
      </div>
    </div>
  );
}
