import { create } from "zustand";
import { authClient } from "@/lib/auth-client";
import { User } from "@/types/user";

interface AuthState {
  user: User | null;
  fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  fetchUser: async () => {
    try {
      const session = await authClient.getSession();
      if (!session.data) {
        set({ user: null });
        return;
      }

      const res = await fetch("/api/user", {
        method: "POST",
        body: JSON.stringify({ userId: session.data.user.id }),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        console.error("Failed to fetch user", res.statusText);
        set({ user: null });
        return;
      }

      const data = await res.json();
      const mappedUser: User = {
        name: data.name,
        email: data.email,
        image: data.image ?? null,
        plan: data.plan ?? "Free",
      };

      set({ user: mappedUser });
    } catch (err) {
      console.error("Auth error:", err);
      set({ user: null });
    }
  },
}));
