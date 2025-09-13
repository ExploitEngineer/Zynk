"use client";

import * as React from "react";
import { useSidebar } from "@/components/ui/sidebar";
import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser, type UserPlan } from "@/components/nav-user";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type { User, Chat } from "@/types";
import { useChatStore } from "@/store/chat-store";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { open } = useSidebar();
  const { chats, fetchChats } = useChatStore();

  React.useEffect((): void => {
    fetchChats();
  }, [fetchChats]);

  const user: User = {
    name: "shadcn",
    plan: "Free" as UserPlan,
    avatar: "/avatars/shadcn.jpg",
    email: "abdulrafayofficial.work@gmail.com",
  };

  return (
    <Sidebar className="font-code" collapsible="icon" {...props}>
      <SidebarHeader className="flex flex-row items-center justify-between gap-0">
        <Link href="/">
          <h3
            className={cn(
              "dark:text-primary font-medium text-black",
              !open ? "hidden" : "block",
            )}
          >
            Zynk
          </h3>
        </Link>
        <SidebarTrigger className="me-[1px] cursor-pointer" />
      </SidebarHeader>

      <SidebarContent>
        <NavMain />
        <NavProjects
          projects={chats.map((c: Chat) => ({
            id: c._id,
            name: c.title,
            url: `/chat/${c._id}`,
          }))}
        />
      </SidebarContent>

      <Separator />
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
