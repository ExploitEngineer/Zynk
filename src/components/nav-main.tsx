"use client";

import { Home, MessageSquarePlus, Search } from "lucide-react";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { useChatStore } from "@/store/chat-store";
import { ChangeEvent, useState } from "react";

export function NavMain() {
  const { createChat } = useChatStore();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("New Chat");

  const handleDoubleClick = (): void => {
    setIsEditing(true);
  };

  const handleBlur = (): void => {
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      setIsEditing(false);
    }
  };

  return (
    <SidebarGroup>
      <SidebarMenu>
        <SidebarMenuItem
          onDoubleClick={handleDoubleClick}
          onClick={(): Promise<void> => createChat(title)}
        >
          <SidebarMenuButton
            className="flex !cursor-pointer items-center"
            tooltip="new chat"
          >
            <MessageSquarePlus />
            {isEditing ? (
              <Input
                type="text"
                value={title}
                onChange={(e: ChangeEvent<HTMLInputElement>): void =>
                  setTitle(e.target.value)
                }
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                autoFocus
                className="ml-2 rounded border-0 px-1 text-sm outline-0 focus:ring-0"
              />
            ) : (
              <span className="ml-2">{title}</span>
            )}
          </SidebarMenuButton>
        </SidebarMenuItem>

        <SidebarMenuItem>
          <SidebarMenuButton className="!cursor-pointer" tooltip="search chat">
            <Search />
            <span>Search chats</span>
          </SidebarMenuButton>
        </SidebarMenuItem>

        <SidebarMenuItem>
          <SidebarMenuButton className="!cursor-pointer" tooltip="library">
            <Home />
            <span>Library</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
