import toast from "react-hot-toast";
import axios from "../lib/axios"
import { create } from "zustand";

interface Report {
    id: number;
    domain: string;
    overall_score: number;
    verdict: string;
    summary: string;
    headline: string;
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
    saved: boolean;
    updated_at: Date;
}

interface ReportStore {
    reports: Report[];
    savedReports: Report[];
    isLoading: boolean;
    isSaving: boolean;
    error: string | null;
    fetchAllReports: () => void;
    fetchSavedReports: () => void;
    saveReport: (id: number) => Promise<void>;
    removeFromSavedReport: (id: number) => Promise<void>;
}

export const useReportStore = create<ReportStore>((set) => ({
    reports: [],
    savedReports: [],
    isLoading: false,
    isSaving: false,
    error: null,

    fetchAllReports : async () => {
        console.log("📡 fetchAllReports starting..")
        set({ isLoading: true, error: null });
        try {
            const res = await axios.get("/reports");
            console.log("✅ fetchAllReports success", res.data);
            set({ reports: res.data.reports, isLoading: false });

        } catch (err:any) {
            console.error("🔴 fetchAllReport : failed", {
                status: err.response?.status,
                data: err.response?.data,
                message: err.message,
            });
            set({ error: err.message, isLoading: false });
        }
    },

    fetchSavedReports : async () => {
        console.log("📡 fetchSavedReports starting..")
        set({ isLoading: true, error: null });
        try {
            const res = await axios.get("/reports/saved");
            console.log("✅ fetchSavedReports success", res.data);
            set({ savedReports: res.data.savedReports, isLoading: false });

        } catch (err:any) {
            console.error("🔴 fetchSavedReport : failed", {
                status: err.response?.status,
                data: err.response?.data,
                message: err.message,
            });
            set({ error: err.message, isLoading: false });
        }
    },

    saveReport: async (id) => {
        set({ isSaving: true, error: null });
        try {
            const res = await axios.patch(`/reports/${id}/save`);
            console.log(res)
        
            set((state) => ({
                reports: state.reports?.map((d) => d.id === id ? { ...d, saved: true } : d),
                isSaving: false
            }));
            toast.success("Report saved.");
        } catch (err:any) {
            set({ error: err.message, isSaving: false });
        }
    },

    removeFromSavedReport: async(id) => {
        try {
            const res = await axios.patch(`/reports/${id}/unsave`);
            console.log(res)
        
            set((state) => ({
                reports: state.reports?.map((d) => d.id === id ? { ...d, saved: true } : d),
                isSaving: false
            }));
            toast.success("Removed from saved report.");
        } catch (err:any) {
            set({ error: err.message, isSaving: false });
        }
    }

}))