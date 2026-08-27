import { InvestigationCase, CampaignGraphData } from "@/types/investigation";

export const MOCK_CASES: InvestigationCase[] = [
  {
    id: "CASE-2026-0041",
    caseNumber: "CASE-2026-0041",
    title: "Operation Executive Phantom: C-Suite BEC Campaign",
    description: "Targeted spear-phishing and Business Email Compromise campaign targeting corporate finance executives via spoofed CEO identity and fraudulent offshore escrow wiring requests.",
    status: "OPEN",
    severity: "critical",
    primaryClassification: "business_email_compromise",
    leadAnalyst: "Alex Mercer",
    assignedTeam: "Tier 3 Incident Response",
    createdAt: "2026-08-26T14:35:00Z",
    updatedAt: "2026-08-26T15:10:00Z",
    targetVictims: ["Sarah Jenkins <sjenkins@acmeworks.com>", "Mark Thorne <mthorne@acmeworks.com>"],
    campaignName: "Executive Phantom",
    mitreAttckIds: ["T1566.002", "T1071.003", "T1583.003", "T1598"],
    tags: ["Active BEC", "Wire Fraud", "Lookalike Domain", "Priority-1"],
    emailIds: ["eml_bec_wire_001"],
    
    evidence: [
      {
        id: "EVD-2026-091",
        caseId: "CASE-2026-0041",
        type: "RAW_EMAIL",
        name: "URGENT_CONFIDENTIAL_Acquisition_Wire_Transfer.eml",
        description: "Original raw RFC 822 email payload preserved from mail gateway inbox.",
        sha256: "8e9b2c3a5d7e1f4092b6a839c01824b2190f845d82910faecb7189104fa289c1",
        collectedAt: "2026-08-26T14:32:00Z",
        collectedBy: "Automated SOC Ingestion Gateway",
        integrityStatus: "VERIFIED",
        storageRef: "s3://forensic-vault-us-east/evidence/2026/08/26/eml_bec_wire_001.eml",
        fileSizeBytes: 18450
      },
      {
        id: "EVD-2026-092",
        caseId: "CASE-2026-0041",
        type: "ATTACHMENT",
        name: "M&A_Escrow_Wiring_Invoice_Signed.pdf",
        description: "Fraudulent wiring instruction document with forged corporate letterhead.",
        sha256: "3f98c8942a1bc7e1082736481029384756192837465102938475610293847561",
        collectedAt: "2026-08-26T14:33:10Z",
        collectedBy: "Alex Mercer",
        integrityStatus: "VERIFIED",
        storageRef: "s3://forensic-vault-us-east/evidence/2026/08/26/att_001.pdf",
        fileSizeBytes: 142800
      }
    ],

    timeline: [
      {
        id: "tl_01",
        timestamp: "2026-08-26T14:31:55Z",
        type: "DETECTION",
        actor: "Email Threat Gateway",
        title: "High-Risk Threat Ingestion",
        details: "Email from 'jvance@acme-corp-holdings.co' flagged with Risk Score 96 (Critical BEC)."
      },
      {
        id: "tl_02",
        timestamp: "2026-08-26T14:35:00Z",
        type: "CASE_CREATED",
        actor: "Alex Mercer",
        title: "Investigation Case Opened",
        details: "Escalated to P1 Incident Response due to CEO identity impersonation and $485,000 wire target."
      },
      {
        id: "tl_03",
        timestamp: "2026-08-26T14:45:00Z",
        type: "EVIDENCE_ADDED",
        actor: "Alex Mercer",
        title: "Evidence Integrity Hash Verified",
        details: "Cryptographic SHA-256 seal generated for raw message and attached fraudulent PDF."
      }
    ],

    iocs: [
      {
        id: "ioc_c1",
        type: "ip",
        value: "102.89.41.118",
        category: "Originating Source IP",
        riskScore: 94,
        malicious: true,
        inEvidence: true
      },
      {
        id: "ioc_c2",
        type: "domain",
        value: "acme-corp-holdings.co",
        category: "Lookalike Domain",
        riskScore: 98,
        malicious: true,
        inEvidence: true
      },
      {
        id: "ioc_c3",
        type: "email",
        value: "director.board.jvance@gmail.com",
        category: "Exfiltration Reply-To",
        riskScore: 90,
        malicious: true,
        inEvidence: true
      }
    ],

    analystNotes: [
      {
        id: "note_01",
        author: "Alex Mercer",
        createdAt: "2026-08-26T14:50:00Z",
        content: "Verified with CEO Jonathan Vance in person: no acquisition of 'Project Keystone' is taking place. Confirmed malicious BEC attempt. Notified VP Finance Sarah Jenkins. Initiating domain takedown request to NameCheap abuse desk."
      }
    ]
  },

  {
    id: "CASE-2026-0038",
    caseNumber: "CASE-2026-0038",
    title: "EvilProxy AiTM M365 Credential Harvesting",
    description: "Reverse-proxy adversary-in-the-middle phishing attack bypassing FIDO/MFA prompts for Microsoft 365 enterprise logins.",
    status: "IN_PROGRESS",
    severity: "critical",
    primaryClassification: "phishing",
    leadAnalyst: "Elena Rostova",
    assignedTeam: "SOC Tier 2",
    createdAt: "2026-08-26T11:20:00Z",
    updatedAt: "2026-08-26T13:40:00Z",
    targetVictims: ["David Miller <dmiller@acmeworks.com>"],
    campaignName: "EvilProxy Cluster 14",
    mitreAttckIds: ["T1566.002", "T1556"],
    tags: ["AiTM", "MFA Bypass", "Phishing", "EvilProxy"],
    emailIds: ["eml_m365_phish_002"],
    
    evidence: [
      {
        id: "EVD-2026-088",
        caseId: "CASE-2026-0038",
        type: "RAW_EMAIL",
        name: "Microsoft_365_Security_Critical_Action_Required.eml",
        description: "AiTM phishing email with homoglyph domain.",
        sha256: "4a2f8c19e5b0213d7890fa1827364b5c6d7e8f901a2b3c4d5e6f7a8b9c0d1e2f",
        collectedAt: "2026-08-26T11:15:00Z",
        collectedBy: "Elena Rostova",
        integrityStatus: "VERIFIED",
        storageRef: "s3://forensic-vault-us-east/evidence/2026/08/26/eml_m365_phish_002.eml",
        fileSizeBytes: 22100
      }
    ],

    timeline: [
      {
        id: "tl_04",
        timestamp: "2026-08-26T11:14:30Z",
        type: "DETECTION",
        actor: "Email Threat Gateway",
        title: "Credential Phish Intercepted",
        details: "M365 impersonation lure with punycode domain blocked."
      }
    ],

    iocs: [
      {
        id: "ioc_c4",
        type: "domain",
        value: "micros0ft-security-portal.com",
        category: "Lookalike Domain",
        riskScore: 98,
        malicious: true,
        inEvidence: true
      },
      {
        id: "ioc_c5",
        type: "ip",
        value: "194.26.29.84",
        category: "EvilProxy C2 Node",
        riskScore: 96,
        malicious: true,
        inEvidence: true
      }
    ],

    analystNotes: [
      {
        id: "note_02",
        author: "Elena Rostova",
        createdAt: "2026-08-26T12:00:00Z",
        content: "Blocked domain on Palo Alto perimeter firewalls and Zscaler proxy. Verified user David Miller did not enter credentials."
      }
    ]
  },

  {
    id: "CASE-2026-0035",
    caseNumber: "CASE-2026-0035",
    title: "Campaign BlackByte: Weaponized Invoice Malspam",
    description: "Malicious malspam distribution of encrypted ZIP archives containing VBScript droppers delivering LockBit ransomware.",
    status: "CONTAINED",
    severity: "critical",
    primaryClassification: "malware_delivery",
    leadAnalyst: "Marcus Chen",
    assignedTeam: "Malware Lab",
    createdAt: "2026-08-25T18:45:00Z",
    updatedAt: "2026-08-26T09:15:00Z",
    targetVictims: ["ap@acmeworks.com"],
    campaignName: "BlackByte Invoicing",
    mitreAttckIds: ["T1027.001", "T1090.003"],
    tags: ["LockBit", "Ransomware", "Malware", "Contained"],
    emailIds: ["eml_ransomware_inv_003"],
    evidence: [],
    timeline: [],
    iocs: [],
    analystNotes: []
  }
];

export const MOCK_CAMPAIGN_GRAPH: CampaignGraphData = {
  campaignId: "CAMP-PHANTOM-2026",
  campaignName: "Operation Executive Phantom (BEC Cluster)",
  threatActor: "UNC-3891 (West African Cyber Syndicate)",
  firstSeen: "2026-08-10",
  lastSeen: "2026-08-26",
  confidence: "High",
  nodes: [
    {
      id: "camp_root",
      type: "campaign",
      label: "Campaign: Executive Phantom",
      sublabel: "Threat Actor UNC-3891",
      riskScore: 98,
      severity: "critical"
    },
    {
      id: "node_dom1",
      type: "domain",
      label: "acme-corp-holdings.co",
      sublabel: "Registered: 3 days ago",
      riskScore: 98,
      severity: "critical"
    },
    {
      id: "node_dom2",
      type: "domain",
      label: "secure-transfer-auth.com",
      sublabel: "Phishing Infrastructure",
      riskScore: 92,
      severity: "high"
    },
    {
      id: "node_ip1",
      type: "ip",
      label: "102.89.41.118",
      sublabel: "Lagos, Nigeria (MTN)",
      riskScore: 94,
      severity: "critical"
    },
    {
      id: "node_ip2",
      type: "ip",
      label: "185.107.56.202",
      sublabel: "Amsterdam VPS Relay",
      riskScore: 82,
      severity: "high"
    },
    {
      id: "node_email1",
      type: "email",
      label: "URGENT M&A Wire",
      sublabel: "Target: Sarah Jenkins",
      riskScore: 96,
      severity: "critical"
    },
    {
      id: "node_email2",
      type: "email",
      label: "Quarterly Audit Escrow",
      sublabel: "Target: Mark Thorne",
      riskScore: 89,
      severity: "high"
    },
    {
      id: "node_mal1",
      type: "malware",
      label: "M&A_Escrow_Wiring.pdf",
      sublabel: "Weaponized PDF (Fraud Info)",
      riskScore: 88,
      severity: "high"
    }
  ],
  edges: [
    {
      id: "e1",
      source: "camp_root",
      target: "node_dom1",
      relationType: "HOSTED_ON",
      label: "Uses Domain"
    },
    {
      id: "e2",
      source: "camp_root",
      target: "node_dom2",
      relationType: "HOSTED_ON",
      label: "Secondary Asset"
    },
    {
      id: "e3",
      source: "node_dom1",
      target: "node_ip2",
      relationType: "HOSTED_ON",
      label: "Resolves To (A Record)"
    },
    {
      id: "e4",
      source: "node_ip1",
      target: "node_dom1",
      relationType: "SENDS_FROM",
      label: "Originates SMTP"
    },
    {
      id: "e5",
      source: "node_dom1",
      target: "node_email1",
      relationType: "SPOOFS",
      label: "Sender Domain"
    },
    {
      id: "e6",
      source: "node_dom1",
      target: "node_email2",
      relationType: "SPOOFS",
      label: "Sender Domain"
    },
    {
      id: "e7",
      source: "node_email1",
      target: "node_mal1",
      relationType: "DROPS_PAYLOAD",
      label: "Delivers Attachment"
    }
  ]
};
