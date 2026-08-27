import {
  ThreatClassification,
  Severity,
  ThreatFinding,
  AuthenticationResult,
  RelayHop,
  IocItem,
  DomainIntelligence,
  IpIntelligence,
  EmailAttachment,
} from "./threat";

export interface EmailHeaders {
  from: string;
  fromName?: string;
  fromAddress: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  replyTo?: string;
  returnPath?: string;
  subject: string;
  date: string;
  messageId: string;
  mimeVersion?: string;
  contentType?: string;
  xMailer?: string;
  xOriginatingIp?: string;
  allHeaders: Record<string, string>;
}

export interface EmailAnalysis {
  id: string;
  analysisId: string;
  createdAt: string;
  filename?: string;
  rawSize: number;
  
  // Executive Summary & Classification
  classification: ThreatClassification;
  riskScore: number; // 0 - 100
  severity: Severity;
  confidence: number; // 0.0 - 1.0
  recommendation: string;
  executiveSummary: string;
  
  // Identities & Content
  headers: EmailHeaders;
  bodyText: string;
  bodyHtml?: string;
  hasHtml: boolean;
  attachments: EmailAttachment[];
  
  // Deep Forensic Intelligence
  findings: ThreatFinding[];
  authentication: AuthenticationResult;
  relayPath: RelayHop[];
  origin: {
    ip: string;
    country: string;
    city: string;
    region: string;
    isp: string;
    asn: string;
    latitude: number;
    longitude: number;
    confidence: "High" | "Medium" | "Low";
    isEstimated: boolean;
    proxyOrVpn: boolean;
  };
  
  // Extracted IOCs & Infrastructure Intel
  iocs: IocItem[];
  domainIntelligence: DomainIntelligence[];
  ipIntelligence: IpIntelligence[];
  
  // Case / Assignment
  caseId?: string;
  caseTitle?: string;
  assignedAnalyst?: string;
  status: "NEW" | "IN_REVIEW" | "ESCALATED" | "QUARANTINED" | "RESOLVED";
  tags: string[];
  sha256: string;
}
