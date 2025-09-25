"use client";

import {
  ChevronDown,
  Sparkles,
  Ellipsis,
  LogOut,
  Trash2,
  FilePen,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { useChatStore } from "@/store/chat-store";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { logout } from "@/lib/auth-client";
import Link from "next/link";

export default function AIChatHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    chats,
    deletingChatId,
    setDeletingChatId,
    setRenamingChatId,
    deleteChat,
    isDeletingChat,
  } = useChatStore();

  const currentChat = pathname.split("/").pop();

  const handleDelete = () => {
    if (!currentChat) {
      toast.error("No chat selected to delete");
      return;
    }

    setDeletingChatId(currentChat);
  };

  const deletingChat = chats.find((c) => c.id === deletingChatId);

  const handleDeleteChat = async () => {
    if (!deletingChatId) return;
    await deleteChat(deletingChatId);
    setDeletingChatId(null);
    router.push("/chat");
  };

  const handleLogout = async () => {
    const res = await logout();
    if (res.status === "success") {
      router.push("/");
    }
  };

  return (
    <div className="top-0 z-10 flex h-[6%] w-full items-center justify-between py-2">
      {/* Main dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger className="ps-2">
          <div className="hover:bg-accent flex cursor-pointer items-center justify-between gap-2 rounded-lg px-4 py-2 transition-all duration-300">
            <h1 className="font-medium">Zynk AI</h1>
            <ChevronDown className="mt-1" size={15} />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="rounded-lg"
          side="bottom"
          align="start"
          sideOffset={4}
        >
          <DropdownMenuGroup>
            <Link href="/#pricing">
              <DropdownMenuItem className="cursor-pointer">
                <Sparkles /> Upgrade Plan
              </DropdownMenuItem>
            </Link>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Actions menu */}
      <DropdownMenu>
        <DropdownMenuTrigger className="pe-2">
          <div className="hover:bg-accent flex cursor-pointer items-center justify-between gap-2 rounded-lg px-3 py-2 transition-all duration-300">
            <Ellipsis size={19} />
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="rounded-lg"
          side="bottom"
          align="start"
          sideOffset={4}
        >
          <DropdownMenuGroup>
            <Link href="/#pricing">
              <DropdownMenuItem className="cursor-pointer">
                <Sparkles /> Upgrade Plan
              </DropdownMenuItem>
            </Link>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              if (!currentChat) {
                toast.error("not chat selected to perform rename");
                return;
              }
              setRenamingChatId(currentChat);
            }}
            className="cursor-pointer"
          >
            <FilePen /> Rename
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDelete} className="cursor-pointer">
            <Trash2 color="red" /> <span className="text-red-500">Delete</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
            <LogOut /> Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Dialog */}
      <Dialog
        open={!!deletingChatId}
        onOpenChange={() => setDeletingChatId(null)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Chat</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this chat?{" "}
              <span className="font-semibold text-white">
                {deletingChat?.title ?? "Unknown Chat"}
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="button"
                className="cursor-pointer bg-red-600 text-white transition-all duration-300 hover:bg-red-800"
                disabled={isDeletingChat}
                onClick={handleDeleteChat}
              >
                {isDeletingChat ? (
                  <div className="flex items-center gap-2">
                    <span>Deleting</span>
                    <Loader2 className="animate-spin" />
                  </div>
                ) : (
                  "Delete"
                )}
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
