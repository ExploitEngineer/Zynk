"use client";

import { useState } from "react";
import type { ChatMessage } from "@/types";
import AIChatHeader from "./ai-chat-header";
import type { FileUIPart } from "ai";
import { Separator } from "@/components/ui/separator";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { Response } from "@/components/ai-elements/response";
import { Actions, Action } from "@/components/ai-elements/actions";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
  GlobeIcon,
  RefreshCcwIcon,
  CopyIcon,
  Check,
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
import { FeedbackDialog } from "./feedback-dialog";
import { useChatStore } from "@/store/chat-store";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface Models {
  name: string;
  value: string;
}

const models: Models[] = [
  { name: "GPT 4.1 Nano", value: "gpt-4.1-nano" },
  { name: "GPT 4o", value: "gpt-4o" },
];

const AIChat = () => {
  const router = useRouter();
  const {
    messages,
    status,
    currentChatId,
    createChat,
    sendMessage,
    renameChat,
    regenerate,
    setCurrentMessageId,
  } = useChatStore();
  const [input, setInput] = useState("");
  const [model, setModel] = useState<string>(models[0].value);
  const [webSearch, setWebSearch] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);

  const handleSubmit = async (message: PromptInputMessage): Promise<void> => {
    if (!message.text?.trim()) return;
    setInput("");

    if (!currentChatId) {
      const newChatId = await createChat("new chat");

      if (!newChatId) {
        toast.error("error creating new chat");
        return;
      }

      router.push(`/chat/${newChatId}`);

      try {
        const res = await fetch("/api/chat-name", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: message.text }),
        });

        if (!res.ok) throw new Error(await res.text());

        const data = await res.json();
        const title = data?.title || "new chat";
        await renameChat(newChatId, title);
      } catch (err) {
        toast.error("chat-name generation failed");
        console.error(err);
      }

      await sendMessage(message.text, model);
      return;
    }

    await sendMessage(message.text, model);
  };

  const handleLike = (messageId: string) => {
    toast.promise(
      setCurrentMessageId(messageId, "like").then((updated) => {
        if (updated.like) {
          return "Liked response!";
        } else {
          return "Removed like!";
        }
      }),
      {
        loading: "Saving...",
        success: (msg) => msg,
        error: <b>Could not save reaction.</b>,
      },
    );
  };

  const handleRegenerate = async (): Promise<void> => {
    await regenerate(model);
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
      <AIChatHeader />
      <Separator />
      <div className="mx-auto h-[94%] p-6">
        <div className="flex h-full flex-col">
          <Conversation id="conversation" className="h-full">
            <ConversationContent>
              {messages.map((message: ChatMessage) => (
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
                          <Action
                            className="cursor-pointer"
                            label="Like"
                            onClick={() => handleLike(message.id)}
                          >
                            <ThumbsUp
                              fill={message.like ? "currentColor" : "none"}
                              className="size-4"
                            />
                          </Action>
                        </TooltipTrigger>
                        <TooltipContent>Like</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger>
                          <Action
                            className="cursor-pointer"
                            label="feedback"
                            onClick={() => setFeedbackDialogOpen(true)}
                          >
                            <ThumbsDown className="size-4" />
                          </Action>
                        </TooltipTrigger>
                        <TooltipContent>
                          Provide Response Feedback
                        </TooltipContent>
                      </Tooltip>

                      <FeedbackDialog
                        open={feedbackDialogOpen}
                        onOpenChange={setFeedbackDialogOpen}
                        messageId={message.id}
                      />
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

export default AIChat;
