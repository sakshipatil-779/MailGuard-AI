import { Severity, ThreatClassification } from "@/types/threat";

export interface ThreatAlert {
  id: string;
  emailId: string;
  subject: string;
  sender: string;
  senderDomain: string;
  recipient: string;
  threatType: ThreatClassification;
  severity: Severity;
  riskScore: number;
  sourceIp: string;
  sourceCountry: string;
  detectedAt: string;
  status: "NEW" | "ACKNOWLEDGED" | "INVESTIGATING" | "RESOLVED";
  assignedCaseId?: string;
  ruleName: string;
}

export const MOCK_ALERTS: ThreatAlert[] = [
  {
    id: "ALT-2026-901",
    emailId: "eml_bec_wire_001",
    subject: "URGENT & CONFIDENTIAL: Time-Sensitive M&A Acquisition Escrow Wire Instructions",
    sender: "jvance@acme-corp-holdings.co",
    senderDomain: "acme-corp-holdings.co",
    recipient: "sjenkins@acmeworks.com",
    threatType: "business_email_compromise",
    severity: "critical",
    riskScore: 96,
    sourceIp: "102.89.41.118",
    sourceCountry: "Nigeria",
    detectedAt: "2026-08-26T14:31:55Z",
    status: "INVESTIGATING",
    assignedCaseId: "CASE-2026-0041",
    ruleName: "SOC-RULE-BEC-C_SUITE_WIRE_TRANSFER"
  },
  {
    id: "ALT-2026-899",
    emailId: "eml_m365_phish_002",
    subject: "Action Required: Your Microsoft 365 Password Expires in 24 Hours",
    sender: "no-reply@micros0ft-security-portal.com",
    senderDomain: "micros0ft-security-portal.com",
    recipient: "dmiller@acmeworks.com",
    threatType: "phishing",
    severity: "critical",
    riskScore: 92,
    sourceIp: "194.26.29.84",
    sourceCountry: "Russia",
    detectedAt: "2026-08-26T11:14:30Z",
    status: "INVESTIGATING",
    assignedCaseId: "CASE-2026-0038",
    ruleName: "SOC-RULE-AITM_M365_HOMOGLYPH_HARVEST"
  },
  {
    id: "ALT-2026-874",
    emailId: "eml_ransomware_inv_003",
    subject: "FINAL DEMAND: Outstanding Balance Invoice INV-982103 Legal Action Notice",
    sender: "billing@freight-invoicing-system.top",
    senderDomain: "freight-invoicing-system.top",
    recipient: "ap@acmeworks.com",
    threatType: "malware_delivery",
    severity: "critical",
    riskScore: 99,
    sourceIp: "185.220.101.5",
    sourceCountry: "Iceland",
    detectedAt: "2026-08-25T18:39:45Z",
    status: "RESOLVED",
    assignedCaseId: "CASE-2026-0035",
    ruleName: "SOC-RULE-MALWARE_PASSWORD_PROTECTED_ZIP"
  },
  {
    id: "ALT-2026-851",
    emailId: "eml_dhl_spoof_004",
    subject: "Shipment #DHL-894021-US: Delivery On Hold - Address Verification Required",
    sender: "track-parcel@dhl-express-tracking-delivery.info",
    senderDomain: "dhl-express-tracking-delivery.info",
    recipient: "shipping@acmeworks.com",
    threatType: "impersonation",
    severity: "high",
    riskScore: 84,
    sourceIp: "149.210.198.42",
    sourceCountry: "Netherlands",
    detectedAt: "2026-08-25T09:19:50Z",
    status: "NEW",
    ruleName: "SOC-RULE-BRAND_LOGISTICS_DUTY_SCAM"
  },
  {
    id: "ALT-2026-840",
    emailId: "eml_bec_wire_001",
    subject: "Payroll Direct Deposit Account Change Request",
    sender: "hr-payroll-update@direct-deposit-portal.net",
    senderDomain: "direct-deposit-portal.net",
    recipient: "payroll@acmeworks.com",
    threatType: "financial_fraud",
    severity: "high",
    riskScore: 78,
    sourceIp: "45.142.120.19",
    sourceCountry: "Germany",
    detectedAt: "2026-08-24T16:10:00Z",
    status: "NEW",
    ruleName: "SOC-RULE-PAYROLL_DIVERSION_DETECTED"
  }
];
