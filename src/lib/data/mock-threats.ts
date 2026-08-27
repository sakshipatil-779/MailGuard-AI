import { EmailAnalysis } from "@/types/analysis";

export const MOCK_EMAILS: EmailAnalysis[] = [
  {
    id: "eml_bec_wire_001",
    analysisId: "anl_bec_8921",
    createdAt: "2026-08-26T14:32:00Z",
    filename: "URGENT_CONFIDENTIAL_Acquisition_Wire_Transfer.eml",
    rawSize: 18450,
    classification: "business_email_compromise",
    riskScore: 96,
    severity: "critical",
    confidence: 0.98,
    recommendation: "Quarantine immediately, block sender domain on firewall, initiate SOC wire-fraud incident response procedure.",
    executiveSummary: "High-confidence Business Email Compromise (BEC) attack impersonating CEO Jonathan Vance targeting VP of Finance Sarah Jenkins. Employs lookalike domain (acme-corp-holdings.co vs authentic acmeworks.com), reply-to redirection, urgent secrecy request, and unauthenticated SMTP origin from bulletproof hosting in Nigeria.",
    status: "ESCALATED",
    tags: ["BEC", "Executive Spoofing", "Wire Fraud", "Lookalike Domain", "DMARC Failure"],
    sha256: "8e9b2c3a5d7e1f4092b6a839c01824b2190f845d82910faecb7189104fa289c1",
    caseId: "CASE-2026-0041",
    caseTitle: "Operation Executive Phantom: C-Suite BEC Campaign",
    assignedAnalyst: "Alex Mercer (Senior Threat Hunter)",
    
    headers: {
      from: '"Jonathan Vance (CEO)" <jvance@acme-corp-holdings.co>',
      fromName: "Jonathan Vance (CEO)",
      fromAddress: "jvance@acme-corp-holdings.co",
      to: ["Sarah Jenkins <sjenkins@acmeworks.com>"],
      replyTo: "director.board.jvance@gmail.com",
      returnPath: "<bounces-jvance@acme-corp-holdings.co>",
      subject: "URGENT & CONFIDENTIAL: Time-Sensitive M&A Acquisition Escrow Wire Instructions",
      date: "Wed, 26 Aug 2026 14:31:45 +0000",
      messageId: "<20260826143145.89201.jvance@mail-relay-04.acme-corp-holdings.co>",
      mimeVersion: "1.0",
      contentType: "text/html; charset=UTF-8",
      xMailer: "PHPMailer 6.8.0 (https://github.com/PHPMailer/PHPMailer)",
      xOriginatingIp: "102.89.41.118",
      allHeaders: {
        "Received": "from mail-relay-04.acme-corp-holdings.co (102.89.41.118) by mx1.acmeworks.com with ESMTP id q99104; Wed, 26 Aug 2026 14:31:55 +0000",
        "Authentication-Results": "mx1.acmeworks.com; dkim=neutral (no key) header.i=@acme-corp-holdings.co; spf=softfail (102.89.41.118 is not designated IP) smtp.mailfrom=bounces-jvance@acme-corp-holdings.co; dmarc=fail (p=none dis=none) header.from=acme-corp-holdings.co",
        "From": '"Jonathan Vance (CEO)" <jvance@acme-corp-holdings.co>',
        "To": "Sarah Jenkins <sjenkins@acmeworks.com>",
        "Reply-To": "director.board.jvance@gmail.com",
        "Return-Path": "<bounces-jvance@acme-corp-holdings.co>",
        "Subject": "URGENT & CONFIDENTIAL: Time-Sensitive M&A Acquisition Escrow Wire Instructions",
        "Date": "Wed, 26 Aug 2026 14:31:45 +0000",
        "Message-ID": "<20260826143145.89201.jvance@mail-relay-04.acme-corp-holdings.co>",
        "X-Mailer": "PHPMailer 6.8.0",
        "X-Priority": "1 (Highest)",
        "X-MSMail-Priority": "High",
        "X-Originating-IP": "[102.89.41.118]"
      }
    },
    
    bodyText: `Sarah,

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
Chief Executive Officer | Acme Works Corp`,

    bodyHtml: `<div style="font-family: Arial, sans-serif; color: #222; line-height: 1.5;">
<p>Sarah,</p>
<p>I am currently in an all-day executive board meeting and cannot take voice calls. We are finalizing the confidential acquisition of <strong>Project Keystone</strong> today before market close.</p>
<p>Please immediately process an initial escrow wire of <strong>$485,000.00 USD</strong> to the legal escrow account provided by our acquisition counsel below:</p>
<div style="background: #f4f6f8; border-left: 4px solid #d9534f; padding: 12px; margin: 16px 0;">
  <p style="margin: 4px 0;"><strong>Beneficiary:</strong> Apex Global Escrow LLC</p>
  <p style="margin: 4px 0;"><strong>Bank:</strong> Standard Federal Commerce Bank</p>
  <p style="margin: 4px 0;"><strong>Routing / ABA:</strong> 021000021</p>
  <p style="margin: 4px 0;"><strong>Account Number:</strong> 88492019482</p>
  <p style="margin: 4px 0;"><strong>Reference:</strong> KEYSTONE-M&amp;A-CONFIDENTIAL</p>
</div>
<p>Send me the wire confirmation receipt directly to this thread once executed. Do not discuss this with the team until the official press release at 5 PM.</p>
<br>
<p>Regards,<br>
<strong>Jonathan Vance</strong><br>
Chief Executive Officer | Acme Works Corp</p>
</div>`,
    hasHtml: true,
    attachments: [
      {
        id: "att_001",
        filename: "M&A_Escrow_Wiring_Invoice_Signed.pdf",
        filesize: 142800,
        contentType: "application/pdf",
        md5: "4c7a6e118939a4bc9d2014fbac281901",
        sha256: "3f98c8942a1bc7e1082736481029384756192837465102938475610293847561",
        malicious: true,
        threatScore: 88,
        verdict: "Weaponized PDF with fraudulent banking details and zero-day metadata discrepancy",
        entropy: 7.82
      }
    ],

    findings: [
      {
        id: "fnd_01",
        category: "Identity Impersonation",
        severity: "critical",
        title: "Executive Display Name & Domain Spoofing",
        explanation: "The display name 'Jonathan Vance (CEO)' uses an unregistered cousin lookalike domain 'acme-corp-holdings.co' (registered only 3 days ago) instead of authentic company domain 'acmeworks.com'.",
        evidenceRefs: ["Header.From", "Domain.acme-corp-holdings.co"],
        mitreTechnique: "T1566.002 - Spearphishing Link / Domain Impersonation",
        confidence: 0.99
      },
      {
        id: "fnd_02",
        category: "Header Anomaly",
        severity: "high",
        title: "Reply-To Redirection to External Free Mail Provider",
        explanation: "The Reply-To header is set to 'director.board.jvance@gmail.com', diverting any employee responses away from organizational mail servers to an attacker-controlled Gmail mailbox.",
        evidenceRefs: ["Header.Reply-To"],
        mitreTechnique: "T1071.003 - Mail Protocols / Diverted Flow",
        confidence: 0.98
      },
      {
        id: "fnd_03",
        category: "Authentication Failure",
        severity: "critical",
        title: "DMARC & SPF Alignment Failure",
        explanation: "The originating IP 102.89.41.118 is not authorized in SPF policy for the sender domain. DMARC validation failed completely with zero DKIM signatures present.",
        evidenceRefs: ["Auth.SPF", "Auth.DKIM", "Auth.DMARC"],
        mitreTechnique: "T1566 - Phishing",
        confidence: 0.95
      },
      {
        id: "fnd_04",
        category: "NLP Semantic Risk",
        severity: "critical",
        title: "Urgent Financial Coercion & Out-of-Band Prevention",
        explanation: "The email exhibits classic BEC social engineering: artificial urgency ($485k transfer before close), secrecy instructions ('Do not discuss with the team'), and voice-call suppression ('in executive board meeting cannot take calls').",
        evidenceRefs: ["Body.Text Analysis"],
        mitreTechnique: "T1598 - Phishing for Information",
        confidence: 0.96
      },
      {
        id: "fnd_05",
        category: "Infrastructure Anomaly",
        severity: "high",
        title: "Unusual Geolocation & Bulletproof Originating IP",
        explanation: "Origin IP 102.89.41.118 resolves to MTN Nigeria in Lagos, an unprecedented origin for executive staff communication.",
        evidenceRefs: ["Relay.Hop_1", "GeoIP.Origin"],
        mitreTechnique: "T1583.003 - VPS Infrastructure",
        confidence: 0.91
      }
    ],

    authentication: {
      spf: "fail",
      dkim: "none",
      dmarc: "fail",
      alignment: "fail",
      spfDetails: "softfail: 102.89.41.118 is not included in SPF record v=spf1 include:_spf.acme-corp-holdings.co ~all",
      dkimDetails: "none: Message has no DKIM cryptographic signatures",
      dmarcDetails: "fail: Policy p=none, SPF fail and DKIM none produced unaligned DMARC failure",
      alignmentDetails: "Unaligned: Header.From (acme-corp-holdings.co) does not align with authentic enterprise domain (acmeworks.com)",
      rawAuthResults: "mx1.acmeworks.com; dkim=none; spf=softfail (ip=102.89.41.118) smtp.mailfrom=bounces-jvance@acme-corp-holdings.co; dmarc=fail action=none header.from=acme-corp-holdings.co"
    },

    relayPath: [
      {
        id: "hop_01",
        hopNumber: 1,
        fromHost: "unknown-client-dhcp.mtn.net.ng",
        byHost: "mail-relay-04.acme-corp-holdings.co",
        ip: "102.89.41.118",
        timestamp: "2026-08-26T14:31:45Z",
        delaySeconds: 0,
        protocol: "ESMTP",
        tlsVersion: "None (Cleartext)",
        country: "Nigeria",
        countryCode: "NG",
        region: "Lagos",
        city: "Lagos",
        isp: "MTN Nigeria Communications",
        asn: "AS29465 (MTN NIGERIA)",
        reverseDns: "102.89.41.118.static.mtn.com.ng",
        latitude: 6.5244,
        longitude: 3.3792,
        anomaly: true,
        anomalyReason: "Originating IP from mobile ISP in Lagos; no TLS encryption during initial SMTP handshake.",
        isOrigin: true,
        confidence: "High"
      },
      {
        id: "hop_02",
        hopNumber: 2,
        fromHost: "mail-relay-04.acme-corp-holdings.co",
        byHost: "vps-nl-09.hosthatch-cloud.net",
        ip: "185.107.56.202",
        timestamp: "2026-08-26T14:31:48Z",
        delaySeconds: 3,
        protocol: "ESMTPS",
        tlsVersion: "TLS 1.2 ECDHE-RSA-AES256-GCM-SHA384",
        country: "Netherlands",
        countryCode: "NL",
        region: "North Holland",
        city: "Amsterdam",
        isp: "HostHatch B.V.",
        asn: "AS63023 (HostHatch)",
        reverseDns: "nl-ams-09.relay-nodes.net",
        latitude: 52.3676,
        longitude: 4.9041,
        anomaly: true,
        anomalyReason: "Known bulletproof VPS relay proxy frequently utilized in multi-stage forwarding.",
        confidence: "Medium"
      },
      {
        id: "hop_03",
        hopNumber: 3,
        fromHost: "vps-nl-09.hosthatch-cloud.net",
        byHost: "mx1.acmeworks.com",
        ip: "208.76.104.14",
        timestamp: "2026-08-26T14:31:55Z",
        delaySeconds: 7,
        protocol: "ESMTPS",
        tlsVersion: "TLS 1.3 TLS_AES_256_GCM_SHA384",
        country: "United States",
        countryCode: "US",
        region: "Virginia",
        city: "Ashburn",
        isp: "Amazon Web Services (AWS)",
        asn: "AS16509 (AMAZON-02)",
        reverseDns: "mx1.acmeworks.com",
        latitude: 39.0438,
        longitude: -77.4874,
        anomaly: false,
        isDestination: true,
        confidence: "High"
      }
    ],

    origin: {
      ip: "102.89.41.118",
      country: "Nigeria",
      city: "Lagos",
      region: "Lagos State",
      isp: "MTN Nigeria Communications Limited",
      asn: "AS29465",
      latitude: 6.5244,
      longitude: 3.3792,
      confidence: "High",
      isEstimated: false,
      proxyOrVpn: true
    },

    iocs: [
      {
        id: "ioc_01",
        type: "ip",
        value: "102.89.41.118",
        category: "Source IP / Originating Node",
        riskScore: 94,
        malicious: true,
        firstSeen: "2026-08-12",
        reputationSource: "AbuseIPDB (Confidence: 89%)",
        context: "Origin node for multiple BEC spear-phishing campaigns targeting North American enterprises.",
        inEvidence: true
      },
      {
        id: "ioc_02",
        type: "domain",
        value: "acme-corp-holdings.co",
        category: "Lookalike Domain",
        riskScore: 98,
        malicious: true,
        firstSeen: "2026-08-23",
        reputationSource: "DomainTools / URLhaus",
        context: "Registered 3 days ago via NameCheap, DNS pointing to VPS relay in Netherlands.",
        inEvidence: true
      },
      {
        id: "ioc_03",
        type: "email",
        value: "director.board.jvance@gmail.com",
        category: "Diverted Reply-To Mailbox",
        riskScore: 90,
        malicious: true,
        firstSeen: "2026-08-26",
        reputationSource: "Internal SOC Threat Graph",
        context: "Attacker-controlled exfiltration mailbox used to intercept wire confirmation receipts.",
        inEvidence: true
      },
      {
        id: "ioc_04",
        type: "ip",
        value: "185.107.56.202",
        category: "Intermediate Relay Proxy",
        riskScore: 82,
        malicious: true,
        firstSeen: "2026-06-19",
        reputationSource: "VirusTotal (14/92 engines)",
        context: "Bulletproof VPS hosting node in Amsterdam used to disguise originating IP headers.",
        inEvidence: true
      },
      {
        id: "ioc_05",
        type: "hash",
        value: "3f98c8942a1bc7e1082736481029384756192837465102938475610293847561",
        category: "Attachment SHA-256",
        riskScore: 88,
        malicious: true,
        firstSeen: "2026-08-26",
        reputationSource: "Cuckoo Sandbox / Hybrid Analysis",
        context: "PDF with fraudulent bank account routing number targeting Acme accounts payable.",
        inEvidence: true
      }
    ],

    domainIntelligence: [
      {
        domain: "acme-corp-holdings.co",
        riskScore: 98,
        domainAgeDays: 3,
        createdDate: "2026-08-23T11:20:00Z",
        expiryDate: "2027-08-23T11:20:00Z",
        registrar: "NameCheap, Inc. (Privacy Protected)",
        nameservers: ["dns1.registrar-servers.com", "dns2.registrar-servers.com"],
        mxRecords: ["10 mail-relay-04.acme-corp-holdings.co"],
        aRecords: ["185.107.56.202"],
        txtRecords: ["v=spf1 include:_spf.acme-corp-holdings.co ~all"],
        asn: "AS63023 (HostHatch B.V.)",
        hostingProvider: "HostHatch Netherlands",
        country: "Netherlands",
        isLookalike: true,
        lookalikeBrand: "Acme Works Corp (acmeworks.com)",
        lookalikeSimilarity: 0.89,
        lookalikeReason: "Permutation attack: inserted '-holdings' hyphenated suffix to spoof enterprise entity.",
        dmarcPolicy: "none",
        isDnsValid: true
      }
    ],

    ipIntelligence: [
      {
        ip: "102.89.41.118",
        threatScore: 94,
        asn: "AS29465",
        organization: "MTN Nigeria Communications",
        country: "Nigeria",
        countryCode: "NG",
        city: "Lagos",
        region: "Lagos State",
        latitude: 6.5244,
        longitude: 3.3792,
        reverseDns: "102.89.41.118.static.mtn.com.ng",
        isHosting: false,
        isVpnOrProxy: true,
        isTorExit: false,
        isKnownAbuser: true,
        abuseReportsCount: 47,
        lastReportedDate: "2026-08-25",
        relatedDomains: ["acme-corp-holdings.co", "secure-transfer-auth.com"]
      },
      {
        ip: "185.107.56.202",
        threatScore: 82,
        asn: "AS63023",
        organization: "HostHatch B.V.",
        country: "Netherlands",
        countryCode: "NL",
        city: "Amsterdam",
        region: "North Holland",
        latitude: 52.3676,
        longitude: 4.9041,
        reverseDns: "nl-ams-09.relay-nodes.net",
        isHosting: true,
        isVpnOrProxy: false,
        isTorExit: false,
        isKnownAbuser: true,
        abuseReportsCount: 29,
        lastReportedDate: "2026-08-24",
        relatedDomains: ["acme-corp-holdings.co", "apex-legal-escrow.net"]
      }
    ]
  },

  {
    id: "eml_m365_phish_002",
    analysisId: "anl_m365_4412",
    createdAt: "2026-08-26T11:15:00Z",
    filename: "Microsoft_365_Security_Critical_Action_Required.eml",
    rawSize: 22100,
    classification: "phishing",
    riskScore: 92,
    severity: "critical",
    confidence: 0.97,
    recommendation: "Block malicious URL on web proxy, purge email from all user mailboxes, force password reset for targeted recipients.",
    executiveSummary: "Sophisticated Microsoft 365 credential harvesting campaign leveraging zero-font text obfuscation, homoglyph punycode lookalike domain (micros0ft-security-portal.com), and an adversary-in-the-middle (AiTM) reverse proxy stealing session cookies and bypassing MFA.",
    status: "NEW",
    tags: ["M365 Phishing", "Credential Harvesting", "AiTM Proxy", "Zero-Font Obfuscation"],
    sha256: "4a2f8c19e5b0213d7890fa1827364b5c6d7e8f901a2b3c4d5e6f7a8b9c0d1e2f",
    caseId: "CASE-2026-0038",
    caseTitle: "EvilProxy AiTM M365 Credential Harvesting",
    assignedAnalyst: "Elena Rostova (SOC Tier 2)",

    headers: {
      from: '"Microsoft 365 Security Team" <no-reply@micros0ft-security-portal.com>',
      fromName: "Microsoft 365 Security Team",
      fromAddress: "no-reply@micros0ft-security-portal.com",
      to: ["David Miller <dmiller@acmeworks.com>"],
      subject: "Action Required: Your Microsoft 365 Password Expires in 24 Hours",
      date: "Wed, 26 Aug 2026 11:14:22 +0000",
      messageId: "<MS365-SEC-20260826111422@relay-outbound.micros0ft-security-portal.com>",
      mimeVersion: "1.0",
      contentType: "text/html; charset=UTF-8",
      xMailer: "Microsoft Outlook 16.0",
      allHeaders: {
        "Received": "from relay-outbound.micros0ft-security-portal.com (194.26.29.84) by mx1.acmeworks.com with ESMTP id m365_sec_99; Wed, 26 Aug 2026 11:14:30 +0000",
        "Authentication-Results": "mx1.acmeworks.com; spf=pass (194.26.29.84 matches spf) smtp.mailfrom=no-reply@micros0ft-security-portal.com; dkim=fail (body hash mismatch) header.d=micros0ft-security-portal.com; dmarc=fail",
        "From": '"Microsoft 365 Security Team" <no-reply@micros0ft-security-portal.com>',
        "To": "David Miller <dmiller@acmeworks.com>",
        "Subject": "Action Required: Your Microsoft 365 Password Expires in 24 Hours",
        "Date": "Wed, 26 Aug 2026 11:14:22 +0000",
        "Message-ID": "<MS365-SEC-20260826111422@relay-outbound.micros0ft-security-portal.com>",
        "X-Originating-IP": "[194.26.29.84]"
      }
    },

    bodyText: `Microsoft Security Alert

Your corporate Microsoft 365 single sign-on access password for dmiller@acmeworks.com is scheduled to expire in 24 hours.

To prevent disruption to your Outlook, Teams, and SharePoint services, please keep your current password or configure new security credentials using the official verification portal:

Keep Current Password: https://login.microsoftonline.acmeworks.micros0ft-security-portal.com/auth/sso?id=dmiller

Failure to verify within 24 hours will result in automatic account lockout.

Microsoft Corporation, One Microsoft Way, Redmond, WA 98052`,

    bodyHtml: `<div style="font-family: 'Segoe UI', Tahoma, sans-serif; max-width: 580px; margin: auto; padding: 24px; border: 1px solid #e1e4e8; border-radius: 8px;">
  <div style="display: flex; align-items: center; margin-bottom: 20px;">
    <div style="display: inline-block; width: 24px; height: 24px; background: #0078d4; margin-right: 12px; vertical-align: middle;"></div>
    <span style="font-size: 18px; font-weight: 600; color: #24292e;">Microsoft 365 Security</span>
  </div>
  <p style="font-size: 15px; color: #333;">Hello David Miller,</p>
  <p style="font-size: 14px; color: #555; line-height: 1.6;">Your corporate Microsoft 365 password for <strong>dmiller@acmeworks.com</strong> is scheduled to expire in <strong>24 hours</strong>.</p>
  <p style="font-size: 14px; color: #555; line-height: 1.6;">To prevent disruption to your Outlook, Teams, and SharePoint access, please confirm your current credentials:</p>
  <div style="text-align: center; margin: 30px 0;">
    <a href="https://login.microsoftonline.acmeworks.micros0ft-security-portal.com/auth/sso?id=dmiller" style="background: #0078d4; color: #fff; padding: 12px 28px; text-decoration: none; border-radius: 4px; font-weight: 600; display: inline-block;">Keep Current Password</a>
  </div>
  <p style="font-size: 12px; color: #888; border-top: 1px solid #eee; padding-top: 16px;">Microsoft Corporation, One Microsoft Way, Redmond, WA 98052</p>
</div>`,
    hasHtml: true,
    attachments: [],

    findings: [
      {
        id: "fnd_m01",
        category: "Lookalike Domain",
        severity: "critical",
        title: "Homoglyph Typo-squatting (micros0ft with zero)",
        explanation: "The sender domain 'micros0ft-security-portal.com' substitutes the letter 'o' with numeral '0' to deceive users and bypass standard keyword filters.",
        evidenceRefs: ["Header.From", "Domain.micros0ft-security-portal.com"],
        mitreTechnique: "T1566.002 - Spearphishing Link",
        confidence: 0.99
      },
      {
        id: "fnd_m02",
        category: "Malicious URL",
        severity: "critical",
        title: "Adversary-in-the-Middle (AiTM) Phishing Reverse Proxy",
        explanation: "The action button links to a known EvilProxy deployment hosted on Russian IP 194.26.29.84 designed to capture active SAML/OAuth session tokens.",
        evidenceRefs: ["Body.URL"],
        mitreTechnique: "T1556 - Modify Authentication Process / AiTM",
        confidence: 0.98
      },
      {
        id: "fnd_m03",
        category: "Cryptographic Mismatch",
        severity: "high",
        title: "DKIM Signature Body Hash Tampering",
        explanation: "DKIM verification returned 'fail' due to body hash mismatch (bh=...), indicating message content was modified or injected post-signing.",
        evidenceRefs: ["Auth.DKIM"],
        confidence: 0.94
      }
    ],

    authentication: {
      spf: "pass",
      dkim: "fail",
      dmarc: "fail",
      alignment: "fail",
      spfDetails: "pass: IP 194.26.29.84 is listed in sender SPF record",
      dkimDetails: "fail: body hash did not verify",
      dmarcDetails: "fail: dkim failed and domain alignment is invalid for Microsoft",
      alignmentDetails: "Domain does not belong to Microsoft Corporation (MSFT)",
      rawAuthResults: "mx1.acmeworks.com; spf=pass (194.26.29.84); dkim=fail (body hash mismatch); dmarc=fail"
    },

    relayPath: [
      {
        id: "hop_m1",
        hopNumber: 1,
        fromHost: "srv-relay-ru.vdsina.ru",
        byHost: "relay-outbound.micros0ft-security-portal.com",
        ip: "194.26.29.84",
        timestamp: "2026-08-26T11:14:22Z",
        delaySeconds: 0,
        protocol: "ESMTPS",
        tlsVersion: "TLS 1.2",
        country: "Russia",
        countryCode: "RU",
        region: "Moscow",
        city: "Moscow",
        isp: "VDSina Hosting LLC",
        asn: "AS57523 (VDSINA-AS)",
        reverseDns: "194.26.29.84.vdsina.ru",
        latitude: 55.7558,
        longitude: 37.6173,
        anomaly: true,
        anomalyReason: "Origin server located in Moscow, Russia with high threat reputation.",
        isOrigin: true,
        confidence: "High"
      },
      {
        id: "hop_m2",
        hopNumber: 2,
        fromHost: "relay-outbound.micros0ft-security-portal.com",
        byHost: "mx1.acmeworks.com",
        ip: "208.76.104.14",
        timestamp: "2026-08-26T11:14:30Z",
        delaySeconds: 8,
        protocol: "ESMTPS",
        tlsVersion: "TLS 1.3",
        country: "United States",
        countryCode: "US",
        region: "Virginia",
        city: "Ashburn",
        isp: "AWS Cloud",
        asn: "AS16509",
        latitude: 39.0438,
        longitude: -77.4874,
        anomaly: false,
        isDestination: true,
        confidence: "High"
      }
    ],

    origin: {
      ip: "194.26.29.84",
      country: "Russia",
      city: "Moscow",
      region: "Moscow City",
      isp: "VDSina Hosting LLC",
      asn: "AS57523",
      latitude: 55.7558,
      longitude: 37.6173,
      confidence: "High",
      isEstimated: false,
      proxyOrVpn: false
    },

    iocs: [
      {
        id: "ioc_m1",
        type: "ip",
        value: "194.26.29.84",
        category: "EvilProxy C2 Node",
        riskScore: 96,
        malicious: true,
        firstSeen: "2026-07-30",
        reputationSource: "CrowdStrike Falcon Intel",
        context: "AiTM credential phishing relay cluster targeting corporate M365 tenants.",
        inEvidence: true
      },
      {
        id: "ioc_m2",
        type: "domain",
        value: "micros0ft-security-portal.com",
        category: "Homoglyph Domain",
        riskScore: 98,
        malicious: true,
        firstSeen: "2026-08-24",
        reputationSource: "PhishTank / OpenPhish",
        context: "Brand impersonation domain spoofing Microsoft 365.",
        inEvidence: true
      },
      {
        id: "ioc_m3",
        type: "url",
        value: "https://login.microsoftonline.acmeworks.micros0ft-security-portal.com/auth/sso",
        category: "Phishing Endpoint",
        riskScore: 99,
        malicious: true,
        firstSeen: "2026-08-26",
        reputationSource: "URLScan.io (Malicious Verdict: 100%)",
        context: "Reverse proxy credential capture interface mimicking Azure Active Directory login.",
        inEvidence: true
      }
    ],

    domainIntelligence: [
      {
        domain: "micros0ft-security-portal.com",
        riskScore: 98,
        domainAgeDays: 2,
        createdDate: "2026-08-24T09:12:00Z",
        expiryDate: "2027-08-24T09:12:00Z",
        registrar: "Reg.ru LLC",
        nameservers: ["ns1.reg.ru", "ns2.reg.ru"],
        mxRecords: ["10 relay-outbound.micros0ft-security-portal.com"],
        aRecords: ["194.26.29.84"],
        txtRecords: ["v=spf1 ip4:194.26.29.84 ~all"],
        asn: "AS57523 (VDSINA-AS)",
        hostingProvider: "VDSina Cloud Moscow",
        country: "Russia",
        isLookalike: true,
        lookalikeBrand: "Microsoft (microsoft.com)",
        lookalikeSimilarity: 0.94,
        lookalikeReason: "Punycode/homoglyph attack replacing 'o' with '0'.",
        dmarcPolicy: "none",
        isDnsValid: true
      }
    ],

    ipIntelligence: [
      {
        ip: "194.26.29.84",
        threatScore: 96,
        asn: "AS57523",
        organization: "VDSina Hosting LLC",
        country: "Russia",
        countryCode: "RU",
        city: "Moscow",
        region: "Moscow",
        latitude: 55.7558,
        longitude: 37.6173,
        reverseDns: "194.26.29.84.vdsina.ru",
        isHosting: true,
        isVpnOrProxy: false,
        isTorExit: false,
        isKnownAbuser: true,
        abuseReportsCount: 88,
        lastReportedDate: "2026-08-26",
        relatedDomains: ["micros0ft-security-portal.com", "login-microsoft-auth2.com"]
      }
    ]
  },

  {
    id: "eml_ransomware_inv_003",
    analysisId: "anl_rns_7721",
    createdAt: "2026-08-25T18:40:00Z",
    filename: "Overdue_Invoice_INV-982103_FINAL_NOTICE.eml",
    rawSize: 459000,
    classification: "malware_delivery",
    riskScore: 99,
    severity: "critical",
    confidence: 0.99,
    recommendation: "Block attachment hash at EDR, isolate any workstation that opened attachment, submit sample to malware sandbox.",
    executiveSummary: "Malicious email delivering LockBit/BlackCat ransomware staging loader hidden in a password-protected zip file (INV-982103_Statement.vbs.zip) with polyglot VBScript dropping a second-stage Cobalt Strike beacon.",
    status: "QUARANTINED",
    tags: ["Ransomware", "Malware Delivery", "LockBit Loader", "VBS Dropper", "Weaponized ZIP"],
    sha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    caseId: "CASE-2026-0035",
    caseTitle: "Campaign BlackByte: Weaponized Invoice Malspam",
    assignedAnalyst: "Marcus Chen (Threat Researcher)",

    headers: {
      from: '"Global Logistics Billing" <billing@freight-invoicing-system.top>',
      fromName: "Global Logistics Billing",
      fromAddress: "billing@freight-invoicing-system.top",
      to: ["Accounts Payable <ap@acmeworks.com>"],
      subject: "FINAL DEMAND: Outstanding Balance Invoice INV-982103 Legal Action Notice",
      date: "Tue, 25 Aug 2026 18:39:10 +0000",
      messageId: "<20260825183910.MAL_9821@freight-invoicing-system.top>",
      allHeaders: {
        "Received": "from relay.bulletproof-host.is (185.220.101.5) by mx1.acmeworks.com; Tue, 25 Aug 2026 18:39:45 +0000",
        "From": '"Global Logistics Billing" <billing@freight-invoicing-system.top>',
        "To": "Accounts Payable <ap@acmeworks.com>",
        "Subject": "FINAL DEMAND: Outstanding Balance Invoice INV-982103 Legal Action Notice",
        "Date": "Tue, 25 Aug 2026 18:39:10 +0000",
        "Message-ID": "<20260825183910.MAL_9821@freight-invoicing-system.top>",
        "X-Originating-IP": "[185.220.101.5]"
      }
    },

    bodyText: `Attention Accounts Payable,

Our records indicate that invoice INV-982103 for $34,810.00 is now 60 days past due. Continued non-payment will result in immediate escalation to collections and judicial enforcement.

Please review the attached certified PDF statement and remittance slip enclosed in the encrypted archive (Password: invoice2026) and confirm payment dispatch immediately.

Global Logistics Invoicing Department`,

    bodyHtml: `<div style="font-family: Arial, sans-serif; color: #111;">
<h3 style="color: #b91c1c;">FINAL DEMAND NOTICE</h3>
<p>Our records indicate that invoice <strong>INV-982103</strong> for <strong>$34,810.00</strong> is 60 days past due.</p>
<p>Review the attached statement archive (<strong>Password: invoice2026</strong>) and confirm remittance today.</p>
</div>`,
    hasHtml: true,
    attachments: [
      {
        id: "att_r01",
        filename: "Invoice_Statement_INV982103.vbs.zip",
        filesize: 348200,
        contentType: "application/zip",
        md5: "8b1a9953c4611296a827abf8c47804d7",
        sha256: "7d8f9e0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e",
        malicious: true,
        threatScore: 99,
        verdict: "Cobalt Strike Stage-1 VBScript dropper with anti-sandbox evasion",
        entropy: 7.96
      }
    ],

    findings: [
      {
        id: "fnd_r01",
        category: "Malware Attachment",
        severity: "critical",
        title: "Encrypted ZIP Container with Double Extension VBS Script",
        explanation: "Attachment 'Invoice_Statement_INV982103.vbs.zip' uses password protection to bypass gateway scanners and unpacks a weaponized Visual Basic script dropper.",
        evidenceRefs: ["Attachment.Invoice_Statement_INV982103.vbs.zip"],
        mitreTechnique: "T1027.001 - Binary Padding / Encrypted Payloads",
        confidence: 0.99
      },
      {
        id: "fnd_r02",
        category: "Infrastructure Threat",
        severity: "critical",
        title: "Tor Exit Node & Bulletproof Server Origin",
        explanation: "Origin server IP 185.220.101.5 is a known Tor exit relay operated by darknet malspam affiliate networks.",
        evidenceRefs: ["Relay.Hop_1", "IP.185.220.101.5"],
        mitreTechnique: "T1090.003 - Multi-hop Proxy: Tor",
        confidence: 0.98
      }
    ],

    authentication: {
      spf: "fail",
      dkim: "none",
      dmarc: "fail",
      alignment: "fail",
      spfDetails: "fail: IP 185.220.101.5 is unauthorized",
      dkimDetails: "none",
      dmarcDetails: "fail: sender domain lacks valid DMARC policy"
    },

    relayPath: [
      {
        id: "hop_r1",
        hopNumber: 1,
        fromHost: "tor-exit-node-05.is",
        byHost: "relay.bulletproof-host.is",
        ip: "185.220.101.5",
        timestamp: "2026-08-25T18:39:10Z",
        delaySeconds: 0,
        protocol: "ESMTP",
        country: "Iceland",
        countryCode: "IS",
        region: "Capital Region",
        city: "Reykjavik",
        isp: "Flokinet ehf.",
        asn: "AS200651 (FLOKINET)",
        reverseDns: "tor-exit.flokinet.is",
        latitude: 64.1466,
        longitude: -21.9426,
        anomaly: true,
        anomalyReason: "Origin server is a flagged Tor Exit node in Iceland.",
        isOrigin: true,
        confidence: "High"
      },
      {
        id: "hop_r2",
        hopNumber: 2,
        fromHost: "relay.bulletproof-host.is",
        byHost: "mx1.acmeworks.com",
        ip: "208.76.104.14",
        timestamp: "2026-08-25T18:39:45Z",
        delaySeconds: 35,
        protocol: "ESMTPS",
        country: "United States",
        countryCode: "US",
        region: "Virginia",
        city: "Ashburn",
        isp: "AWS",
        asn: "AS16509",
        latitude: 39.0438,
        longitude: -77.4874,
        isDestination: true,
        confidence: "High"
      }
    ],

    origin: {
      ip: "185.220.101.5",
      country: "Iceland",
      city: "Reykjavik",
      region: "Capital Region",
      isp: "Flokinet ehf.",
      asn: "AS200651",
      latitude: 64.1466,
      longitude: -21.9426,
      confidence: "High",
      isEstimated: false,
      proxyOrVpn: true
    },

    iocs: [
      {
        id: "ioc_r1",
        type: "hash",
        value: "7d8f9e0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e",
        category: "Ransomware Loader SHA-256",
        riskScore: 99,
        malicious: true,
        firstSeen: "2026-08-25",
        reputationSource: "VirusTotal (68/72 engines)",
        context: "LockBit 3.0 initial stage VBScript dropper.",
        inEvidence: true
      },
      {
        id: "ioc_r2",
        type: "ip",
        value: "185.220.101.5",
        category: "Tor Exit Relay / C2",
        riskScore: 98,
        malicious: true,
        firstSeen: "2026-05-10",
        reputationSource: "Tor Project / AlienVault OTX",
        inEvidence: true
      },
      {
        id: "ioc_r3",
        type: "domain",
        value: "freight-invoicing-system.top",
        category: "Malicious Staging Domain",
        riskScore: 94,
        malicious: true,
        firstSeen: "2026-08-25",
        reputationSource: "Spamhaus DBL",
        inEvidence: true
      }
    ],

    domainIntelligence: [
      {
        domain: "freight-invoicing-system.top",
        riskScore: 94,
        domainAgeDays: 1,
        createdDate: "2026-08-25T01:00:00Z",
        expiryDate: "2027-08-25T01:00:00Z",
        registrar: "NiceNIC International Group Co., Ltd.",
        nameservers: ["ns1.bulletproof-dns.net", "ns2.bulletproof-dns.net"],
        mxRecords: ["10 relay.bulletproof-host.is"],
        aRecords: ["185.220.101.5"],
        txtRecords: [],
        asn: "AS200651",
        hostingProvider: "Flokinet Iceland",
        country: "Iceland",
        isLookalike: false,
        isDnsValid: true
      }
    ],

    ipIntelligence: [
      {
        ip: "185.220.101.5",
        threatScore: 98,
        asn: "AS200651",
        organization: "Flokinet ehf.",
        country: "Iceland",
        countryCode: "IS",
        city: "Reykjavik",
        region: "Capital Region",
        latitude: 64.1466,
        longitude: -21.9426,
        reverseDns: "tor-exit.flokinet.is",
        isHosting: true,
        isVpnOrProxy: true,
        isTorExit: true,
        isKnownAbuser: true,
        abuseReportsCount: 312,
        lastReportedDate: "2026-08-25",
        relatedDomains: ["freight-invoicing-system.top"]
      }
    ]
  },

  {
    id: "eml_dhl_spoof_004",
    analysisId: "anl_dhl_1109",
    createdAt: "2026-08-25T09:20:00Z",
    filename: "DHL_Express_Delivery_Exception_Shipment_Hold.eml",
    rawSize: 14200,
    classification: "impersonation",
    riskScore: 84,
    severity: "high",
    confidence: 0.93,
    recommendation: "Block sender domain, sinkhole tracking redirect URL, alert logistics department.",
    executiveSummary: "Brand impersonation campaign mimicking DHL Express package delivery notification using lookalike domain (dhl-express-tracking-delivery.info) and redirecting to a payment credential phishing page asking for a $2.95 customs release fee.",
    status: "IN_REVIEW",
    tags: ["Brand Impersonation", "DHL Spoofing", "Customs Fee Scam", "Payment Phishing"],
    sha256: "b1a2c3d4e5f60718293a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e",
    caseId: "CASE-2026-0031",
    caseTitle: "Campaign DeliveryTrap: Logistics Phishing",
    assignedAnalyst: "Alex Mercer",

    headers: {
      from: '"DHL Express Notification" <track-parcel@dhl-express-tracking-delivery.info>',
      fromName: "DHL Express Notification",
      fromAddress: "track-parcel@dhl-express-tracking-delivery.info",
      to: ["Logistics Team <shipping@acmeworks.com>"],
      subject: "Shipment #DHL-894021-US: Delivery On Hold - Address Verification Required",
      date: "Tue, 25 Aug 2026 09:19:30 +0000",
      messageId: "<DHL-PARCEL-894021@dhl-express-tracking-delivery.info>",
      allHeaders: {
        "Received": "from srv-nl-relay.transip.net (149.210.198.42) by mx1.acmeworks.com; Tue, 25 Aug 2026 09:19:50 +0000",
        "From": '"DHL Express Notification" <track-parcel@dhl-express-tracking-delivery.info>',
        "To": "Logistics Team <shipping@acmeworks.com>",
        "Subject": "Shipment #DHL-894021-US: Delivery On Hold - Address Verification Required",
        "Date": "Tue, 25 Aug 2026 09:19:30 +0000",
        "Message-ID": "<DHL-PARCEL-894021@dhl-express-tracking-delivery.info>"
      }
    },

    bodyText: `DHL Express Shipment Update

Your parcel #DHL-894021-US could not be delivered on 25 August 2026 due to an incomplete delivery address and an outstanding customs clearance duty of $2.95 USD.

To update your address and schedule redelivery within 48 hours:
https://dhl-express-tracking-delivery.info/portal/redelivery?tracking=DHL-894021-US

Packages not claimed within 48 hours will be returned to the sender.

Deutsche Post DHL Group`,

    bodyHtml: `<div style="font-family: Arial, sans-serif; color: #333; max-width: 500px; padding: 20px; border: 1px solid #ffcc00; border-radius: 6px;">
  <div style="background: #ffcc00; color: #d40511; font-weight: 900; font-size: 22px; padding: 10px 16px; margin: -20px -20px 20px -20px;">DHL EXPRESS</div>
  <p><strong>Tracking Number: DHL-894021-US</strong></p>
  <p>Your international shipment is currently held at our regional sorting hub due to unpaid customs duties ($2.95).</p>
  <div style="margin: 20px 0; text-align: center;">
    <a href="https://dhl-express-tracking-delivery.info/portal/redelivery?tracking=DHL-894021-US" style="background: #d40511; color: #fff; text-decoration: none; padding: 10px 20px; font-weight: bold; border-radius: 4px; display: inline-block;">Update Address & Pay Fee</a>
  </div>
</div>`,
    hasHtml: true,
    attachments: [],

    findings: [
      {
        id: "fnd_d01",
        category: "Brand Impersonation",
        severity: "high",
        title: "Impersonation of DHL Express Logistics Brand",
        explanation: "The domain 'dhl-express-tracking-delivery.info' is not affiliated with DHL Group (dhl.com).",
        evidenceRefs: ["Header.From", "Domain.dhl-express-tracking-delivery.info"],
        mitreTechnique: "T1566.002",
        confidence: 0.96
      },
      {
        id: "fnd_d02",
        category: "Phishing Lure",
        severity: "high",
        title: "Micro-Fee Customs Clearance Payment Lure",
        explanation: "Uses a trivial $2.95 fee request to entice victims into submitting credit card and CVV information.",
        evidenceRefs: ["Body.Text"],
        confidence: 0.94
      }
    ],

    authentication: {
      spf: "fail",
      dkim: "none",
      dmarc: "fail",
      alignment: "fail"
    },

    relayPath: [
      {
        id: "hop_d1",
        hopNumber: 1,
        fromHost: "srv-nl-relay.transip.net",
        byHost: "mx1.acmeworks.com",
        ip: "149.210.198.42",
        timestamp: "2026-08-25T09:19:30Z",
        delaySeconds: 20,
        protocol: "ESMTPS",
        country: "Netherlands",
        countryCode: "NL",
        region: "South Holland",
        city: "Rotterdam",
        isp: "TransIP B.V.",
        asn: "AS42708",
        latitude: 51.9244,
        longitude: 4.4777,
        isOrigin: true,
        confidence: "High"
      }
    ],

    origin: {
      ip: "149.210.198.42",
      country: "Netherlands",
      city: "Rotterdam",
      region: "South Holland",
      isp: "TransIP B.V.",
      asn: "AS42708",
      latitude: 51.9244,
      longitude: 4.4777,
      confidence: "High",
      isEstimated: false,
      proxyOrVpn: false
    },

    iocs: [
      {
        id: "ioc_d1",
        type: "domain",
        value: "dhl-express-tracking-delivery.info",
        category: "Impersonation Domain",
        riskScore: 88,
        malicious: true,
        inEvidence: true
      },
      {
        id: "ioc_d2",
        type: "ip",
        value: "149.210.198.42",
        category: "Hosting IP",
        riskScore: 78,
        malicious: true,
        inEvidence: true
      }
    ],

    domainIntelligence: [
      {
        domain: "dhl-express-tracking-delivery.info",
        riskScore: 88,
        domainAgeDays: 6,
        createdDate: "2026-08-20T08:00:00Z",
        expiryDate: "2027-08-20T08:00:00Z",
        registrar: "Key-Systems GmbH",
        nameservers: ["ns1.transip.net", "ns2.transip.net"],
        mxRecords: ["10 srv-nl-relay.transip.net"],
        aRecords: ["149.210.198.42"],
        txtRecords: [],
        asn: "AS42708",
        hostingProvider: "TransIP Netherlands",
        country: "Netherlands",
        isLookalike: true,
        lookalikeBrand: "DHL Express (dhl.com)",
        lookalikeSimilarity: 0.82,
        lookalikeReason: "Keyword stuffing with official brand name in third-level domain.",
        isDnsValid: true
      }
    ],

    ipIntelligence: [
      {
        ip: "149.210.198.42",
        threatScore: 78,
        asn: "AS42708",
        organization: "TransIP B.V.",
        country: "Netherlands",
        countryCode: "NL",
        city: "Rotterdam",
        region: "South Holland",
        latitude: 51.9244,
        longitude: 4.4777,
        reverseDns: "149.210.198.42.transip.net",
        isHosting: true,
        isVpnOrProxy: false,
        isTorExit: false,
        isKnownAbuser: false,
        abuseReportsCount: 9,
        relatedDomains: ["dhl-express-tracking-delivery.info"]
      }
    ]
  },

  {
    id: "eml_google_legit_005",
    analysisId: "anl_goog_8001",
    createdAt: "2026-08-26T10:00:00Z",
    filename: "Google_Cloud_Monthly_Security_Report.eml",
    rawSize: 19800,
    classification: "legitimate",
    riskScore: 4,
    severity: "low",
    confidence: 0.99,
    recommendation: "Allow message delivery. All cryptographic signatures and SPF/DKIM/DMARC alignments verified.",
    executiveSummary: "Authentic automated security notification from Google Cloud Platform. Verified 2048-bit RSA DKIM signature from google.com, valid SPF pass from Google infrastructure (AS15169), and aligned strict DMARC policy.",
    status: "RESOLVED",
    tags: ["Legitimate", "DKIM Verified", "SPF Passed", "DMARC Aligned", "Google Cloud"],
    sha256: "9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e",

    headers: {
      from: '"Google Cloud Platform" <google-cloud-security@google.com>',
      fromName: "Google Cloud Platform",
      fromAddress: "google-cloud-security@google.com",
      to: ["Cloud Admin <cloud-ops@acmeworks.com>"],
      subject: "Monthly Security & Compliance Digest: Project Acme-Production-US",
      date: "Wed, 26 Aug 2026 09:59:12 +0000",
      messageId: "<google-gcp-sec-20260826095912.890@mail.google.com>",
      allHeaders: {
        "Received": "from mail-qk4-f182.google.com (209.85.222.182) by mx1.acmeworks.com with ESMTPS id gcp_legit_01; Wed, 26 Aug 2026 09:59:20 +0000",
        "Authentication-Results": "mx1.acmeworks.com; dkim=pass header.i=@google.com header.s=20230601; spf=pass (209.85.222.182 is designated IP) smtp.mailfrom=3g89@gaia.bounces.google.com; dmarc=pass (p=reject dis=none) header.from=google.com",
        "DKIM-Signature": "v=1; a=rsa-sha256; c=relaxed/relaxed; d=google.com; s=20230601; h=mime-version:date:message-id:subject:from:to; bh=s8f...; b=Q8x...",
        "From": '"Google Cloud Platform" <google-cloud-security@google.com>',
        "To": "Cloud Admin <cloud-ops@acmeworks.com>",
        "Subject": "Monthly Security & Compliance Digest: Project Acme-Production-US",
        "Date": "Wed, 26 Aug 2026 09:59:12 +0000"
      }
    },

    bodyText: `Google Cloud Security Digest

Hello Cloud Administrator,

Your monthly security summary for project Acme-Production-US is now available in Google Cloud Console.

Summary:
- 0 Critical vulnerabilities detected in Cloud Armor policies
- 100% Identity-Aware Proxy (IAP) enforcement
- Key rotation completed on 14 service accounts

View full audit log in Cloud Console: https://console.cloud.google.com/security/overview

Google LLC, 1600 Amphitheatre Parkway, Mountain View, CA 94043`,

    bodyHtml: `<div style="font-family: Roboto, Arial, sans-serif; color: #202124; max-width: 560px; padding: 24px; border: 1px solid #e0e0e0; border-radius: 8px;">
  <h2 style="color: #1a73e8; margin-top: 0;">Google Cloud</h2>
  <h3>Monthly Security &amp; Compliance Digest</h3>
  <p>Your monthly security summary for <strong>Acme-Production-US</strong> is ready.</p>
  <ul>
    <li>0 Critical vulnerabilities in Cloud Armor</li>
    <li>100% Identity-Aware Proxy enforcement</li>
    <li>Key rotation completed for all service accounts</li>
  </ul>
  <p style="text-align: center; margin-top: 24px;">
    <a href="https://console.cloud.google.com/security/overview" style="background: #1a73e8; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: 500;">Open Cloud Console</a>
  </p>
</div>`,
    hasHtml: true,
    attachments: [],

    findings: [
      {
        id: "fnd_g01",
        category: "Cryptographic Verification",
        severity: "low",
        title: "Valid DKIM & Strict DMARC Alignment Passed",
        explanation: "Cryptographic signature matches Google's public key (selector 20230601). Sender IP is authorized by Google SPF policy.",
        evidenceRefs: ["Auth.DKIM", "Auth.SPF", "Auth.DMARC"],
        confidence: 0.99
      }
    ],

    authentication: {
      spf: "pass",
      dkim: "pass",
      dmarc: "pass",
      alignment: "pass",
      spfDetails: "pass: IP 209.85.222.182 is authorized in v=spf1 include:_spf.google.com ~all",
      dkimDetails: "pass: valid 2048-bit RSA signature for domain google.com",
      dmarcDetails: "pass: strict p=reject policy fully aligned",
      alignmentDetails: "Aligned: Header.From matches DKIM signature domain",
      rawAuthResults: "mx1.acmeworks.com; dkim=pass header.i=@google.com; spf=pass; dmarc=pass header.from=google.com"
    },

    relayPath: [
      {
        id: "hop_g1",
        hopNumber: 1,
        fromHost: "mail-qk4-f182.google.com",
        byHost: "mx1.acmeworks.com",
        ip: "209.85.222.182",
        timestamp: "2026-08-26T09:59:12Z",
        delaySeconds: 8,
        protocol: "ESMTPS",
        tlsVersion: "TLS 1.3",
        country: "United States",
        countryCode: "US",
        region: "California",
        city: "Mountain View",
        isp: "Google LLC",
        asn: "AS15169 (GOOGLE)",
        reverseDns: "mail-qk4-f182.google.com",
        latitude: 37.3861,
        longitude: -122.0839,
        isOrigin: true,
        confidence: "High"
      }
    ],

    origin: {
      ip: "209.85.222.182",
      country: "United States",
      city: "Mountain View",
      region: "California",
      isp: "Google LLC",
      asn: "AS15169",
      latitude: 37.3861,
      longitude: -122.0839,
      confidence: "High",
      isEstimated: false,
      proxyOrVpn: false
    },

    iocs: [
      {
        id: "ioc_g1",
        type: "domain",
        value: "google.com",
        category: "Legitimate Enterprise Domain",
        riskScore: 0,
        malicious: false
      }
    ],

    domainIntelligence: [
      {
        domain: "google.com",
        riskScore: 0,
        domainAgeDays: 10500,
        createdDate: "1997-09-15T04:00:00Z",
        expiryDate: "2028-09-14T04:00:00Z",
        registrar: "MarkMonitor Inc.",
        nameservers: ["ns1.google.com", "ns2.google.com"],
        mxRecords: ["10 smtp.google.com"],
        aRecords: ["142.250.190.46"],
        txtRecords: ["v=spf1 include:_spf.google.com ~all"],
        asn: "AS15169",
        hostingProvider: "Google Cloud Infrastructure",
        country: "United States",
        isLookalike: false,
        isDnsValid: true
      }
    ],

    ipIntelligence: [
      {
        ip: "209.85.222.182",
        threatScore: 0,
        asn: "AS15169",
        organization: "Google LLC",
        country: "United States",
        countryCode: "US",
        city: "Mountain View",
        region: "California",
        latitude: 37.3861,
        longitude: -122.0839,
        reverseDns: "mail-qk4-f182.google.com",
        isHosting: true,
        isVpnOrProxy: false,
        isTorExit: false,
        isKnownAbuser: false,
        abuseReportsCount: 0,
        relatedDomains: ["google.com", "gmail.com"]
      }
    ]
  }
];
