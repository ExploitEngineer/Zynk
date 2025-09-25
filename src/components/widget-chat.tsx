"use client";

import { useState } from "react";
import type { FileUIPart } from "ai";
import { Separator } from "@/components/ui/separator";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { Response } from "@/components/ai-elements/response";
import { Actions, Action } from "@/components/ai-elements/actions";
import { Message, MessageContent } from "@/components/ai-elements/message";
import { CopyIcon, Check } from "lucide-react";
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
import toast from "react-hot-toast";
import { useWidgetChatStore } from "@/store/widget-store";

interface Models {
  name: string;
  value: string;
}

const models: Models[] = [
  { name: "GPT 4.1 Nano", value: "gpt-4.1-nano" },
  { name: "GPT 4o", value: "gpt-4o" },
  { name: "GPT 5", value: "gpt-5" },
  { name: "GPT 4", value: "gpt-4" },
];

const WidgetChat = () => {
  const { messages, status, sendMessage } = useWidgetChatStore();
  const [input, setInput] = useState("");
  const [model, setModel] = useState<string>(models[0].value);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleSubmit = async (message: PromptInputMessage): Promise<void> => {
    try {
      if (!message.text?.trim()) return;
      setInput("");

      await sendMessage(message.text, model);
    } catch (err: any) {
      console.error("handleSubmit error:", err);
      toast.error(err.message || "Something went wrong while submitting");
    }
  };

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      toast.success("Copied to clipboard!");

      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <section className="font-inter h-screen w-full overflow-hidden">
      <div className="top-0 z-10 flex h-[6%] w-full items-center justify-center py-2">
        <div className="hover:bg-accent cursor-pointer rounded-2xl px-4 py-2 transition-all duration-300">
          <h1 className="font-medium">Zynk AI</h1>
        </div>
      </div>
      <Separator />
      <div className="m-auto h-[94%] max-w-4xl p-6">
        <div className="flex h-full flex-col">
          <Conversation id="conversation" className="h-full">
            <ConversationContent>
              {messages.map((message) => (
                <div key={message.id}>
                  <Message from={message.role}>
                    <MessageContent>
                      <Response parseIncompleteMarkdown>
                        {message.text}
                      </Response>
                    </MessageContent>
                  </Message>

                  {message.role === "assistant" && (
                    <Actions>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Action
                            className="cursor-pointer"
                            onClick={() => handleCopy(message.id, message.text)}
                            label="Copy"
                          >
                            {copiedId === message.id ? (
                              <Check className="size-4 text-green-400" />
                            ) : (
                              <CopyIcon className="size-4" />
                            )}
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
                className="cursor-pointer"
                disabled={!input}
                status={status}
              />
            </PromptInputToolbar>
          </PromptInput>
        </div>
      </div>
    </section>
  );
};

export default WidgetChat;
