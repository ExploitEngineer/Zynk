import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import AIChat from "@/components/ai-chat";

export default function Chat() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AIChat />
      </SidebarInset>
    </SidebarProvider>
  );
}
