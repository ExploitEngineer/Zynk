import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useChatStore } from "@/store/chat-store";

export function FeedbackDialog({
  open,
  onOpenChange,
  messageId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  messageId: string;
}) {
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setCurrentMessageId } = useChatStore();

  const maxChars = 500;

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      await setCurrentMessageId(messageId, "feedback", feedback.trim());
      onOpenChange(false);
      setFeedback("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= maxChars) {
      setFeedback(e.target.value);
    }
  };

  const remainingChars = maxChars - feedback.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full !max-w-lg">
        <DialogHeader className="mb-4 space-y-2">
          <DialogTitle className="text-lg font-semibold">
            Provide Feedback
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Help us improve by sharing what went wrong with this AI response.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          <Textarea
            placeholder="Please describe what was wrong with this response..."
            value={feedback}
            onChange={handleChange}
            className="min-h-[120px] w-full max-w-full min-w-0 resize-y overflow-x-hidden overflow-y-auto break-words break-all whitespace-pre-wrap"
          />
          <div className="text-muted-foreground flex justify-between text-xs">
            <span>{remainingChars} characters remaining</span>
            {feedback.length >= maxChars && (
              <span className="text-red-500">Limit reached</span>
            )}
          </div>
        </div>

        <DialogFooter className="mt-4 flex-shrink-0">
          <Button
            variant="ghost"
            className="cursor-pointer"
            disabled={isLoading}
            onClick={() => {
              setFeedback("");
              onOpenChange(false);
            }}
          >
            Cancel
          </Button>
          <Button
            className="cursor-pointer"
            disabled={feedback.trim().length === 0 || isLoading}
            onClick={handleSubmit}
          >
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
