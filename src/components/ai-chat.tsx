"use client";

import { useState } from "react";
import type { ChatMessage } from "@/types";
import { AIChatHeader } from "./ai-chat-header";
import type { FileUIPart } from "ai";
import { Separator } from "@/components/ui/separator";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { Response } from "@/components/ai-elements/response";
import { Suggestions, Suggestion } from "./ai-elements/suggestion";
import { Actions, Action } from "@/components/ai-elements/actions";
import { Message, MessageContent } from "@/components/ai-elements/message";
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
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
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
import { useChatStore } from "@/store/chat-store";

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
  const { messages, status, sendMessage, regenerate } = useChatStore();
  const [input, setInput] = useState("");
  const [model, setModel] = useState<string>(models[0].value);
  const [webSearch, setWebSearch] = useState(false);

  const handleSubmit = async (message: PromptInputMessage): Promise<void> => {
    if (!message.text?.trim()) return;
    await sendMessage(message.text, model);
    setInput("");
  };

  const handleRegenerate = async (): Promise<void> => {
    await regenerate(model);
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
                              onClick={handleRegenerate}
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

          <Suggestions className="w-full flex flex-wrap justify-center gap-2 pt-3">
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
