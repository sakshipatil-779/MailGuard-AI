import { Severity, ThreatClassification, IocItem } from "./threat";
import { EmailAnalysis } from "./analysis";

export type CaseStatus =
  | "OPEN"
  | "IN_PROGRESS"
  | "CONTAINED"
  | "RESOLVED"
  | "ARCHIVED";

export interface EvidenceItem {
  id: string;
  caseId: string;
  type: "RAW_EMAIL" | "HEADER" | "ATTACHMENT" | "IOC" | "PCAP" | "SCREENSHOT";
  name: string;
  description: string;
  sha256: string;
  collectedAt: string;
  collectedBy: string;
  integrityStatus: "VERIFIED" | "TAMPERED" | "PENDING";
  storageRef: string;
  fileSizeBytes?: number;
}

export interface CaseTimelineEvent {
  id: string;
  timestamp: string;
  type: "DETECTION" | "ANALYSIS" | "CASE_CREATED" | "EVIDENCE_ADDED" | "NOTE_ADDED" | "STATUS_CHANGED" | "REPORT_GENERATED";
  actor: string;
  title: string;
  details: string;
  metadata?: Record<string, any>;
}

export interface InvestigationCase {
  id: string;
  caseNumber: string;
  title: string;
  description: string;
  status: CaseStatus;
  severity: Severity;
  primaryClassification: ThreatClassification;
  leadAnalyst: string;
  assignedTeam: string;
  createdAt: string;
  updatedAt: string;
  targetVictims: string[];
  campaignName?: string;
  mitreAttckIds: string[];
  
  // Associated Assets
  emailIds: string[];
  associatedEmails?: EmailAnalysis[];
  evidence: EvidenceItem[];
  timeline: CaseTimelineEvent[];
  iocs: IocItem[];
  analystNotes: Array<{
    id: string;
    author: string;
    createdAt: string;
    content: string;
  }>;
  tags: string[];
}

export interface CampaignNode {
  id: string;
  type: "campaign" | "email" | "domain" | "ip" | "url" | "malware";
  label: string;
  sublabel?: string;
  riskScore: number;
  severity?: Severity;
  details?: Record<string, any>;
}

export interface CampaignEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  relationType: "SPOOFS" | "SENDS_FROM" | "HOSTED_ON" | "CONTAINS_URL" | "DROPS_PAYLOAD" | "TARGETS";
  animated?: boolean;
}

export interface CampaignGraphData {
  campaignId: string;
  campaignName: string;
  threatActor?: string;
  firstSeen: string;
  lastSeen: string;
  confidence: "High" | "Medium" | "Low";
  nodes: CampaignNode[];
  edges: CampaignEdge[];
}
