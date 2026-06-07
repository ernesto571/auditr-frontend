import jsPDF from "jspdf";

interface AuditReport {
  overall_score: number;
  verdict: string;
  summary: string;
  headline?: string;
  key_insight: string;
  scores: {
    ui_ux: number;
    performance: number;
    seo: number;
    accessibility: number;
    conversion: number;
  };
  findings: {
    category: string;
    severity: "high" | "medium" | "low";
    title: string;
    description: string;
    recommendation: string;
  }[];
  strengths: string[];
  quick_wins: string[];
  ui_ux_notes: {
    visual_hierarchy: string;
    readability: string;
    spacing: string;
    cta_visibility: string;
    responsiveness: string;
  };
  conversion_notes: {
    cta_clarity: string;
    trust_signals: string;
    distractions: string;
    above_fold: string;
  };
  priority_order: string[];
  scan_meta: {
    url: string;
    scan_time_seconds: number;
    scanned_at: string;
    total_findings: number;
    high: number;
    medium: number;
    passing: number;
  };
}

// ─── PDF ────────────────────────────────────────────────────────────────────

export const handleExportPDF = (report: AuditReport) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const maxWidth = pageWidth - margin * 2;
  let y = 20;

  const addText = (
    text: string,
    size = 10,
    bold = false,
    color: [number, number, number] = [30, 30, 30]
  ) => {
    doc.setFontSize(size);
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setTextColor(...color);
    const lines = doc.splitTextToSize(text, maxWidth);
    if (y + lines.length * 7 > 280) { doc.addPage(); y = 20; }
    doc.text(lines, margin, y);
    y += lines.length * 7 + 3;
  };

  const addGap = (n = 5) => { y += n; };

  const addDivider = () => {
    doc.setDrawColor(200, 198, 190);
    doc.line(margin, y, pageWidth - margin, y);
    y += 6;
  };

  const addLabel = (text: string) =>
    addText(`// ${text}`, 8, true, [155, 152, 144]);

  const severityColor = (s: string): [number, number, number] =>
    s === "high" ? [192, 57, 43] : s === "medium" ? [138, 96, 0] : [60, 60, 60];

  const displayUrl = report.scan_meta.url.replace(/^https?:\/\/(www\.)?/, "");
  const scannedAt  = new Date(report.scan_meta.scanned_at).toLocaleString();

  // ── Header
  addText("AUDITR", 16, true, [10, 10, 8]);
  addText("Website Audit Report", 10, false, [107, 105, 96]);
  addGap(2);
  addText(displayUrl, 11, true, [10, 10, 8]);
  addText(`Scanned: ${scannedAt}  ·  Scan time: ${report.scan_meta.scan_time_seconds}s`, 9, false, [107, 105, 96]);
  addDivider();

  // ── Headline
  if (report.headline) {
    addText(report.headline, 11, true, [255, 62, 0]);
    addGap(2);
  }

  // ── Overall score
  addLabel("OVERALL SCORE");
  addText(`${report.overall_score}/100  —  ${report.verdict.replace("_", " ").toUpperCase()}`, 13, true, [10, 10, 8]);
  addText(
    `${report.scan_meta.total_findings} findings  ·  ${report.scan_meta.high} high  ·  ${report.scan_meta.medium} medium  ·  ${report.scan_meta.passing} passing`,
    9, false, [107, 105, 96]
  );
  addGap();

  // ── Category scores
  addLabel("CATEGORY SCORES");
  const scores = report.scores;
  const scoreLines = [
    `UI / UX: ${scores.ui_ux}/100`,
    `Performance: ${scores.performance}/100`,
    `SEO: ${scores.seo}/100`,
    `Accessibility: ${scores.accessibility}/100`,
    `Conversion: ${scores.conversion}/100`,
  ];
  scoreLines.forEach((l) => addText(l, 10));
  addDivider();

  // ── Summary
  addLabel("SUMMARY");
  addText(report.summary, 10);
  addGap();

  // ── Key insight
  addLabel("KEY INSIGHT");
  addText(report.key_insight, 10, false, [10, 10, 8]);
  addDivider();

  // ── Findings
  addLabel("ISSUES FOUND");
  addGap(2);
  report.findings.forEach((f) => {
    addText(`[${f.severity.toUpperCase()}] ${f.title}`, 10, true, severityColor(f.severity));
    addText(`Category: ${f.category.replace("_", " ").toUpperCase()}`, 8, false, [155, 152, 144]);
    addText(f.description, 10);
    addText(`>> ${f.recommendation}`, 10, false, [60, 60, 60]);
    addGap(3);
  });
  addDivider();

  // ── Strengths
  addLabel("PASSING CHECKS");
  report.strengths.forEach((s) => addText(`>>  ${s}`, 10, false, [26, 92, 53]));
  addGap();

  // ── Quick wins
  addLabel("QUICK WINS — FIX THESE FIRST");
  report.quick_wins.forEach((q) => addText(`>>  ${q}`, 10));
  addDivider();

  // ── UI/UX notes
  addLabel("UI / UX NOTES");
  const ux = report.ui_ux_notes;
  addText(`Visual Hierarchy: ${ux.visual_hierarchy}`, 10);
  addText(`Readability: ${ux.readability}`, 10);
  addText(`Spacing: ${ux.spacing}`, 10);
  addText(`CTA Visibility: ${ux.cta_visibility}`, 10);
  addText(`Responsiveness: ${ux.responsiveness}`, 10);
  addGap();

  // ── Conversion notes
  addLabel("CONVERSION NOTES");
  const cv = report.conversion_notes;
  addText(`CTA Clarity: ${cv.cta_clarity}`, 10);
  addText(`Trust Signals: ${cv.trust_signals}`, 10);
  addText(`Distractions: ${cv.distractions}`, 10);
  addText(`Above Fold: ${cv.above_fold}`, 10);
  addDivider();

  // ── Priority order
  addLabel("PRIORITY ORDER");
  report.priority_order.forEach((p, i) => addText(`${i + 1}. ${p}`, 10));
  addGap();

  // ── Footer
  addText(`Generated by Auditr  ·  auditr.io  ·  ${new Date().toLocaleDateString()}`, 8, false, [155, 152, 144]);

  doc.save(`auditr_${displayUrl.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`);
};

// ─── CSV ────────────────────────────────────────────────────────────────────

export const handleExportCSV = (report: AuditReport) => {
  const displayUrl = report.scan_meta.url.replace(/^https?:\/\/(www\.)?/, "");
  const escape = (val: unknown) => `"${String(val ?? "").replace(/"/g, '""')}"`;

  const rows: string[][] = [];

  // Meta
  rows.push(["SECTION", "FIELD", "VALUE"]);
  rows.push(["META", "URL", report.scan_meta.url]);
  rows.push(["META", "Scanned At", new Date(report.scan_meta.scanned_at).toLocaleString()]);
  rows.push(["META", "Scan Time (s)", String(report.scan_meta.scan_time_seconds)]);
  rows.push([]);

  // Overall
  rows.push(["SCORE", "Overall", String(report.overall_score)]);
  rows.push(["SCORE", "Verdict", report.verdict]);
  rows.push(["SCORE", "UI/UX", String(report.scores.ui_ux)]);
  rows.push(["SCORE", "Performance", String(report.scores.performance)]);
  rows.push(["SCORE", "SEO", String(report.scores.seo)]);
  rows.push(["SCORE", "Accessibility", String(report.scores.accessibility)]);
  rows.push(["SCORE", "Conversion", String(report.scores.conversion)]);
  rows.push([]);

  // Summary
  rows.push(["SUMMARY", "", report.summary]);
  rows.push(["KEY INSIGHT", "", report.key_insight]);
  rows.push([]);

  // Findings
  rows.push(["FINDINGS", "Category", "Severity", "Title", "Description", "Recommendation"]);
  report.findings.forEach((f) =>
    rows.push(["FINDING", f.category, f.severity, f.title, f.description, f.recommendation])
  );
  rows.push([]);

  // Strengths
  rows.push(["STRENGTHS", "", ""]);
  report.strengths.forEach((s) => rows.push(["STRENGTH", "", s]));
  rows.push([]);

  // Quick wins
  rows.push(["QUICK WINS", "", ""]);
  report.quick_wins.forEach((q) => rows.push(["QUICK WIN", "", q]));

  const csv = rows.map((r) => r.map(escape).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `auditr_${displayUrl.replace(/[^a-zA-Z0-9]/g, "_")}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};