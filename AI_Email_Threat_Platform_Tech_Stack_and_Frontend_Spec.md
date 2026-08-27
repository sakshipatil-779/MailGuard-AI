# AI-Powered Email Threat Detection, GeoLocation and Forensic Intelligence Platform

## 1. Project Overview

This project is an AI-powered cybersecurity platform for detecting, analyzing, tracing, and investigating suspicious emails.

The platform should not only answer **"Is this email malicious?"**, but also:

- Why is the email suspicious?
- Was the sender identity spoofed or impersonated?
- Which authentication checks passed or failed?
- Through which mail servers did the message travel?
- What is the earliest reliable source IP visible in the available evidence?
- What geolocation and infrastructure intelligence is associated with that IP/domain?
- Are related domains, IPs, aliases, URLs, or incidents connected to the same campaign?
- What evidence can an analyst preserve and include in a forensic report?

The implementation should be **frontend-first**. The initial phase builds a polished analyst dashboard and complete user workflow using mocked API responses. The backend can then be implemented behind stable API contracts without requiring a major frontend rewrite.

---

# 2. Primary Product Goals

## Core goals

1. Detect phishing, spoofing, impersonation, fraud, BEC, and suspicious-email behavior.
2. Parse and visualize technical email header information.
3. Reconstruct the email relay path.
4. Show IP/domain geolocation and infrastructure intelligence.
5. Correlate indicators across emails, domains, IPs, URLs, and incidents.
6. Give analysts an explainable risk score rather than a black-box verdict.
7. Preserve evidence and generate investigation-ready reports.
8. Support case-based investigation and campaign grouping.
9. Protect sensitive email content with access control, masking, retention, and audit logging.

## MVP priority

### Must have

- User authentication UI
- Email analysis/upload screen
- Fraud/risk score
- Threat classification
- Header analysis view
- SPF/DKIM/DMARC status
- IP and domain intelligence cards
- Relay-path visualization
- Origin/geolocation map
- IOC extraction
- Threat explanation panel
- Investigation/case page
- Forensic report preview/export UI
- Audit/evidence timeline

### Nice to have

- Real-time alert center
- Campaign graph view
- Similar-email detection
- Bulk email analysis
- Saved searches
- Analyst collaboration
- Webhook/event streaming
- Advanced threat-intelligence enrichment

---

# 3. Recommended Technology Stack

## Frontend

| Area | Technology | Purpose |
|---|---|---|
| Framework | **Next.js (App Router)** | Main web application, routing, SSR/SEO where useful, server-side capabilities |
| Language | **TypeScript** | Type safety and maintainability |
| UI | **React** | Component-based interface |
| Styling | **Tailwind CSS** | Fast, consistent responsive styling |
| Component system | **shadcn/ui + Radix UI** | Accessible dashboard components, dialogs, dropdowns, tabs, tables, forms |
| Icons | **Lucide React** | Consistent security/dashboard iconography |
| Charts | **Recharts** | Risk trends, threat distribution, authentication statistics |
| Network/graph visualization | **React Flow** | Relay path and infrastructure relationship graphs |
| Maps | **MapLibre GL JS** | Origin/geolocation visualization without locking the frontend to a single proprietary map renderer |
| Forms | **React Hook Form** | Email upload, analysis settings, case creation, filters |
| Validation | **Zod** | Client-side validation and shared schemas |
| Server state | **TanStack Query** | API caching, loading/error states, mutations, polling |
| Tables | **TanStack Table** | Analyst-grade sortable/filterable evidence and event tables |
| Toasts | **Sonner** | User feedback and action notifications |
| Dates | **date-fns** | Date formatting and timeline utilities |
| Testing | **Vitest + React Testing Library + Playwright** | Unit, component, and end-to-end testing |
| Mock API | **MSW** | Frontend development before backend is available |

## Backend

The backend can be built after the frontend contracts are stabilized.

| Area | Technology | Purpose |
|---|---|---|
| API | **FastAPI (Python)** | High-performance API and strong fit for ML/NLP workloads |
| Language | **Python** | NLP, ML, parsing, threat-intelligence enrichment |
| Validation | **Pydantic** | Typed API request/response schemas |
| Async/background jobs | **Celery + Redis** | Long-running email analysis, enrichment, report generation |
| Primary database | **PostgreSQL** | Users, cases, emails, indicators, findings, evidence, audit records |
| ORM | **SQLAlchemy** | Database access and models |
| Cache/queue | **Redis** | Job queues, caching, rate limits, temporary analysis state |
| Object storage | **S3-compatible storage** | Raw email files, exported forensic reports, evidence artifacts |
| Search | **OpenSearch** | Full-text and investigator search across indexed email/header/evidence data |
| Graph database | **Neo4j** | Correlation between IPs, domains, emails, URLs, aliases, campaigns and infrastructure |
| Authentication | **JWT/OIDC-compatible identity layer** | Secure login and role-based access |

## AI / ML

| Area | Technology | Purpose |
|---|---|---|
| NLP | **Transformer-based text classifier** | Phishing, fraud, impersonation and social-engineering classification |
| ML framework | **scikit-learn / PyTorch** | Model training and inference |
| URL analysis | **Python parsers + feature extraction** | URL normalization, redirect/obfuscation indicators |
| Explainability | **SHAP / feature contribution layer** | Show major reasons behind model score where technically appropriate |
| Similarity | **Embedding model + vector search** | Similar email/campaign discovery |

For a hackathon MVP, keep the model architecture modular. Start with deterministic rules + lightweight ML classification and expose a common `analysis` response. A heavier model can be added later without changing the dashboard contract.

## Email / Security Analysis

| Area | Technology / Approach | Purpose |
|---|---|---|
| Email parsing | **Python `email` package** | Parse RFC-style message structure and headers |
| MIME analysis | Python MIME parsers | Attachment and content inspection |
| Authentication analysis | SPF/DKIM/DMARC verification service/module | Validate sender authentication and alignment |
| DNS | DNS resolver library/service | A/AAAA/MX/TXT/NS lookups |
| Domain intelligence | WHOIS/RDAP + DNS | Registrar and domain metadata |
| IP intelligence | GeoIP/ASN/provider API | Country, region, ASN, ISP/hosting context |
| Threat intelligence | STIX/TAXII-compatible feeds or APIs | IOC enrichment and correlation |
| Malware analysis | Isolated/sandboxed scanning pipeline | Safe analysis of suspicious attachments |

> **Important:** Never execute untrusted email attachments or embedded scripts directly inside the application server. Any detonation/sandbox workflow must be isolated from the main application environment.

## DevOps / Infrastructure

| Area | Technology |
|---|---|
| Containerization | Docker + Docker Compose |
| Reverse proxy | Nginx or managed ingress |
| CI/CD | GitHub Actions |
| Monitoring | OpenTelemetry + Prometheus-compatible metrics |
| Logs | Structured JSON logs |
| Error tracking | Sentry or equivalent |
| Secrets | Environment variables locally; managed secret store in production |
| Cloud | AWS / Azure / GCP / compatible deployment |

---

# 4. High-Level Architecture

```text
                         ┌─────────────────────────────┐
                         │        User / Analyst       │
                         └──────────────┬──────────────┘
                                        │ HTTPS
                                        ▼
                         ┌─────────────────────────────┐
                         │   Next.js Frontend          │
                         │   React + TypeScript        │
                         │   Tailwind + shadcn/ui      │
                         └──────────────┬──────────────┘
                                        │ REST/JSON
                                        ▼
                         ┌─────────────────────────────┐
                         │      FastAPI Backend        │
                         └───────┬──────────┬──────────┘
                                 │          │
                ┌────────────────┘          └─────────────────┐
                ▼                                             ▼
      ┌───────────────────┐                         ┌───────────────────┐
      │ Analysis Pipeline │                         │ Investigation API │
      │ NLP/ML/Rules      │                         │ Cases/Reports     │
      └─────────┬─────────┘                         └─────────┬─────────┘
                │                                             │
       ┌────────┼─────────┐                         ┌─────────┼─────────┐
       ▼        ▼         ▼                         ▼         ▼         ▼
   PostgreSQL Redis   OpenSearch                 Neo4j    Object     Audit
                                             /Graph DB    Storage     Logs
       │
       └─────────────── Threat Intel / DNS / GeoIP / RDAP ───────────────┘
```

---

# 5. Frontend-First Development Strategy

The first development phase should **not wait for the backend**.

Build the UI around strongly typed mock responses and replace the mock transport later with real APIs.

## Phase A — UI foundation

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Global layout
- Navigation/sidebar
- Theme handling
- Authentication screens
- Error/loading/empty states

## Phase B — Analyst dashboard

Build the complete dashboard using static/mock data:

- Total emails analyzed
- High-risk emails
- Threat categories
- Average fraud score
- Recent detections
- Authentication failures
- Top suspicious domains
- Top suspicious IPs
- Alert feed

## Phase C — Email analysis workflow

Create the primary screen where an analyst can:

1. Upload `.eml`/raw email content.
2. Paste raw email text.
3. Submit the message for analysis.
4. View analysis progress.
5. Open a detailed result.

## Phase D — Forensic investigation UI

Add:

- Header viewer
- Authentication results
- IOC list
- Relay path graph
- GeoIP map
- Domain intelligence
- IP intelligence
- Campaign relationships
- Evidence timeline
- Case assignment

## Phase E — Reports and alerts

Add:

- Forensic report builder
- Export/print view
- Alert center
- Case management
- Audit trail

## Phase F — Backend integration

Replace MSW/mock data with FastAPI endpoints while keeping the same frontend types and component contracts.

---

# 6. Frontend Application Structure

Recommended directory structure:

```text
app/
├── (auth)/
│   ├── login/
│   │   └── page.tsx
│   └── forgot-password/
│       └── page.tsx
│
├── (dashboard)/
│   ├── layout.tsx
│   ├── dashboard/
│   │   └── page.tsx
│   ├── analyze/
│   │   └── page.tsx
│   ├── emails/
│   │   ├── page.tsx
│   │   └── [id]/
│   │       └── page.tsx
│   ├── investigations/
│   │   ├── page.tsx
│   │   └── [caseId]/
│   │       └── page.tsx
│   ├── alerts/
│   │   └── page.tsx
│   ├── reports/
│   │   └── page.tsx
│   ├── threat-intelligence/
│   │   └── page.tsx
│   └── settings/
│       └── page.tsx
│
├── api/
│   └── ...
│
├── globals.css
└── layout.tsx

components/
├── ui/
├── layout/
├── dashboard/
├── email-analysis/
├── forensic/
├── maps/
├── graphs/
├── alerts/
├── reports/
└── cases/

lib/
├── api/
├── mocks/
├── schemas/
├── utils/
└── constants/

types/
├── email.ts
├── analysis.ts
├── threat.ts
├── investigation.ts
├── evidence.ts
└── report.ts
```

---

# 7. Main Frontend Pages

## 7.1 Login

Purpose: secure entry into the analyst console.

UI:

- Email/username
- Password
- Remember-session option
- Login button
- SSO option placeholder
- Error feedback

Do not expose sensitive technical details in authentication errors.

---

## 7.2 Main Dashboard

The dashboard is the first screen after login.

### KPI cards

- Emails analyzed
- High-risk detections
- Phishing detections
- Impersonation detections
- Fraud/BEC detections
- Active investigations

### Threat overview

Use a donut/bar chart for:

- Legitimate
- Suspicious
- Phishing
- Impersonated
- Fraud/BEC

### Risk trend

Show daily/weekly analysis volume and high-risk detections.

### Recent alerts

Columns:

- Severity
- Subject
- Sender
- Threat type
- Fraud score
- Status
- Detected at

### Intelligence summary

Cards for:

- Suspicious domains
- Suspicious IPs
- Failed SPF
- Failed DKIM
- Failed DMARC
- Newly observed infrastructure

---

# 8. Email Analysis Page

Route:

```text
/analyze
```

## Input methods

### Option A — Raw email paste

Large code/text editor-like field for complete `.eml` content.

### Option B — File upload

Accepted MVP format:

```text
.eml
```

Future support can include `.msg` and controlled mailbox connectors.

### Optional metadata

- Case ID
- Investigation name
- Analyst notes
- Analysis priority

### Submit button

Button label:

```text
Analyze Email
```

---

# 9. Analysis Result Page

Route:

```text
/emails/[id]
```

The result page should have a clear hierarchy rather than displaying every technical field at once.

## Hero section

Display:

- Threat classification
- Fraud/risk score from 0–100
- Confidence score
- Recommended action
- Analysis timestamp
- Case ID

Example:

```text
THREAT LEVEL: HIGH
Fraud Risk: 87/100
Classifier Confidence: 94%
Recommendation: Investigate before user interaction
```

## Explanation panel

Show the most important factors:

- Display-name mismatch
- Suspicious domain similarity
- Failed DMARC alignment
- High-risk URL
- Unusual relay path
- BEC language
- Suspicious attachment

Each factor should show an understandable explanation.

---

# 10. Email Header Forensics UI

Create a dedicated tab:

```text
Header Analysis
```

## Header sections

### Identity fields

- From
- To
- CC
- Reply-To
- Return-Path
- Message-ID
- Date
- Subject

### Authentication

Display compact status cards:

```text
SPF       PASS / FAIL / NEUTRAL / NONE
DKIM      PASS / FAIL / NONE
DMARC     PASS / FAIL / NONE
ALIGNMENT PASS / FAIL
```

### Received chain

Present each `Received` hop in chronological order.

Each hop can include:

- Relay hostname
- IP address
- Timestamp
- HELO/EHLO name
- TLS details if available
- Reverse DNS
- Trust/anomaly indicator

---

# 11. Relay Path Visualization

Use **React Flow** for the investigation graph.

Example:

```text
[Sender domain]
       │
       ▼
[Mail Server A]
       │
       ▼
[Relay / Hosting]
       │
       ▼
[Destination Mail Server]
```

Nodes should be clickable.

Clicking an IP node should open:

- IP address
- ASN
- ISP/hosting provider
- Country
- Region/city estimate
- Reverse DNS
- Reputation summary
- First/last observed timestamps
- Related domains

Edges may display:

- Timestamp
- Protocol
- Relay order
- Anomaly markers

---

# 12. GeoLocation Page/Panel

Use **MapLibre GL JS**.

## Map should show

- Earliest reliable source node
- Relay nodes
- Destination region if useful
- Approximate geolocation radius/uncertainty
- Infrastructure type

Avoid presenting IP geolocation as an exact physical location.

Use language such as:

```text
Estimated origin region
Confidence: Medium
Source: IP geolocation / ASN intelligence
```

## Location information

- Country
- Region
- City
- Latitude/longitude estimate
- ISP
- ASN
- Hosting/cloud provider
- Proxy/VPN/TOR indicator when supported by the intelligence source

---

# 13. Domain Intelligence UI

For each suspicious domain, show:

- Domain
- Risk score
- Domain age
- Registrar
- Registration/expiration dates where available
- Nameservers
- MX records
- A/AAAA records
- SPF/DKIM-related DNS records
- Hosting provider
- ASN
- Related IPs
- Related domains
- Lookalike/typosquat similarity

### Example lookalike indicator

```text
Observed: micros0ft-support.example
Possible impersonated brand: Microsoft
Reason: character substitution + domain pattern similarity
```

Do not state that a domain belongs to a brand merely because it looks similar.

---

# 14. IP Intelligence UI

Display:

- IP address
- Threat score
- ASN
- Organization
- Country
- City/region estimate
- Hosting/provider type
- Reverse DNS
- Known abuse indicators
- Related domains
- Related emails
- First seen / last seen

---

# 15. IOC Extraction

Automatically highlight indicators from the message.

### IOC categories

- IP addresses
- Domains
- URLs
- Email addresses
- File hashes
- Attachment names
- Message IDs
- ASN

UI should allow:

- Copy
- Open details
- Add to case
- Mark as evidence
- Search related activity

---

# 16. Threat Detection Categories

Use a consistent taxonomy.

```text
LEGITIMATE
SUSPICIOUS
PHISHING
IMPERSONATION
BUSINESS_EMAIL_COMPROMISE
FINANCIAL_FRAUD
MALWARE_DELIVERY
CREDENTIAL_HARVESTING
SPOOFING
UNKNOWN
```

A single email may have multiple findings even when it receives one primary classification.

---

# 17. Risk Scoring Model for Frontend

The frontend should receive a normalized score from the backend:

```text
0–24    LOW
25–49   MEDIUM
50–74   HIGH
75–100  CRITICAL
```

The exact model should remain a backend concern.

Frontend responsibilities:

- Render the score
- Render severity label
- Show contributing factors
- Show confidence
- Show recommended action

Frontend should never calculate the authoritative fraud score from raw email data.

---

# 18. Investigation / Case Management

Route:

```text
/investigations
```

## Case list

Columns:

- Case ID
- Title
- Severity
- Threat type
- Status
- Analyst
- Related emails
- Created
- Updated

## Case statuses

```text
OPEN
IN_PROGRESS
CONTAINED
RESOLVED
ARCHIVED
```

## Case detail

Tabs:

- Overview
- Emails
- Indicators
- Infrastructure
- Graph
- Evidence
- Timeline
- Notes
- Reports
- Audit

---

# 19. Campaign Correlation View

Use **React Flow** or a graph visualization component.

Example relationship model:

```text
             ┌─────────────┐
             │ Campaign A  │
             └──────┬──────┘
                    │
      ┌─────────────┼──────────────┐
      ▼             ▼              ▼
 [Domain]         [IP]          [URL]
      │             │              │
      ▼             ▼              ▼
 [Email 1]       [Email 2]      [Email 3]
```

This view should help analysts identify repeated infrastructure and campaign patterns without automatically asserting human identity.

---

# 20. Alert Center

Route:

```text
/alerts
```

Support:

- Critical/high/medium/low severity
- New/open/acknowledged/resolved
- Email subject
- Threat type
- Risk score
- Source IP
- Domain
- Timestamp

Use a notification drawer for important alerts.

---

# 21. Forensic Report UI

Route:

```text
/reports
```

Report should include:

1. Case metadata
2. Executive summary
3. Email metadata
4. Threat classification
5. Risk/confidence scores
6. Header analysis
7. SPF/DKIM/DMARC findings
8. Relay path
9. Geolocation intelligence
10. IP/domain intelligence
11. IOCs
12. Correlated incidents/campaigns
13. Evidence list
14. Analyst observations
15. Recommended response
16. Audit and chain-of-custody metadata

### Export formats

MVP:

- PDF
- JSON

Future:

- CSV evidence export
- STIX-compatible export

---

# 22. Evidence and Chain of Custody UI

Every evidence item should have:

- Evidence ID
- Source
- Collection timestamp
- SHA-256 hash where applicable
- Uploaded by
- Case ID
- Description
- Integrity status
- Current storage reference

Example:

```text
Evidence ID: EVD-00021
Type: Raw Email
SHA-256: <hash>
Collected: <timestamp>
Collected By: <analyst>
Integrity: VERIFIED
```

Never modify the original evidence object after preservation. Store derived/normalized data separately.

---

# 23. Privacy and Security Requirements

The interface and later backend must be designed around sensitive communication data.

## Authentication

- Secure session handling
- Short-lived access tokens where applicable
- Refresh-token protection
- MFA-ready architecture

## Authorization

Use role-based access control.

Suggested roles:

```text
ADMIN
SECURITY_ANALYST
INVESTIGATOR
AUDITOR
VIEWER
```

## Data protection

- HTTPS only
- Encryption at rest for sensitive data
- Secret values only in environment/secret management systems
- No sensitive email content in client-side logs
- Avoid storing raw email data in browser localStorage

## Privacy UI

Sensitive fields should support masking:

```text
s****@example.com
192.0.2.xxx
```

Masking should be configurable by role and organizational policy.

## Retention

The backend should eventually support configurable retention rules for:

- Raw email
- Parsed metadata
- Evidence
- Reports
- Audit logs

---

# 24. Frontend Security Practices

The Next.js application should follow these rules:

- Validate all form inputs with Zod.
- Treat uploaded email content as untrusted input.
- Render email body as sanitized content; never directly execute HTML/scripts from an uploaded email.
- Do not use unsafe HTML rendering unless content has been sanitized.
- Never expose API secrets in `NEXT_PUBLIC_*` environment variables.
- Use secure cookies for session data where applicable.
- Enforce authorization on the backend even if UI elements are hidden.
- Do not trust client-provided role, severity, score, or evidence-integrity values.
- Rate-limit expensive analysis operations at the backend layer.

---

# 25. Frontend Environment Variables

Example `.env.local`:

```env
NEXT_PUBLIC_APP_NAME=Email Threat Intelligence Platform
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_MAP_STYLE_URL=<map-style-url>
```

Never place backend API keys, threat-intelligence secrets, database credentials, or model-provider secrets in public environment variables.

---

# 26. API Contract Strategy

Even before the backend exists, define frontend types around stable contracts.

## Analyze Email

```http
POST /api/v1/analysis/emails
Content-Type: multipart/form-data
```

Request:

```text
file=<email.eml>
case_id=<optional>
priority=<normal|high>
```

Response:

```json
{
  "analysis_id": "anl_12345",
  "status": "completed",
  "classification": "phishing",
  "risk_score": 87,
  "confidence": 0.94,
  "recommendation": "investigate",
  "findings": [],
  "headers": {},
  "authentication": {},
  "relay_path": [],
  "origin": {},
  "iocs": [],
  "domain_intelligence": [],
  "ip_intelligence": []
}
```

## Get Analysis

```http
GET /api/v1/analysis/emails/{analysis_id}
```

## List Emails

```http
GET /api/v1/emails
```

## Get Email

```http
GET /api/v1/emails/{email_id}
```

## Create Case

```http
POST /api/v1/cases
```

## Get Case

```http
GET /api/v1/cases/{case_id}
```

## Get Alerts

```http
GET /api/v1/alerts
```

## Generate Report

```http
POST /api/v1/reports
```

## Get Evidence

```http
GET /api/v1/cases/{case_id}/evidence
```

---

# 27. Suggested TypeScript Domain Models

```ts
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

export interface ThreatFinding {
  id: string;
  category: string;
  severity: Severity;
  title: string;
  explanation: string;
  evidenceRefs: string[];
}

export interface AuthenticationResult {
  spf: "pass" | "fail" | "neutral" | "none" | "unknown";
  dkim: "pass" | "fail" | "none" | "unknown";
  dmarc: "pass" | "fail" | "none" | "unknown";
  alignment: "pass" | "fail" | "unknown";
}

export interface RelayNode {
  id: string;
  hostname?: string;
  ip?: string;
  timestamp?: string;
  country?: string;
  region?: string;
  city?: string;
  provider?: string;
  anomaly?: boolean;
}

export interface EmailAnalysis {
  analysisId: string;
  classification: ThreatClassification;
  riskScore: number;
  confidence: number;
  recommendation: string;
  findings: ThreatFinding[];
  authentication: AuthenticationResult;
  relayPath: RelayNode[];
  iocs: Array<{
    type: "ip" | "domain" | "url" | "email" | "hash" | "asn";
    value: string;
    risk?: number;
  }>;
}
```

---

# 28. Mock Data Strategy

Use **MSW** so the frontend behaves as if a real backend exists.

Suggested mock endpoints:

```text
GET  /api/v1/dashboard/summary
GET  /api/v1/emails
GET  /api/v1/emails/:id
POST /api/v1/analysis/emails
GET  /api/v1/analysis/:id
GET  /api/v1/cases
GET  /api/v1/cases/:id
GET  /api/v1/alerts
POST /api/v1/reports
```

Keep mock payloads identical to expected backend payloads.

---

# 29. UX Design Direction

The product is a cybersecurity analyst console, so the design should feel technical and trustworthy rather than decorative.

## Visual language

Recommended:

- Dark-first security dashboard option
- High contrast
- Dense but readable data tables
- Clear severity colors used consistently
- Monospaced text for IPs, domains, hashes, message IDs and headers
- Card-based intelligence summaries
- Large whitespace around major sections
- Sticky filters/action bar where useful

## Severity colors

Use consistent semantics:

```text
LOW       → neutral/green family
MEDIUM    → yellow/amber family
HIGH      → orange family
CRITICAL  → red family
```

Do not rely only on color; always include text/icon indicators for accessibility.

---

# 30. Recommended Dashboard Layout

```text
┌──────────────────────────────────────────────────────────────┐
│ Header: Search | Alerts | Analyst | Settings                │
├──────────────┬───────────────────────────────────────────────┤
│ Sidebar      │ KPI Cards                                    │
│              ├───────────────────────────────────────────────┤
│ Dashboard    │ Threat Trend             Threat Breakdown    │
│ Analyze      │                            Chart              │
│ Emails       ├───────────────────────────────────────────────┤
│ Alerts       │ Recent High-Risk Emails                     │
│ Cases        ├───────────────────────────────────────────────┤
│ Intel        │ Suspicious IPs | Domains | Auth Failures     │
│ Reports      │                                               │
└──────────────┴───────────────────────────────────────────────┘
```

---

# 31. Recommended Email Detail Layout

```text
┌─────────────────────────────────────────────────────────────┐
│ THREAT: PHISHING     RISK 87/100     CONFIDENCE 94%         │
│ Recommendation: Investigate                                 │
├─────────────────────────────────────────────────────────────┤
│ Overview | Headers | Auth | Relay | Geo | IOCs | Intel      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Findings                     Sender / Identity              │
│ - Domain mismatch            From                           │
│ - DMARC failed               Reply-To                       │
│ - Malicious URL              Return-Path                    │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ Relay Path / Infrastructure Graph                           │
├─────────────────────────────────────────────────────────────┤
│ Geolocation Map            IP + Domain Intelligence         │
└─────────────────────────────────────────────────────────────┘
```

---

# 32. Suggested Frontend Component List

## Layout

```text
AppShell
Sidebar
Topbar
Breadcrumbs
PageHeader
CommandSearch
```

## Dashboard

```text
KpiCard
RiskTrendChart
ThreatDistributionChart
RecentThreatsTable
AlertFeed
IntelligenceSummary
```

## Analysis

```text
EmailUploadDropzone
RawEmailEditor
AnalysisProgress
ThreatScoreCard
ThreatClassificationBadge
FindingList
FindingCard
AuthenticationStatus
HeaderTable
ReceivedChain
```

## Forensics

```text
RelayPathGraph
InfrastructureNode
InfrastructureEdge
GeoMap
GeoLocationCard
IpIntelCard
DomainIntelCard
IocTable
CampaignGraph
EvidenceTimeline
```

## Cases

```text
CaseTable
CaseHeader
CaseStatusBadge
CaseTimeline
RelatedEmails
CaseEvidenceTable
CaseGraph
```

## Reports

```text
ReportPreview
ReportSection
EvidenceSummary
ExportActions
```

---

# 33. Loading / Empty / Error States

Every major data section needs all three states.

## Loading

Use skeleton loaders instead of blocking the entire page.

## Empty

Example:

```text
No suspicious infrastructure found.
This does not confirm that the email is safe; it means no related infrastructure was identified by the configured intelligence sources.
```

## Error

Example:

```text
Unable to load domain intelligence.
The email analysis is still available. Retry enrichment when the intelligence service is available.
```

This is especially important because external enrichment services can fail independently of the core analysis.

---

# 34. Accessibility Requirements

The frontend should target WCAG-aligned accessibility practices.

- Keyboard-accessible navigation
- Visible focus states
- Proper form labels
- ARIA labels where necessary
- Sufficient contrast
- No color-only meaning
- Accessible data tables
- Accessible dialogs and dropdowns
- Screen-reader-friendly status messages

---

# 35. Performance Requirements

Frontend goals:

- Use server components where appropriate.
- Keep highly interactive visualizations client-side.
- Dynamically import heavy graph/map modules when beneficial.
- Paginate large evidence and email tables.
- Avoid loading all historical cases at once.
- Cache relatively stable intelligence data.
- Use optimistic updates only where data integrity is not at risk.

Large forensic views should be broken into tabs rather than rendering every graph and table simultaneously.

---

# 36. Backend Modules to Implement After Frontend

Once the frontend is stable, implement the backend in these modules:

```text
backend/
├── app/
│   ├── api/
│   ├── core/
│   ├── models/
│   ├── schemas/
│   ├── services/
│   │   ├── email_parser/
│   │   ├── header_analysis/
│   │   ├── authentication_checks/
│   │   ├── threat_detection/
│   │   ├── url_analysis/
│   │   ├── ip_intelligence/
│   │   ├── domain_intelligence/
│   │   ├── geolocation/
│   │   ├── correlation/
│   │   └── reporting/
│   └── workers/
├── tests/
└── Dockerfile
```

---

# 37. Core Backend Processing Pipeline

```text
Raw Email
   │
   ▼
Parser
   │
   ├── Metadata extraction
   ├── Header extraction
   ├── MIME/attachment extraction
   ├── URL extraction
   └── IOC extraction
   │
   ▼
Authentication Analysis
   │
   ├── SPF
   ├── DKIM
   ├── DMARC
   └── Alignment
   │
   ▼
Threat Detection
   │
   ├── Rules
   ├── NLP/ML
   ├── BEC patterns
   ├── Spoofing checks
   └── URL/domain signals
   │
   ▼
Infrastructure Intelligence
   │
   ├── IP GeoIP/ASN
   ├── DNS
   ├── RDAP/WHOIS
   ├── Reputation
   └── Threat intelligence
   │
   ▼
Correlation Engine
   │
   ├── Campaign relationships
   ├── Similar emails
   ├── Domain clusters
   └── IP/URL relationships
   │
   ▼
Risk + Confidence + Findings
   │
   ▼
Case / Alert / Report
```

---

# 38. Important Forensic Interpretation Rules

The application must avoid overstating attribution.

### Geolocation is an estimate

An IP geolocation result may represent a hosting provider, VPN, proxy, cloud region, or other network endpoint rather than the attacker's physical location.

### Source IP is evidence, not identity

The earliest visible IP in an email's `Received` chain may be a relay, compromised system, proxy, VPN, cloud host, or other intermediary.

### Correlation is not proof of common ownership

Shared infrastructure, domains, or similar messages should be presented as correlations/indicators rather than definitive proof that one person or organization controls all related entities.

### Confidence should be explicit

Use labels such as:

```text
High confidence
Medium confidence
Low confidence
Insufficient evidence
```

---

# 39. Hackathon MVP Recommendation

For a hackathon, avoid trying to build every enterprise capability at once.

## Focus the demo on one strong end-to-end workflow

```text
Upload suspicious email
        ↓
Analyze content + headers
        ↓
Generate fraud score
        ↓
Explain why it is suspicious
        ↓
Show SPF/DKIM/DMARC
        ↓
Reconstruct relay path
        ↓
Map IP/geolocation estimate
        ↓
Enrich domain/IP intelligence
        ↓
Show relationship graph
        ↓
Create investigation case
        ↓
Generate forensic report
```

This demonstrates the unique value of the project: **detection + explanation + traceability + investigation**, rather than only spam classification.

---

# 40. Suggested Hackathon Implementation Order

## Step 1 — Project setup

- [ ] Create Next.js App Router project with TypeScript.
- [ ] Configure Tailwind CSS.
- [ ] Add shadcn/ui and Lucide icons.
- [ ] Set up ESLint/formatting/testing.
- [ ] Create application shell.

## Step 2 — Authentication UI

- [ ] Login page.
- [ ] Protected dashboard layout.
- [ ] User/role display.

## Step 3 — Dashboard

- [ ] KPI cards.
- [ ] Threat charts.
- [ ] Recent alerts.
- [ ] Intelligence summary.

## Step 4 — Email analysis

- [ ] `.eml` upload.
- [ ] Raw email input.
- [ ] Mock analysis endpoint.
- [ ] Progress state.
- [ ] Result page.

## Step 5 — Forensics

- [ ] Header viewer.
- [ ] SPF/DKIM/DMARC cards.
- [ ] Relay-path graph.
- [ ] Geo map.
- [ ] IP intelligence.
- [ ] Domain intelligence.
- [ ] IOC table.

## Step 6 — Investigation

- [ ] Create case.
- [ ] Case dashboard.
- [ ] Evidence timeline.
- [ ] Campaign graph.

## Step 7 — Reporting

- [ ] Report preview.
- [ ] Evidence summary.
- [ ] Export action.

## Step 8 — Backend integration

- [ ] FastAPI endpoints.
- [ ] PostgreSQL.
- [ ] Redis jobs.
- [ ] Email parser.
- [ ] Threat analysis service.
- [ ] Enrichment services.
- [ ] Report generation.

---

# 41. Final Recommended Stack Summary

```text
FRONTEND
Next.js + TypeScript
React
Tailwind CSS
shadcn/ui + Radix UI
TanStack Query
TanStack Table
React Hook Form + Zod
Recharts
React Flow
MapLibre GL JS
MSW
Playwright + Vitest

BACKEND
FastAPI
Python
Pydantic
SQLAlchemy
Celery
Redis
PostgreSQL
OpenSearch
Neo4j
S3-compatible object storage

AI / SECURITY
NLP Transformer / ML classifier
scikit-learn / PyTorch
Email/MIME parser
SPF/DKIM/DMARC analysis
DNS/RDAP/WHOIS enrichment
IP/ASN/GeoIP intelligence
Threat-intelligence feeds
URL/IOC analysis

DEVOPS
Docker
Docker Compose
GitHub Actions
OpenTelemetry
Prometheus-compatible metrics
Structured logging
Sentry-compatible error tracking
```

---

# 42. Final Architecture Decision

### Frontend

**Next.js + TypeScript + Tailwind + shadcn/ui** is the recommended foundation because the application is highly interactive but also benefits from a structured full-stack React framework.

### Backend

**FastAPI + Python** is recommended because the core problem involves email parsing, cybersecurity enrichment, NLP/ML, data processing, and asynchronous analysis workflows.

### Data layer

Use:

- **PostgreSQL** for authoritative application data.
- **Redis** for cache/queues.
- **OpenSearch** for investigator search.
- **Neo4j** for infrastructure/campaign relationship analysis.
- **Object storage** for original evidence and generated reports.

### Frontend-first principle

The frontend should be built against versioned TypeScript interfaces and mocked REST endpoints first. When the backend is implemented, the API responses should conform to those same contracts.

This reduces integration rework and lets the hackathon team demonstrate the complete product experience before every backend intelligence service is production-ready.

---

# 43. Definition of Done for Frontend Phase

The frontend phase is complete when an analyst can perform this complete demo without a real backend:

```text
Login
  ↓
Dashboard
  ↓
Upload/Paste .eml
  ↓
Analyze
  ↓
View Threat Score + Explanation
  ↓
Inspect SPF/DKIM/DMARC
  ↓
Inspect Headers
  ↓
View Relay Path
  ↓
View GeoLocation Estimate
  ↓
Inspect IP/Domain Intelligence
  ↓
Review IOCs
  ↓
Create Investigation Case
  ↓
View Evidence Timeline
  ↓
Preview Forensic Report
```

Once this workflow is stable, replace MSW with the FastAPI backend incrementally.
