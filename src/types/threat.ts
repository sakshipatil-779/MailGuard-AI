export type ThreatClassification =
  | "legitimate"
  | "suspicious"
  | "phishing"
  | "impersonation"
  | "business_email_compromise"
  | "financial_fraud"
  | "malware_delivery"
  | "credential_harvesting"
  | "spoofing"
  | "unknown";

export type Severity = "low" | "medium" | "high" | "critical";

export type UserRole =
  | "ADMIN"
  | "SECURITY_ANALYST"
  | "INVESTIGATOR"
  | "AUDITOR"
  | "VIEWER";

export interface ThreatFinding {
  id: string;
  category: string;
  severity: Severity;
  title: string;
  explanation: string;
  evidenceRefs: string[];
  mitreTechnique?: string;
  confidence: number;
}

export interface AuthenticationResult {
  spf: "pass" | "fail" | "neutral" | "none" | "unknown";
  dkim: "pass" | "fail" | "none" | "unknown";
  dmarc: "pass" | "fail" | "none" | "unknown";
  alignment: "pass" | "fail" | "unknown";
  spfDetails?: string;
  dkimDetails?: string;
  dmarcDetails?: string;
  alignmentDetails?: string;
  rawAuthResults?: string;
}

export interface RelayHop {
  id: string;
  hopNumber: number;
  fromHost: string;
  byHost: string;
  ip: string;
  timestamp: string;
  delaySeconds: number;
  protocol: string;
  tlsVersion?: string;
  country: string;
  countryCode: string;
  region: string;
  city: string;
  isp: string;
  asn: string;
  reverseDns?: string;
  latitude: number;
  longitude: number;
  anomaly?: boolean;
  anomalyReason?: string;
  isOrigin?: boolean;
  isDestination?: boolean;
  confidence: "High" | "Medium" | "Low";
}

export interface IocItem {
  id: string;
  type: "ip" | "domain" | "url" | "email" | "hash" | "asn" | "file";
  value: string;
  category: string;
  riskScore: number;
  malicious: boolean;
  firstSeen?: string;
  reputationSource?: string;
  context?: string;
  inEvidence?: boolean;
}

export interface DomainIntelligence {
  domain: string;
  riskScore: number;
  domainAgeDays: number;
  createdDate: string;
  expiryDate: string;
  registrar: string;
  nameservers: string[];
  mxRecords: string[];
  aRecords: string[];
  txtRecords: string[];
  asn: string;
  hostingProvider: string;
  country: string;
  isLookalike: boolean;
  lookalikeBrand?: string;
  lookalikeSimilarity?: number;
  lookalikeReason?: string;
  dmarcPolicy?: string;
  isDnsValid: boolean;
}

export interface IpIntelligence {
  ip: string;
  threatScore: number;
  asn: string;
  organization: string;
  country: string;
  countryCode: string;
  city: string;
  region: string;
  latitude: number;
  longitude: number;
  reverseDns: string;
  isHosting: boolean;
  isVpnOrProxy: boolean;
  isTorExit: boolean;
  isKnownAbuser: boolean;
  abuseReportsCount: number;
  lastReportedDate?: string;
  relatedDomains: string[];
}

export interface EmailAttachment {
  id: string;
  filename: string;
  filesize: number;
  contentType: string;
  md5: string;
  sha256: string;
  malicious: boolean;
  threatScore: number;
  verdict: string;
  entropy?: number;
}
