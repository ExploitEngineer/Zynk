"use client";

import { Home, MessageSquarePlus, Search } from "lucide-react";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useChatStore } from "@/store/chat-store";
import { ChangeEvent, useState } from "react";
import { SearchDialog } from "./search-dialog";

export function NavMain() {
  const { createChat } = useChatStore();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("New Chat");
  const [searchOpen, setSearchOpen] = useState(false);

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
    <>
      <SidebarGroup>
        <SidebarMenu>
          <SidebarMenuItem onDoubleClick={handleDoubleClick}>
            <SidebarMenuButton
              className="flex !cursor-pointer items-center"
              tooltip="new chat"
            >
              <MessageSquarePlus />
              {isEditing ? (
                <input
                  type="text"
                  value={title}
                  onChange={(e: ChangeEvent<HTMLInputElement>): void =>
                    setTitle(e.target.value)
                  }
                  onKeyDown={handleKeyDown}
                  autoFocus
                  className="rounded border-0 bg-transparent px-1 text-sm outline-0 focus:ring-0"
                />
              ) : (
                <span className="ml-2">{title}</span>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              className="!cursor-pointer"
              onClick={() => setSearchOpen(true)}
              tooltip="search chat"
            >
              <Search />
              <span>Search chats</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              className="!cursor-not-allowed opacity-60"
              tooltip="Coming soon"
              disabled
            >
              <Home />
              <span className="flex items-center gap-2">
                Library
                <span className="rounded bg-gray-200 px-1 text-[10px] font-medium text-gray-600">
                  Soon
                </span>
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
