import { create } from "zustand";

interface DailyUsage {
  day: string;
  tokens: number;
}

interface TokenStore {
  usageByDay: DailyUsage[];
  totalUsed: number;
  tokenLimit: number;
  currentPlan: string;
  loading: boolean;
  error: string | null;
  fetchUsage: () => Promise<void>;
}

export const useTokenStore = create<TokenStore>((set) => ({
  usageByDay: [],
  totalUsed: 0,
  tokenLimit: 0,
  currentPlan: "free",
  loading: false,
  error: null,

  fetchUsage: async () => {
    try {
      set({ loading: true, error: null });
      const res = await fetch("/api/usage");
      if (!res.ok) throw new Error("Failed to fetch usage");
      const data = await res.json();

      set({
        usageByDay: Array.isArray(data.usageByDay) ? data.usageByDay : [],
        totalUsed: data.totalUsed ?? 0,
        tokenLimit: data.tokenLimit ?? 0,
        currentPlan: data.currentPlan ?? "free",
        loading: false,
      });
    } catch (err: any) {
      console.error("fetchUsage error:", err);
      set({
        error: err.message || "Unknown error",
        loading: false,
      });
    }
  },
}));
