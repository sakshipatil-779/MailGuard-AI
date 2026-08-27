import { ThreatClassification, Severity } from "./threat";

export interface ForensicReport {
  id: string;
  reportNumber: string;
  generatedAt: string;
  generatedBy: string;
  title: string;
  caseId?: string;
  emailId?: string;
  classification: ThreatClassification;
  severity: Severity;
  riskScore: number;
  confidence: number;
  
  executiveSummary: string;
  threatAssessment: string;
  originAttribution: string;
  remediationSteps: string[];
  
  evidenceSummary: {
    totalHeadersAnalyzed: number;
    spfStatus: string;
    dkimStatus: string;
    dmarcStatus: string;
    originIp: string;
    originCountry: string;
    totalIocs: number;
    rawSha256: string;
  };
  
  iocs: Array<{
    type: string;
    value: string;
    severity: string;
    category: string;
  }>;
  
  chainOfCustody: {
    custodian: string;
    sha256Verification: "VERIFIED" | "FAILED";
    immutableLedgerRef: string;
    timestamp: string;
  };
}
