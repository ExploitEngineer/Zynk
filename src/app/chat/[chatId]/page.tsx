import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import ChatClient from "./chat-client";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ chatId: string }>;
}) {
  const { chatId } = await params;
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* pass chatId down to client */}
        <ChatClient chatId={chatId} />
      </SidebarInset>
    </SidebarProvider>
  );
}
