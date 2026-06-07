import { create } from "zustand";
import axios from "../lib/axios";

interface AuditReport {
  overall_score: number;
  verdict: string;
  summary: string;
  ui_ux_notes: {
    spacing: string;
    readability: string;
    cta_visibility: string;
    responsiveness: string;
    visual_hierarchy: string;
  };
  conversion_notes: {
    cta_clarity: string;
    trust_signals: string;
    distractions: string;
    above_fold: string;
  };
  findings: {
    category: "ui_ux" | "performance" | "seo" | "accessibility" | "conversion";
    severity: "high" | "medium" | "low";
    title: string;
    description: string;
    recommendation: string;
  }[];
  key_insight: string;
  priority_order: string[];
  quick_wins: string[];
  scan_meta: {
    url: string;
    scan_time_seconds: number;
    scanned_at: string;
    total_findings: number;
    high: number;
    medium: number;
    passing: number;
  };
  scores: {
    ui_ux: number;
    performance: number;
    seo: number;
    accessibility: number;
    conversion: number;
  };
  screenshot_url: string;
  strengths: string[];
}

interface FormData {
  domain: string;
}

interface AuditStore {
  auditReport: AuditReport | null;
  formData: FormData;
  auditRunning: boolean;
  error: string | null;
  runAudit: (data: FormData) => Promise<void>;
  setFormData: (data: Partial<FormData>) => void;
  resetAudit: () => void;
}

const STORAGE_KEY = "auditr_report";

const saveToStorage = (report: AuditReport) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(report));
  } catch (e) {
    console.warn("Failed to save report to localStorage:", e);
  }
};

const loadFromStorage = (): AuditReport | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const clearStorage = () => localStorage.removeItem(STORAGE_KEY);

const initialFormData: FormData = { domain: "" };

export const useAuditStore = create<AuditStore>((set) => ({
  auditReport: loadFromStorage(), // restore last report on page load
  formData: initialFormData,
  auditRunning: false,
  error: null,

  runAudit: async (data) => {
    console.log("📡 runAudit: starting...", data);
    set({ auditRunning: true, error: null, auditReport: null });
    try {
      const res = await axios.post("/run-audit", { domain: data.domain });
      const report: AuditReport = res.data.auditReport;
      console.log("✅ runAudit: success", report);
      saveToStorage(report);
      set({ auditReport: report, auditRunning: false });
    } catch (err: any) {
      const message = err.response?.data?.message ?? err.message ?? "Audit failed";
      console.error("❌ runAudit: error", message);
      set({ error: message, auditRunning: false });
    }
  },

  setFormData: (data) => {
    set((state) => ({ formData: { ...state.formData, ...data } }));
  },

  resetAudit: () => {
    clearStorage();
    set({ auditReport: null, formData: initialFormData });
  },
}));