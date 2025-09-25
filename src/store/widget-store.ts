import { create } from "zustand";
import type { ChatStatus } from "./chat-store";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
}

interface WidgetChatState {
  messages: ChatMessage[];
  status: ChatStatus;
  sendMessage: (text: string, model: string) => Promise<void>;
}

export const useWidgetChatStore = create<WidgetChatState>((set) => ({
  messages: [],
  status: "ready",

  sendMessage: async (text, model) => {
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      text,
    };

    set((state) => ({
      messages: [...state.messages, userMessage],
      status: "submitted",
    }));

    try {
      const res = await fetch("/api/widget-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, model }),
      });

      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      let assistantText = "";
      const assistantMessageId = crypto.randomUUID();

      set((state) => ({
        messages: [
          ...state.messages,
          { id: assistantMessageId, role: "assistant", text: "" },
        ],
      }));

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        assistantText += chunk;

        set((state) => ({
          messages: state.messages.map((m) =>
            m.id === assistantMessageId ? { ...m, text: assistantText } : m,
          ),
        }));
      }

      set({ status: "ready" });
    } catch (err) {
      console.error("Error sending message:", err);
      set({ status: "error" });
    }
  },
}));
