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

  const handleKeyDown = async (
    e: React.KeyboardEvent<HTMLInputElement>,
  ): Promise<void> => {
    if (e.key === "Enter") {
      await createChat(title);
      setTitle("New Chat");
      setIsEditing(false);
    }
  };

  return (
    <SidebarGroup>
      <SidebarMenu>
        <SidebarMenuItem onDoubleClick={handleDoubleClick}>
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
