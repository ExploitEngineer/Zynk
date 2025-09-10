"use client";

import type { ChatStatus } from "ai";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputAttachment,
  PromptInputAttachments,
  PromptInputBody,
  PromptInputButton,
  type PromptInputMessage,
  PromptInputModelSelect,
  PromptInputModelSelectContent,
  PromptInputModelSelectItem,
  PromptInputModelSelectTrigger,
  PromptInputModelSelectValue,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { Actions, Action } from "@/components/ai-elements/actions";
import { useState } from "react";
import { Response } from "@/components/ai-elements/response";
import { GlobeIcon, RefreshCcwIcon, CopyIcon } from "lucide-react";
import { Loader } from "@/components/ai-elements/loader";
import { Separator } from "@/components/ui/separator";
import { AIChatHeader } from "./ai-chat-header";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  files?: File[];
};

interface Models {
  name: string;
  value: string;
}

const models: Models[] = [
  { name: "GPT 4.1 Nano", value: "gpt-4.1-nano" },
  { name: "GPT 4o", value: "gpt-4o" },
];

const AIChat = () => {
  const [input, setInput] = useState("");
  const [model, setModel] = useState<string>(models[0].value);
  const [webSearch, setWebSearch] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<ChatStatus>("ready");

  const pushMessage = (m: ChatMessage) => setMessages((prev) => [...prev, m]);

  const handleSubmit = async (message: PromptInputMessage) => {
    const hasText = Boolean(message.text?.trim());
    const hasFiles = Boolean(message.files && message.files.length > 0);
    if (!(hasText || hasFiles)) return;

    const uploadedFiles: File[] =
      message.files?.map((file: any) => file.file as File) || [];

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: message.text || "Sent with attachments",
      files: uploadedFiles,
    };

    pushMessage(userMessage);
    setInput("");
    setStatus("submitted");

    try {
      const res = await fetch("/api/openai", {
        method: "POST",
        body: JSON.stringify({
          messages: messages.concat(userMessage),
          model,
          webSearch,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const body = await res.text();
        throw new Error(body || "API request failed");
      }

      const data = await res.json();
      const assistantText: string = data?.text ?? "No response";

      pushMessage({
        id: `assistant-${Date.now()}`,
        role: "assistant",
        text: assistantText,
      });

      setStatus("ready");
    } catch (err) {
      console.error("AI fetch error", err);
      pushMessage({
        id: `assistant-error-${Date.now()}`,
        role: "assistant",
        text: `Error: ${String(err ?? "Unknown")}`,
      });
      setStatus("error");
    }
  };

  const regenerate = async () => {
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    if (!lastUser) return;

    setStatus("submitted");

    try {
      const resp = await fetch("/api/openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages,
          model,
          webSearch,
        }),
      });

      if (!resp.ok) {
        throw new Error((await resp.text()) || "API request failed");
      }

      const data = await resp.json();
      const assistantText: string = data?.text ?? "No response";

      pushMessage({
        id: `assistant-${Date.now()}`,
        role: "assistant",
        text: assistantText,
      });

      setStatus("ready");
    } catch (err) {
      console.error("Regenerate error:", err);
      pushMessage({
        id: `assistant-error-${Date.now()}`,
        role: "assistant",
        text: `Error: ${String(err)}`,
      });
      setStatus("error");
    }
  };

  return (
    <section className="w-full h-screen overflow-y-hidden">
      <AIChatHeader />
      <Separator />
      <div className="max-w-4xl mx-auto h-[94%] p-6">
        <div className="flex flex-col h-full">
          <Conversation className="h-full">
            <ConversationContent>
              {messages.map((message) => (
                <div key={message.id}>
                  <Message from={message.role}>
                    <MessageContent>
                      <Response>{message.text}</Response>
                    </MessageContent>
                  </Message>

                  {message.role === "assistant" &&
                    message.id === messages.at(-1)?.id && (
                      <Actions className="mt-2">
                        <Action onClick={regenerate} label="Retry">
                          <RefreshCcwIcon className="size-3" />
                        </Action>
                        <Action
                          onClick={() =>
                            navigator.clipboard.writeText(message.text)
                          }
                          label="Copy"
                        >
                          <CopyIcon className="size-3" />
                        </Action>
                      </Actions>
                    )}
                </div>
              ))}

              {status === "submitted" && <Loader />}
            </ConversationContent>
            <ConversationScrollButton />
          </Conversation>

          <PromptInput
            onSubmit={handleSubmit}
            className="mt-4"
            globalDrop
            multiple
          >
            <PromptInputBody>
              <PromptInputAttachments>
                {(attachment) => <PromptInputAttachment data={attachment} />}
              </PromptInputAttachments>
              <PromptInputTextarea
                onChange={(e) => setInput(e.target.value)}
                value={input}
              />
            </PromptInputBody>

            <PromptInputToolbar>
              <PromptInputTools>
                <PromptInputActionMenu>
                  <PromptInputActionMenuTrigger />
                  <PromptInputActionMenuContent>
                    <PromptInputActionAddAttachments />
                  </PromptInputActionMenuContent>
                </PromptInputActionMenu>

                <PromptInputButton
                  variant={webSearch ? "default" : "ghost"}
                  onClick={() => setWebSearch((s) => !s)}
                >
                  <GlobeIcon size={16} />
                  <span>Search</span>
                </PromptInputButton>

                <PromptInputModelSelect
                  onValueChange={(v) => setModel(v)}
                  value={model}
                >
                  <PromptInputModelSelectTrigger>
                    <PromptInputModelSelectValue />
                  </PromptInputModelSelectTrigger>
                  <PromptInputModelSelectContent>
                    {models.map((m) => (
                      <PromptInputModelSelectItem key={m.value} value={m.value}>
                        {m.name}
                      </PromptInputModelSelectItem>
                    ))}
                  </PromptInputModelSelectContent>
                </PromptInputModelSelect>
              </PromptInputTools>

              <PromptInputSubmit
                disabled={!input && status === "ready"}
                status={status}
              />
            </PromptInputToolbar>
          </PromptInput>
        </div>
      </div>
    </section>
  );
};

export default AIChat;
