"use client";

import { useEffect } from "react";
import { useChatStore } from "@/store/chat-store";
import AIChat from "@/components/ai-chat";

export default function ChatClient({ chatId }: { chatId: string }) {
  const { setCurrentChat } = useChatStore();

  useEffect(() => {
    setCurrentChat(chatId);
  }, [chatId, setCurrentChat]);

  return <AIChat />;
}
