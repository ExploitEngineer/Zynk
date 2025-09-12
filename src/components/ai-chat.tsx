"use client";

import type { ChatStatus, FileUIPart } from "ai";
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
import { TextShimmer } from "@/components/ui/text-shimmer";
import { Suggestions, Suggestion } from "./ai-elements/suggestion";
import { Actions, Action } from "@/components/ai-elements/actions";
import { useState } from "react";
import { Response } from "@/components/ai-elements/response";
import {
  GlobeIcon,
  RefreshCcwIcon,
  CopyIcon,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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

const suggestions: string[] = [
  "Can you explain how to play tennis?",
  "What is the weather in Tokyo?",
  "How does machine learning work?",
];

const AIChat = () => {
  const [input, setInput] = useState("");
  const [model, setModel] = useState<string>(models[0].value);
  const [webSearch, setWebSearch] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<ChatStatus>("ready");

  const pushMessage = (m: ChatMessage): void =>
    setMessages((prev: ChatMessage[]): ChatMessage[] => [...prev, m]);

  const handleSubmit = async (message: PromptInputMessage): Promise<void> => {
    const hasText = Boolean(message.text?.trim());
    const hasFiles = Boolean(message.files && message.files.length > 0);
    if (!(hasText || hasFiles)) return;

    const uploadedFiles: File[] =
      message.files?.map((file: any): File => file.file as File) || [];

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

  const regenerate = async (): Promise<void> => {
    const lastUser = [...messages]
      .reverse()
      .find((m: ChatMessage): boolean => m.role === "user");
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
    <section className="w-full h-screen overflow-y-hidden font-inter">
      <AIChatHeader />
      <Separator />
      <div className="max-w-4xl mx-auto h-[94%] p-6">
        <div className="flex flex-col h-full">
          <Conversation className="h-full">
            <ConversationContent>
              {messages.map((message: ChatMessage) => (
                <div key={message.id}>
                  <Message from={message.role}>
                    <MessageContent>
                      <Response>{message.text}</Response>
                    </MessageContent>
                  </Message>

                  {message.role === "assistant" &&
                    message.id === messages.at(-1)?.id && (
                      <Actions className="mt-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Action
                              className="cursor-pointer"
                              onClick={regenerate}
                              label="Retry"
                            >
                              <RefreshCcwIcon className="size-4" />
                            </Action>
                          </TooltipTrigger>
                          <TooltipContent>regenerate</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Action className="cursor-pointer" label="Like">
                              <ThumbsUp className="size-4" />
                            </Action>
                          </TooltipTrigger>
                          <TooltipContent>Like</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Action className="cursor-pointer" label="DisLike">
                              <ThumbsDown className="size-4" />
                            </Action>
                          </TooltipTrigger>
                          <TooltipContent>unlike</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Action
                              className="cursor-pointer"
                              onClick={(): Promise<void> =>
                                navigator.clipboard.writeText(message.text)
                              }
                              label="Copy"
                            >
                              <CopyIcon className="size-4" />
                            </Action>
                          </TooltipTrigger>
                          <TooltipContent>copy</TooltipContent>
                        </Tooltip>
                      </Actions>
                    )}
                </div>
              ))}

              {status === "submitted" && (
                <TextShimmer
                  className="font-mono text-sm"
                  duration={1.3}
                  spread={2}
                >
                  Thinking...
                </TextShimmer>
              )}
            </ConversationContent>
            <ConversationScrollButton />
          </Conversation>

          <Suggestions className="w-full flex flex-wrap justify-center gap-2">
            {suggestions.map((suggestion: string) => (
              <Suggestion key={suggestion} suggestion={suggestion} />
            ))}
          </Suggestions>
          <PromptInput
            onSubmit={handleSubmit}
            className="mt-4"
            globalDrop
            multiple
          >
            <PromptInputBody>
              <PromptInputAttachments>
                {(attachment: FileUIPart & { id: string }) => (
                  <PromptInputAttachment data={attachment} />
                )}
              </PromptInputAttachments>
              <PromptInputTextarea
                onChange={(e): void => setInput(e.target.value)}
                value={input}
              />
            </PromptInputBody>

            <PromptInputToolbar>
              <PromptInputTools>
                <PromptInputActionMenu>
                  <PromptInputActionMenuTrigger className="cursor-pointer" />
                  <PromptInputActionMenuContent>
                    <PromptInputActionAddAttachments />
                  </PromptInputActionMenuContent>
                </PromptInputActionMenu>

                <PromptInputButton
                  variant={webSearch ? "default" : "ghost"}
                  onClick={(): void =>
                    setWebSearch((s: boolean): boolean => !s)
                  }
                  className="cursor-pointer"
                >
                  <GlobeIcon size={16} />
                  <span className="hidden sm:block">Search</span>
                </PromptInputButton>

                <PromptInputModelSelect
                  onValueChange={(v: string): void => setModel(v)}
                  value={model}
                >
                  <PromptInputModelSelectTrigger className="cursor-pointer">
                    <PromptInputModelSelectValue />
                  </PromptInputModelSelectTrigger>
                  <PromptInputModelSelectContent>
                    {models.map((m: Models) => (
                      <PromptInputModelSelectItem
                        className="cursor-pointer"
                        key={m.value}
                        value={m.value}
                      >
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
