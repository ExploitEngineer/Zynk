import { create } from "zustand";
import { User } from "@/types/user";

interface AuthState {
  user: User | null;
  fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  fetchUser: async () => {
    try {
      const res = await fetch("/api/me");
      if (!res.ok) {
        set({ user: null });
        return;
      }

      const data = await res.json();
      set({ user: data });
    } catch (err) {
      console.error("Auth fetch error:", err);
      set({ user: null });
    }
  },
}));
