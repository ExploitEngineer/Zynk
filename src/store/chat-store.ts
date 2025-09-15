import { create } from "zustand";
import toast from "react-hot-toast";
import type { Chat, ChatMessage } from "@/types";

export type ChatStatus = "ready" | "submitted" | "error";

interface ChatStore {
  chats: Chat[];
  currentChatId: string | null;
  messages: ChatMessage[];
  status: ChatStatus;
  renamingChatId: string | null;
  deletingChatId: string | null;
  isDeletingChat: boolean;

  fetchChats: () => Promise<void>;
  createChat: (title: string) => Promise<string>;
  setRenamingChatId: (chatId: string | null) => void;
  setDeletingChatId: (chatId: string | null) => void;
  renameChat: (chatId: string, newTitle: string) => Promise<void>;
  deleteChat: (chatId: string) => Promise<void>;
  setCurrentChat: (chatId: string) => Promise<void>;
  sendMessage: (text: string, model?: string) => Promise<void>;
  regenerate: (model?: string) => Promise<void>;
}

export const useChatStore = create<ChatStore>((set, get: () => ChatStore) => ({
  chats: [],
  currentChatId: null,
  messages: [],
  status: "ready",
  renamingChatId: null,
  deletingChatId: null,
  isRenamingChat: false,
  isDeletingChat: false,

  fetchChats: async () => {
    try {
      await toast.promise(
        (async () => {
          const res = await fetch("/api/chat");
          if (!res.ok) throw new Error("Failed to fetch chats");

          const chats: Chat[] = await res.json();
          set({ chats });
        })(),
        {
          loading: "Loading chats...",
          success: "Chats loaded successfully",
          error: "Failed to load chats",
        },
      );
    } catch (err) {
      console.error("fetchChats error", err);
    }
  },

  createChat: async (title) => {
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ title }),
      });

      if (!res.ok) throw new Error("Failed to create chat");

      const data = await res.json();
      const newChat: Chat = {
        _id: data.chatId,
        title: data.title,
        lastResponseId: null,
        messages: [],
      };

      set((state: ChatStore) => ({
        chats: [...state.chats, newChat],
        currentChatId: data.chatId,
        messages: [],
      }));

      return data.chatId;
    } catch (err) {
      console.error("createChat error", err);
      toast.error("Failed to create chat");
    }
  },

  setRenamingChatId: (chatId) => {
    set({ renamingChatId: chatId });
  },

  setDeletingChatId: (chatId) => {
    set({ deletingChatId: chatId });
  },

  renameChat: async (chatId, newTitle) => {
    set({ renamingChatId: chatId });

    try {
      const res = await fetch("/api/chat", {
        method: "PATCH",
        body: JSON.stringify({ chatId, newTitle }),
      });

      if (!res.ok) throw new Error("Faied to rename chat");

      set((state) => ({
        chats: state.chats.map((c) =>
          c._id === chatId ? { ...c, title: newTitle } : c,
        ),
        renamingChatId: null,
      }));

      toast.success("Chat renamed");
    } catch (err) {
      console.error("renameChat error", err);
      toast.error("Failed to rename chat");
    }
  },

  deleteChat: async (chatId) => {
    set({ isDeletingChat: true });
    try {
      const res = await fetch("/api/chat", {
        method: "DELETE",
        body: JSON.stringify({ chatId: chatId }),
      });

      if (!res.ok) throw new Error("error deleting chat");

      const data = await res.json();

      set((state) => {
        const updatedChats = state.chats.filter((c) => c._id !== data._id);
        const isCurrentDeleted = state.currentChatId === data._id;

        return {
          chats: updatedChats,
          currentChatId: isCurrentDeleted ? null : state.currentChatId,
          messages: isCurrentDeleted ? [] : state.messages,
        };
      });

      toast.success("Chat deleted");
    } catch (err) {
      console.error("deleteChat error", err);
      toast.error("Failed to delete chat");
    } finally {
      set({ isDeletingChat: false });
    }
  },

  setCurrentChat: async (chatId: string) => {
    try {
      set({ currentChatId: chatId, messages: [], status: "ready" });

      const res = await fetch(`/api/chat/${chatId}`);

      if (!res.ok) {
        throw new Error("Chat not found");
      }

      const chat: Chat = await res.json();
      const uiMessages: ChatMessage[] = (chat.messages ?? []).map((m: any) => ({
        id: m._id?.toString() ?? `msg-${Date.now()}`,
        role: m.role,
        text: m.text,
      }));

      set({ messages: uiMessages, currentChatId: chatId, status: "ready" });
    } catch (err) {
      console.error("setCurrentChat error", err);
      toast.error("Failed to load chat");
    }
  },

  sendMessage: async (text: string, model = "gpt-4.1-nano") => {
    if (!text?.trim()) return;

    // add user message locally
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text,
    };

    set((state) => ({
      messages: [...state.messages, userMessage],
      status: "submitted",
    }));

    let { currentChatId } = get();

    try {
      const res = await fetch("/api/openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatId: currentChatId,
          text,
          model,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "OpenAI request failed");
      }

      const assistantId = `assistant-${Date.now()}`;
      set((state) => ({
        messages: [
          ...state.messages,
          { id: assistantId, role: "assistant", text: "" },
        ],
      }));

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      // stream loop
      while (true) {
        const { value, done } = await reader!.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        accumulated += chunk;

        // update assistant's message text in state
        set((state) => ({
          messages: state.messages.map((m) =>
            m.id === assistantId ? { ...m, text: accumulated } : m,
          ),
        }));
      }

      // done
      set({ status: "ready" });
    } catch (err) {
      console.error("sendMessage error", err);
      const errMsg = `Error: ${String(err ?? "Unknown")}`;
      set((state) => ({
        messages: [
          ...state.messages,
          {
            id: `assistant-error-${Date.now()}`,
            role: "assistant",
            text: errMsg,
          },
        ],
        status: "error",
      }));
    }
  },

  regenerate: async (model = "gpt-4.1-nano") => {
    const { messages, currentChatId } = get();
    if (!currentChatId) {
      toast.error("No chat selected");
      return;
    }

    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    if (!lastUser) {
      toast.error("No user message to regenerate");
      return;
    }

    set({ status: "submitted" });

    try {
      const resp = await fetch("/api/openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatId: currentChatId,
          text: lastUser.text,
          model,
        }),
      });

      if (!resp.ok) throw new Error(await resp.text());

      const assistantId = `assistant-${Date.now()}`;
      set((state) => ({
        messages: [
          ...state.messages,
          { id: assistantId, role: "assistant", text: "" },
        ],
      }));

      const reader = resp.body?.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { value, done } = await reader!.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        accumulated += chunk;
        set((state) => ({
          messages: state.messages.map((m) =>
            m.id === assistantId ? { ...m, text: accumulated } : m,
          ),
        }));
      }

      set({ status: "ready" });
    } catch (err) {
      console.error("regenerate error", err);
      set((state) => ({
        messages: [
          ...state.messages,
          {
            id: `assistant-error-${Date.now()}`,
            role: "assistant",
            text: `Error: ${String(err)}`,
          },
        ],
        status: "error",
      }));
    }
  },
}));
