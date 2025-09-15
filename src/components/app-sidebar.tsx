"use client";

import * as React from "react";
import { useSidebar } from "@/components/ui/sidebar";
import { NavMain } from "@/components/nav-main";
import { NavChats } from "@/components/nav-chats";
import { NavUser } from "@/components/nav-user";
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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { open } = useSidebar();

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
        <NavChats />
      </SidebarContent>

      <Separator />
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
