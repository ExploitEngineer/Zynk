import {
  ChevronDown,
  Sparkles,
  Settings,
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

export function AIChatHeader() {
  return (
    <div className="flex items-center justify-between py-2 z-10 top-0 w-full h-[6%]">
      <DropdownMenu>
        <DropdownMenuTrigger className="ps-2">
          <div className="hover:bg-accent flex items-center gap-2 justify-between rounded-lg cursor-pointer transition-all duration-300 py-2 px-4">
            <h1 className="font-medium">Zynk AI</h1>
            <ChevronDown className="mt-1" size={15} />
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="rounded-lg"
          side={"bottom"}
          align="start"
          sideOffset={4}
        >
          <DropdownMenuGroup>
            <DropdownMenuItem className="cursor-pointer">
              <Sparkles />
              Upgrade to Pro
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuGroup>
            <DropdownMenuItem className="cursor-pointer">
              <Settings />
              Settings
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger className="pe-2">
          <div className="hover:bg-accent flex items-center gap-2 justify-between rounded-lg cursor-pointer transition-all duration-300 py-2 px-3">
            <Ellipsis size={19} />
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="rounded-lg"
          side={"bottom"}
          align="start"
          sideOffset={4}
        >
          <DropdownMenuGroup>
            <DropdownMenuItem className="cursor-pointer">
              <Sparkles />
              Upgrade to Pro
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer">
            <FilePen className="text-muted-foreground" />
            <span>Rename</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <Trash2 className="text-red-500" />
            <span className="text-red-500">Delete</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem className="cursor-pointer">
              <Settings />
              Settings
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuItem>
            <LogOut /> Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
