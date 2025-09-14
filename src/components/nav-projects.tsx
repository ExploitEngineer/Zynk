"use client";

import { FilePen, MoreHorizontal, Trash2 } from "lucide-react";
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
import Link from "next/link";
import { useChatStore } from "@/store/chat-store";
import { useState, useRef } from "react";

export function NavProjects({
  projects,
}: {
  projects: {
    name: string;
    url: string;
  }[];
}) {
  const { isMobile } = useSidebar();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [title, setTitle] = useState<string>("");
  const { renameChat, renamingChatId, setRenamingChatId } = useChatStore();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className="text-md mb-2">chats</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem key={item.url}>
            <SidebarMenuButton asChild>
              {renamingChatId === item.url ? (
                <input
                  type="text"
                  ref={inputRef}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      renameChat(item.url, title.trim() || item.name);
                    }
                    if (e.key === "Escape") {
                      setRenamingChatId(null);
                      setTitle("");
                    }
                  }}
                  className="rounded border-0 bg-transparent text-sm outline-0 focus:ring-0"
                />
              ) : (
                <Link href={item.url}>
                  <span>{item.name}</span>
                </Link>
              )}
            </SidebarMenuButton>
            <DropdownMenu
              onOpenChange={(open) => {
                if (!open && renamingChatId === item.url) {
                  inputRef.current?.focus();
                  inputRef.current?.select();
                }
              }}
            >
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction className="cursor-pointer" showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem
                  onClick={() => {
                    setRenamingChatId(item.url);
                    setTitle(item.name);

                    // Focus input on next tick
                    setTimeout(() => {
                      inputRef.current?.focus();
                      inputRef.current?.select();
                    }, 300);
                  }}
                  className="cursor-pointer"
                >
                  <FilePen className="text-muted-foreground" />
                  <span>Rename</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <Trash2 className="text-red-500" />
                  <span className="text-red-500">Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
