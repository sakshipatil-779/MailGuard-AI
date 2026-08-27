import { EmailAnalysis } from "@/types/analysis";
import { InvestigationCase, EvidenceItem, CaseTimelineEvent } from "@/types/investigation";
import { ThreatAlert } from "../data/mock-alerts";
import { ForensicReport } from "@/types/report";
import { generateId } from "../utils";

const STORAGE_KEYS = {
  EMAILS: "mailguard_analyzed_emails",
  CASES: "mailguard_cases",
  ALERTS: "mailguard_alerts",
  REPORTS: "mailguard_reports",
  AUDIT: "mailguard_audit_logs"
};

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  resourceType: string;
  resourceId: string;
  details: string;
}

export class MockStorage {
  private static isClient(): boolean {
    return typeof window !== "undefined";
  }

  // EMAILS - Real time data only (empty by default until user uploads/analyzes)
  static getEmails(): EmailAnalysis[] {
    if (!this.isClient()) return [];
    const stored = localStorage.getItem(STORAGE_KEYS.EMAILS);
    if (!stored) return [];
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }

  static getEmailById(id: string): EmailAnalysis | undefined {
    const emails = this.getEmails();
    return emails.find(e => e.id === id || e.analysisId === id);
  }

  static saveEmail(email: EmailAnalysis): EmailAnalysis {
    const emails = this.getEmails();
    const existingIndex = emails.findIndex(e => e.id === email.id);
    let updated: EmailAnalysis[];
    if (existingIndex >= 0) {
      updated = [...emails];
      updated[existingIndex] = email;
    } else {
      updated = [email, ...emails];
    }
    if (this.isClient()) {
      localStorage.setItem(STORAGE_KEYS.EMAILS, JSON.stringify(updated));
    }
    
    // If critical/high threat, auto-create alert in real time
    if (email.riskScore >= 50 && existingIndex < 0) {
      this.createAlert({
        id: `ALT-${Date.now().toString().slice(-4)}`,
        emailId: email.id,
        subject: email.headers.subject,
        sender: email.headers.fromAddress,
        senderDomain: email.headers.fromAddress.split("@")[1] || "unknown",
        recipient: email.headers.to[0] || "user@enterprise.com",
        threatType: email.classification,
        severity: email.severity,
        riskScore: email.riskScore,
        sourceIp: email.origin.ip,
        sourceCountry: email.origin.country,
        detectedAt: email.createdAt,
        status: "NEW",
        assignedCaseId: email.caseId,
        ruleName: `AI-DETECTION-${email.classification.toUpperCase()}`
      });
    }

    this.addAuditLog("ANALYZE_EMAIL", "EMAIL", email.id, `Analyzed message '${email.headers.subject}' (Threat Score: ${email.riskScore}/100)`);
    return email;
  }

  static deleteEmail(id: string) {
    if (!this.isClient()) return;
    const emails = this.getEmails().filter(e => e.id !== id);
    localStorage.setItem(STORAGE_KEYS.EMAILS, JSON.stringify(emails));
  }

  // CASES - Real time cases only
  static getCases(): InvestigationCase[] {
    if (!this.isClient()) return [];
    const stored = localStorage.getItem(STORAGE_KEYS.CASES);
    if (!stored) return [];
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }

  static getCaseById(id: string): InvestigationCase | undefined {
    const cases = this.getCases();
    const foundCase = cases.find(c => c.id === id || c.caseNumber === id);
    if (!foundCase) return undefined;
    
    // Enrich with associated email objects
    const allEmails = this.getEmails();
    const associatedEmails = allEmails.filter(e => foundCase.emailIds.includes(e.id));
    return {
      ...foundCase,
      associatedEmails: associatedEmails
    };
  }

  static saveCase(investigation: InvestigationCase): InvestigationCase {
    const cases = this.getCases();
    const index = cases.findIndex(c => c.id === investigation.id);
    let updated: InvestigationCase[];
    if (index >= 0) {
      updated = [...cases];
      updated[index] = investigation;
    } else {
      updated = [investigation, ...cases];
    }
    if (this.isClient()) {
      localStorage.setItem(STORAGE_KEYS.CASES, JSON.stringify(updated));
    }
    this.addAuditLog("SAVE_CASE", "CASE", investigation.id, `Updated case ${investigation.caseNumber}: ${investigation.title}`);
    return investigation;
  }

  static addEvidenceToCase(caseId: string, evidence: Omit<EvidenceItem, "id">): EvidenceItem {
    const caseObj = this.getCaseById(caseId);
    const newEvidence: EvidenceItem = {
      ...evidence,
      id: generateId("EVD")
    };
    if (caseObj) {
      caseObj.evidence.push(newEvidence);
      caseObj.timeline.unshift({
        id: generateId("tl"),
        timestamp: new Date().toISOString(),
        type: "EVIDENCE_ADDED",
        actor: evidence.collectedBy,
        title: "Forensic Evidence Sealed",
        details: `Preserved '${evidence.name}' with SHA-256 hash ${evidence.sha256.substring(0, 16)}...`
      });
      this.saveCase(caseObj);
    }
    return newEvidence;
  }

  static addNoteToCase(caseId: string, author: string, content: string) {
    const caseObj = this.getCaseById(caseId);
    if (caseObj) {
      caseObj.analystNotes.push({
        id: generateId("note"),
        author,
        createdAt: new Date().toISOString(),
        content
      });
      caseObj.timeline.unshift({
        id: generateId("tl"),
        timestamp: new Date().toISOString(),
        type: "NOTE_ADDED",
        actor: author,
        title: "Analyst Case Note Appended",
        details: content.substring(0, 80) + (content.length > 80 ? "..." : "")
      });
      this.saveCase(caseObj);
    }
  }

  // ALERTS - Real time alerts only
  static getAlerts(): ThreatAlert[] {
    if (!this.isClient()) return [];
    const stored = localStorage.getItem(STORAGE_KEYS.ALERTS);
    if (!stored) return [];
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }

  static createAlert(alert: ThreatAlert) {
    const alerts = this.getAlerts();
    const updated = [alert, ...alerts];
    if (this.isClient()) {
      localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(updated));
    }
  }

  static updateAlertStatus(alertId: string, status: ThreatAlert["status"]) {
    const alerts = this.getAlerts();
    const updated = alerts.map(a => a.id === alertId ? { ...a, status } : a);
    if (this.isClient()) {
      localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(updated));
    }
  }

  // REPORTS - Real time reports only
  static getReports(): ForensicReport[] {
    if (!this.isClient()) return [];
    const stored = localStorage.getItem(STORAGE_KEYS.REPORTS);
    if (!stored) return [];
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }

  static getReportById(id: string): ForensicReport | undefined {
    const reports = this.getReports();
    return reports.find(r => r.id === id || r.reportNumber === id);
  }

  static generateReportFromEmail(email: EmailAnalysis, generatedBy = "Alex Mercer (Lead Analyst)"): ForensicReport {
    const report: ForensicReport = {
      id: generateId("rep"),
      reportNumber: `REP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      generatedAt: new Date().toISOString(),
      generatedBy: generatedBy,
      title: `Forensic Threat Report: ${email.headers.subject}`,
      emailId: email.id,
      caseId: email.caseId,
      classification: email.classification,
      severity: email.severity,
      riskScore: email.riskScore,
      confidence: email.confidence,
      executiveSummary: email.executiveSummary,
      threatAssessment: `The analyzed message exhibits ${email.findings.length} primary risk indicators conforming to ${email.classification.toUpperCase()} tactics. Originating source IP ${email.origin.ip} (${email.origin.isp}, ${email.origin.country}) has documented malicious telemetry.`,
      originAttribution: `Estimated originating mail server node: ${email.origin.ip} (${email.origin.city}, ${email.origin.country}). Confidence level: ${email.origin.confidence}. Intermediate relay hops: ${email.relayPath.length} nodes.`,
      remediationSteps: [
        `Purge and quarantine message across all enterprise mailboxes`,
        `Block domain '${email.headers.fromAddress.split("@")[1]}' on perimeter DNS & email gateways`,
        `Sinkhole origin IP '${email.origin.ip}' on firewall border access lists`,
        `Notify affected recipients (${email.headers.to.join(", ")}) and enforce credential reset`
      ],
      evidenceSummary: {
        totalHeadersAnalyzed: Object.keys(email.headers.allHeaders).length,
        spfStatus: email.authentication.spf.toUpperCase(),
        dkimStatus: email.authentication.dkim.toUpperCase(),
        dmarcStatus: email.authentication.dmarc.toUpperCase(),
        originIp: email.origin.ip,
        originCountry: email.origin.country,
        totalIocs: email.iocs.length,
        rawSha256: email.sha256
      },
      iocs: email.iocs.map(ioc => ({
        type: ioc.type.toUpperCase(),
        value: ioc.value,
        severity: ioc.riskScore > 75 ? "CRITICAL" : (ioc.riskScore > 50 ? "HIGH" : "MEDIUM"),
        category: ioc.category
      })),
      chainOfCustody: {
        custodian: generatedBy,
        sha256Verification: "VERIFIED",
        immutableLedgerRef: `ETH-SEC-VAULT-${email.sha256.substring(0, 12).toUpperCase()}`,
        timestamp: new Date().toISOString()
      }
    };

    const reports = this.getReports();
    const updated = [report, ...reports];
    if (this.isClient()) {
      localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(updated));
    }
    this.addAuditLog("GENERATE_REPORT", "REPORT", report.id, `Generated Forensic Threat Report ${report.reportNumber}`);
    return report;
  }

  // AUDIT - Real time logs
  static getAuditLogs(): AuditLogEntry[] {
    if (!this.isClient()) return [];
    const stored = localStorage.getItem(STORAGE_KEYS.AUDIT);
    if (!stored) return [];
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }

  static addAuditLog(action: string, resourceType: string, resourceId: string, details: string) {
    if (!this.isClient()) return;
    const current = this.getAuditLogs();
    const entry: AuditLogEntry = {
      id: generateId("aud"),
      timestamp: new Date().toISOString(),
      actor: "Security Analyst (Tier 2)",
      role: "SECURITY_ANALYST",
      action,
      resourceType,
      resourceId,
      details
    };
    const updated = [entry, ...current.slice(0, 99)];
    localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(updated));
  }

  // Reset/Clear all data
  static clearAllData() {
    if (!this.isClient()) return;
    localStorage.removeItem(STORAGE_KEYS.EMAILS);
    localStorage.removeItem(STORAGE_KEYS.CASES);
    localStorage.removeItem(STORAGE_KEYS.ALERTS);
    localStorage.removeItem(STORAGE_KEYS.REPORTS);
    localStorage.removeItem(STORAGE_KEYS.AUDIT);
  }
}
