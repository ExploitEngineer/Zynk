"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TokenUsageChart } from "./usage-chart";

type TokenUsageDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function TokenUsageDialog({
  open,
  onOpenChange: usageOpen,
}: TokenUsageDialogProps) {
  return (
    <Dialog open={open} onOpenChange={usageOpen}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Token Usage</DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <TokenUsageChart />
        </div>
      </DialogContent>
    </Dialog>
  );
}
