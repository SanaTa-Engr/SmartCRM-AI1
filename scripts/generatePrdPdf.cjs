const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const outputPath = path.join(process.cwd(), 'public', 'SmartCRM_AI_Product_Requirements_Document.pdf');

// Create document with standard Letter size and comfortable margins
const doc = new PDFDocument({
  size: 'LETTER',
  margins: { top: 50, bottom: 50, left: 54, right: 54 },
  bufferPages: true,
});

const writeStream = fs.createWriteStream(outputPath);
doc.pipe(writeStream);

// Theme Palette (Modern Indigo / Slate executive styling)
const PRIMARY = '#4F46E5';     // Indigo 600
const SECONDARY = '#0F172A';   // Slate 900
const TEXT = '#1E293B';        // Slate 800
const MUTED = '#64748B';       // Slate 500
const BORDER = '#CBD5E1';      // Slate 300
const BG_LIGHT = '#F8FAFC';    // Slate 50
const ACCENT_GREEN = '#059669';// Emerald 600

// Helper functions for layout
function drawHeader(title, subtitle = null) {
  doc.rect(54, doc.y, 504, 3).fill(PRIMARY);
  doc.y += 10;
  doc.fillColor(SECONDARY).font('Helvetica-Bold').fontSize(18).text(title);
  if (subtitle) {
    doc.fillColor(MUTED).font('Helvetica').fontSize(10).text(subtitle);
  }
  doc.y += 10;
}

function drawSectionHeading(number, title) {
  if (doc.y > 680) {
    doc.addPage();
  } else {
    doc.y += 12;
  }
  const headingText = number ? `${number}. ${title}` : title;
  doc.fillColor(PRIMARY).font('Helvetica-Bold').fontSize(13).text(headingText);
  doc.y += 4;
  doc.rect(54, doc.y, 504, 1).fill(BORDER);
  doc.y += 8;
  doc.fillColor(TEXT).font('Helvetica').fontSize(9.5);
}

function drawSubHeading(title) {
  if (doc.y > 700) doc.addPage();
  doc.y += 6;
  doc.fillColor(SECONDARY).font('Helvetica-Bold').fontSize(10.5).text(title);
  doc.y += 4;
  doc.fillColor(TEXT).font('Helvetica').fontSize(9.5);
}

function drawParagraph(text) {
  if (doc.y > 710) doc.addPage();
  doc.fillColor(TEXT).font('Helvetica').fontSize(9.5).text(text, {
    lineGap: 3,
    align: 'left',
  });
  doc.y += 6;
}

function drawBullet(title, description = null) {
  if (doc.y > 710) doc.addPage();
  const indent = 68;
  doc.circle(indent - 6, doc.y + 5, 2).fill(PRIMARY);
  
  if (description) {
    doc.font('Helvetica-Bold').fillColor(SECONDARY).text(title + ': ', indent, doc.y, { continued: true });
    doc.font('Helvetica').fillColor(TEXT).text(description, { lineGap: 2 });
  } else {
    doc.font('Helvetica').fillColor(TEXT).text(title, indent, doc.y, { lineGap: 2 });
  }
  doc.x = 54;
  doc.y += 4;
}

function drawCallout(title, text) {
  if (doc.y > 660) doc.addPage();
  const startY = doc.y;
  doc.rect(54, startY, 504, 48).fill(BG_LIGHT);
  doc.rect(54, startY, 4, 48).fill(PRIMARY);
  
  doc.fillColor(PRIMARY).font('Helvetica-Bold').fontSize(9.5).text(title, 68, startY + 8);
  doc.fillColor(TEXT).font('Helvetica').fontSize(8.5).text(text, 68, startY + 22, { width: 470, lineGap: 2 });
  doc.y = startY + 56;
}

function drawTable(headers, rows, colWidths) {
  if (doc.y > 640) doc.addPage();
  
  const startX = 54;
  let currentY = doc.y;
  
  // Header row
  doc.rect(startX, currentY, 504, 20).fill(SECONDARY);
  let curX = startX;
  headers.forEach((h, i) => {
    doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(8.5).text(h, curX + 6, currentY + 5, {
      width: colWidths[i] - 12,
      align: 'left',
    });
    curX += colWidths[i];
  });
  
  currentY += 20;
  
  rows.forEach((row, rowIdx) => {
    if (currentY > 720) {
      doc.addPage();
      currentY = doc.y;
    }
    
    const rowBg = rowIdx % 2 === 0 ? '#FFFFFF' : BG_LIGHT;
    doc.rect(startX, currentY, 504, 18).fill(rowBg);
    doc.rect(startX, currentY, 504, 18).stroke(BORDER);
    
    curX = startX;
    row.forEach((cell, cellIdx) => {
      doc.fillColor(TEXT).font(cellIdx === 0 ? 'Helvetica-Bold' : 'Helvetica').fontSize(8).text(String(cell), curX + 6, currentY + 4.5, {
        width: colWidths[cellIdx] - 12,
        align: 'left',
      });
      curX += colWidths[cellIdx];
    });
    
    currentY += 18;
  });
  
  doc.y = currentY + 8;
}

// ==========================================
// DOCUMENT CONTENT
// ==========================================

// --- COVER BANNER ---
doc.fillColor(PRIMARY).font('Helvetica-Bold').fontSize(24).text('SmartCRM AI', { align: 'left' });
doc.fillColor(SECONDARY).font('Helvetica-Bold').fontSize(16).text('Product Requirements Document (PRD)', { align: 'left' });
doc.fillColor(MUTED).font('Helvetica').fontSize(9.5).text('Version 2.4  |  Target Audience: Product, Engineering, RevOps  |  Date: September 2026');
doc.y += 12;

drawCallout(
  'Executive Summary',
  'SmartCRM AI is a next-generation, high-velocity customer relationship management platform built for B2B sales teams, revenue leaders, and SDRs. The system pairs modern pipeline management with an integrated Google Gemini AI engine to eliminate administrative data entry, score inbound leads in real time, draft tailored client communications, and provide an always-on AI Sales Copilot.'
);

// --- 1. PRODUCT VISION & OBJECTIVES ---
drawSectionHeading('1', 'Product Vision & Strategic Objectives');
drawParagraph('Traditional CRMs suffer from low sales rep compliance, tedious manual note-taking, and stale pipeline hygiene. SmartCRM AI re-architects the CRM experience from passive database recording into an active revenue acceleration system.');

drawSubHeading('1.1 Core Value Drivers');
drawBullet('Automated Lead Intelligence', 'Automatically score inbound and imported leads on a 0-100 scale using predictive qualification signals.');
drawBullet('Zero Administrative Latency', 'Generate executive summaries of lead profiles, identify key risks, and formulate immediate next actions with single-click AI automation.');
drawBullet('Contextual Sales Outreach', 'Draft multi-tier personalized cold and follow-up outreach directly from deal history and company firmographics.');
drawBullet('Real-Time Revenue Visibility', 'Empower sales leadership with dynamic stage-by-stage funnel metrics, weighted forecasts, and rep performance visibility.');

drawSubHeading('1.2 Success Metrics & KPIs');
drawTable(
  ['KPI / Metric', 'Target Baseline', 'Target Objective', 'Measurement Method'],
  [
    ['Rep Daily CRM Time', '45 mins/day manual entry', '< 15 mins/day', 'Session duration analytics'],
    ['Lead Qualification Speed', '4-8 hours post-submission', '< 5 minutes', 'AI automated scoring latency'],
    ['Outreach Drafting Latency', '15 mins/email', '< 30 seconds', 'Rep email generation logs'],
    ['Pipeline Forecast Accuracy', '65% manual judgment', '> 88% weighted accuracy', 'Quarterly closed deal variance'],
  ],
  [140, 130, 110, 124]
);

// --- 2. TARGET USER PERSONAS ---
drawSectionHeading('2', 'Target User Personas & Workflows');

drawSubHeading('2.1 Account Executives (AEs)');
drawBullet('Pain Points', 'Excessive administrative overhead, meeting prep friction, difficulty prioritizing late-stage deals.');
drawBullet('Core Workflows', 'Pipeline Kanban management, rapid stage progression, AI meeting prep summaries, customized proposal drafting.');

drawSubHeading('2.2 Sales Development Representatives (SDRs)');
drawBullet('Pain Points', 'High volume of raw inbound leads, manual data entry from conferences and spreadsheets, repetitive cold emails.');
drawBullet('Core Workflows', 'Bulk lead file import (CSV/XLSX), automated lead scoring triage, single-click email outreach generation.');

drawSubHeading('2.3 VP of Sales & Revenue Operations (RevOps)');
drawBullet('Pain Points', 'Inaccurate pipeline forecasts, duplicate lead records, lack of visibility into rep follow-ups.');
drawBullet('Core Workflows', 'Executive analytics dashboard, win-rate tracking, import audit trail oversight, duplicate detection rules.');

// --- 3. SYSTEM ARCHITECTURE & DATA MODEL ---
drawSectionHeading('3', 'System Architecture & Data Model');
drawParagraph('SmartCRM AI employs a modern, full-stack reactive architecture engineered for low-latency client updates, seamless offline operation, and optional cloud synchronization via Supabase PostgreSQL.');

drawTable(
  ['Layer / Subsystem', 'Technology Stack', 'Operational Responsibility'],
  [
    ['Frontend Client', 'React 19, TypeScript, Tailwind CSS v4', 'Single-page application, reactive state, responsive UX'],
    ['Design & Icons', 'Lucide React, Motion, Recharts', 'Data visualization, drag-and-drop transitions'],
    ['API & Backend Server', 'Express, Node.js, TSX Runtime', 'RESTful CRUD endpoints, secure AI proxying, batch import'],
    ['AI Engine', 'Google Gemini 2.5 API (@google/genai)', 'Lead qualification scoring, email drafting, sales copilot'],
    ['Persistence Engine', 'Dual-mode: JSON store + Supabase PostgreSQL', 'Resilient local caching + enterprise RLS multi-tenancy'],
  ],
  [110, 150, 244]
);

drawSubHeading('3.1 Core Database Entities & Relationships');
drawBullet('Leads', 'id, userId, name, email, phone, company, title, stage, estimatedValue, source, score, scoreReason, nextAction.');
drawBullet('Deals', 'id, userId, title, company, value, stage (Discovery -> Closed Won), probability, expectedCloseDate, priority.');
drawBullet('Contacts', 'id, userId, name, email, phone, title, company, leadScore, lastContactedAt.');
drawBullet('Companies', 'id, userId, name, domain, industry, size, annualRevenue, totalDealsValue.');
drawBullet('Tasks & Activities', 'id, userId, title, dueDate, priority, completed, entityType, description, timestamp.');
drawBullet('Lead Import History', 'id, userId, filename, totalRows, importedCount, skippedCount, invalidCount, status, errors, createdAt.');

// --- 4. DETAILED FUNCTIONAL REQUIREMENTS ---
drawSectionHeading('4', 'Detailed Functional Requirements');

drawSubHeading('4.1 Executive Dashboard & Pipeline Analytics');
drawBullet('High-Level Metrics', 'Instant calculation of Total Pipeline Value, Active Deals, Aggregate Win Rate (%), and Open Tasks.');
drawBullet('Interactive Visualizations', 'Recharts funnel breakdown (Pipeline by Stage), Revenue Forecast trends, Leads by Channel, and Priority distribution.');
drawBullet('Urgent Action Queue', 'Surfacing high-priority overdue tasks and imminent close dates for immediate rep action.');

drawSubHeading('4.2 Lead Management & Automated AI Scoring');
drawBullet('Pipeline Stages', 'Structured progression: New Inbound -> Contacted -> Qualified -> Proposal Sent -> Closed Won / Lost.');
drawBullet('Dual View Modes', 'Kanban board with visual drag-and-drop / stage advancement and sortable tabular list view.');
drawBullet('AI Predictive Scoring', 'Instant 0-100 quantitative score calculated from prospect company size, budget, urgency, and email domain.');
drawBullet('AI Scoring Rationale', 'Transparent natural-language explanation detailing why the score was assigned and specific risks.');
drawBullet('Action Recommendation', 'Prescriptive immediate sales action (e.g., "Schedule discovery call with VP of Infrastructure").');
drawBullet('AI Outreach Drafter', 'Generates customized outbound emails tailored to the lead stage, pain points, and current pipeline context.');

drawSubHeading('4.3 Automated Bulk Lead Import Engine');
drawBullet('File Ingestion', 'Support for CSV and Microsoft Excel (.xlsx, .xls) files up to 10MB via drag-and-drop or file selector.');
drawBullet('Header Auto-Mapping', 'Intelligent matching of spreadsheet columns to CRM fields (Full Name, Company, Email, Phone, Stage, Source, Value).');
drawBullet('Supported Lead Sources', 'Strict normalization: Inbound Web, Outbound SDR, Referral, Partner Ecosystem, Conference.');
drawBullet('Deduplication & Validation', 'Email syntax checks, duplicate detection against database and file rows with optional auto-skip.');
drawBullet('Live Preview & Validation Table', 'Breakdown of Total Rows, Valid Records, Duplicates, and Invalids with filterable review table.');
drawBullet('Audit History Log', 'Detailed timestamped ledger of previous file imports, success rates, and row-level error reports.');

drawSubHeading('4.4 Deal Pipeline & Revenue Forecasting');
drawBullet('Deal Stages', 'Discovery -> Demo Scheduled -> Proposal Sent -> Negotiation -> Closed Won -> Closed Lost.');
drawBullet('Weighted Pipeline Calculation', 'Probability-weighted forecasting based on stage conversion thresholds.');
drawBullet('Stage Transitions', 'Automated activity logging and timestamp updates upon any stage modification.');

drawSubHeading('4.5 Contacts & Companies Relationship Directory');
drawBullet('Bi-directional Linking', 'Associate individual contacts with company accounts and multi-stakeholder deal opportunities.');
drawBullet('Firmographic Profiling', 'Track industry vertical, employee headcounts, estimated annual revenue, and total customer lifetime value.');

drawSubHeading('4.6 AI Sales Copilot (Conversational Assistant)');
drawBullet('Pipeline Context Grounding', 'RAG-inspired contextual grounding injecting the current user pipeline metrics directly into Gemini prompts.');
drawBullet('Natural Language Inquiries', 'Answer rep questions such as "Which enterprise deals are at risk?" or "Summarize today\'s top leads."');
drawBullet('Strategic Coaching', 'Suggest negotiation strategies, objection handling tips, and customer re-engagement plans.');

// --- 5. SECURITY, PRIVACY & COMPLIANCE ---
drawSectionHeading('5', 'Security, Data Privacy & Governance');
drawParagraph('SmartCRM AI adheres strictly to modern enterprise data governance principles:');
drawBullet('Zero Client-Side API Key Exposure', 'All Gemini AI and third-party API credentials reside securely on the server-side proxy.');
drawBullet('Multi-Tenant Data Isolation', 'Supabase Row Level Security (RLS) policies enforce strict per-user boundaries (auth.uid() = user_id).');
drawBullet('Local Fallback Encryption', 'Offline browser storage isolates credentials and customer data per origin without external leak vectors.');
drawBullet('Input Sanitization & Validation', 'Strict file-type whitelisting, 10MB payload size limits, and regex email validation on all ingest endpoints.');

// --- 6. NON-FUNCTIONAL REQUIREMENTS ---
drawSectionHeading('6', 'Non-Functional Requirements (NFRs)');
drawTable(
  ['Category', 'Specification', 'Verification Method'],
  [
    ['Performance', 'Page load < 1.2s; UI interactions < 100ms; Filter response < 50ms', 'Lighthouse & browser performance traces'],
    ['Availability', '99.9% uptime with instant client-side offline mode', 'Automated healthcheck polling (/api/health)'],
    ['Scalability', 'Support 10,000+ active contacts and 5,000+ leads per account', 'Stress-testing JSON & Postgres indexes'],
    ['Responsiveness', 'Full desktop, tablet, and mobile adaptive layout', 'Tailwind responsive viewport validation'],
  ],
  [90, 240, 174]
);

// --- 7. RELEASE CRITERIA & FUTURE ROADMAP ---
drawSectionHeading('7', 'Release Criteria & Future Roadmap');
drawSubHeading('7.1 Release Criteria (v2.4 GA)');
drawBullet('All core CRUD operations across Leads, Deals, Contacts, Companies, and Tasks verify green.');
drawBullet('Automated Lead Import handles 1,000+ row CSV and XLSX files in < 3 seconds with accurate deduplication.');
drawBullet('AI Scoring and Email Generation produce valid responses within 2.5 seconds with heuristic fallback guarantees.');
drawBullet('Zero runtime errors, TypeScript strict compilation, and responsive layout compatibility.');

drawSubHeading('7.2 Future Roadmap (v3.0+)');
drawBullet('Native Email Synchronization', 'Bi-directional Gmail and Microsoft Outlook OAuth sync for automated email tracking.');
drawBullet('Meeting Intelligence', 'Audio transcription and automated action-item extraction from recorded customer calls.');
drawBullet('Predictive Churn Detection', 'Account health scoring to alert Customer Success teams before renewal drop-offs.');

// Document Finalization
const range = doc.bufferedPageRange();
for (let i = range.start; i < range.start + range.count; i++) {
  doc.switchToPage(i);
  
  // Footer rule
  doc.rect(54, 742, 504, 0.5).fill(BORDER);
  
  // Footer text
  doc.fillColor(MUTED).font('Helvetica').fontSize(8).text(
    'SmartCRM AI  —  Confidential & Proprietary Product Requirements Document',
    54,
    750,
    { align: 'left' }
  );
  
  doc.fillColor(MUTED).font('Helvetica').fontSize(8).text(
    `Page ${i + 1} of ${range.count}`,
    54,
    750,
    { align: 'right' }
  );
}

doc.end();

writeStream.on('finish', () => {
  console.log('PRD PDF generated successfully at:', outputPath);
});
writeStream.on('error', (err) => {
  console.error('Error generating PRD PDF:', err);
});
