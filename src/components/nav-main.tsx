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
            className="!cursor-pointer flex items-center"
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
                className="border-0 outline-0 focus:ring-0 rounded px-1 ml-2 text-sm"
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
