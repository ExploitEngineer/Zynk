"use client";

import * as React from "react";
import { Search, Home, MessageSquarePlus } from "lucide-react";
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

const data = {
  navMain: [
    {
      title: "New chat",
      url: "#",
      icon: MessageSquarePlus,
    },
    {
      title: "Search chats",
      url: "#",
      icon: Search,
    },
    {
      title: "Library",
      url: "#",
      icon: Home,
      isActive: true,
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
    },
    {
      name: "Sales & Marketing",
      url: "#",
    },
    {
      name: "Travel",
      url: "#",
    },
  ],
  user: {
    name: "shadcn",
    plan: "Free" as UserPlan,
    avatar: "/avatars/shadcn.jpg",
    email: "abdulrafayofficial.work@gmail.com",
  },
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { open } = useSidebar();
  return (
    <Sidebar className="font-code" collapsible="icon" {...props}>
      <SidebarHeader className="flex px-3 justify-between flex-row items-center">
        <h3
          className={cn(
            "dark:text-primary text-black font-medium",
            !open ? "hidden" : "block",
          )}
        >
          Zynk
        </h3>
        <SidebarTrigger className="cursor-pointer" />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <Separator />
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
