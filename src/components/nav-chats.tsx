"use client";

import { FilePen, Loader2, MoreHorizontal, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useChatStore } from "@/store/chat-store";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export function NavChats() {
  const router = useRouter();
  const { isMobile } = useSidebar();

  const [title, setTitle] = useState<string>("");
  const {
    chats,
    fetchChats,
    renameChat,
    renamingChatId,
    deletingChatId,
    isDeletingChat,
    setRenamingChatId,
    setDeletingChatId,
    deleteChat,
  } = useChatStore();

  useEffect((): void => {
    fetchChats();
  }, [fetchChats]);

  const handleDeleteChat = async (chatId: string) => {
    await deleteChat(chatId);
    router.push("/chat");
  };

  return (
    <>
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel className="text-md mb-2">chats</SidebarGroupLabel>
        <SidebarMenu>
          {chats.map((chat) => (
            <SidebarMenuItem key={chat.title}>
              {renamingChatId === chat.id ? (
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      renameChat(chat.id, title.trim() || chat.title);
                    }
                    if (e.key === "Escape") {
                      setRenamingChatId(null);
                      setTitle("");
                    }
                  }}
                  className="w-full rounded border bg-transparent px-2 py-1 text-sm outline-none focus:ring-0"
                />
              ) : (
                <SidebarMenuButton asChild>
                  <Link href={`/chat/${chat.id}`}>
                    <span>{chat.title}</span>
                  </Link>
                </SidebarMenuButton>
              )}

              <DropdownMenu>
                {renamingChatId === chat.id ? null : (
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuAction className="cursor-pointer" showOnHover>
                      <MoreHorizontal />
                      <span className="sr-only">More</span>
                    </SidebarMenuAction>
                  </DropdownMenuTrigger>
                )}
                <DropdownMenuContent
                  className="w-48 rounded-lg"
                  side={isMobile ? "bottom" : "right"}
                  align={isMobile ? "end" : "start"}
                >
                  <DropdownMenuItem
                    onClick={() => {
                      setRenamingChatId(chat.id);
                      setTitle(chat.title);
                    }}
                  >
                    <FilePen className="text-muted-foreground" />
                    <span>Rename</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setDeletingChatId(chat.id)}
                    className="cursor-pointer"
                  >
                    <Trash2 color="red" />
                    <span className="text-red-500">Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>

      <Dialog
        open={!!deletingChatId}
        onOpenChange={() => setDeletingChatId(null)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Chat</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the chat{" "}
              <span className="font-semibold text-white">
                {chats.find((c) => c.id === deletingChatId)?.title ??
                  "Unknown chat"}
              </span>
              ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="button"
                className="cursor-pointer bg-red-600 text-white transition-all duration-300 hover:scale-110 hover:bg-red-800"
                disabled={isDeletingChat}
                onClick={() =>
                  deletingChatId && handleDeleteChat(deletingChatId)
                }
              >
                {isDeletingChat ? (
                  <div className="flex items-center gap-2">
                    <span>Deleting</span>
                    <Loader2 className="animate-spin" />
                  </div>
                ) : (
                  "Delete"
                )}
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
