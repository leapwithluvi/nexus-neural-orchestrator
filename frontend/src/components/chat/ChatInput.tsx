"use client";

import { Send } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const ChatInput = ({ onSend }: { onSend: (message: string) => Promise<void> | void }) => {
  const [value, setValue] = useState("");
  const [height, setHeight] = useState(48);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const newHeight = Math.min(textareaRef.current.scrollHeight, 160);
      setHeight(newHeight);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [value]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && !isSubmitting) {
      setIsSubmitting(true);
      try {
        await onSend(value.trim());
        setValue("");
        setHeight(48);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative mx-auto max-w-3xl px-4 pb-4">
        <div
          className={cn(
            "flex items-end gap-2 rounded-2xl transition-all duration-200",
            "bg-muted/60 dark:bg-muted/40 border border-transparent",
            "shadow-sm hover:shadow-md",
            "focus-within:bg-background focus-within:border-border/60 focus-within:shadow-md"
          )}
        >
          <div className="flex-1 relative min-w-0">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={(e) => e.currentTarget.style.height = `${height}px`}
              placeholder="Message..."
              className={cn(
                "w-full bg-transparent border-none resize-none outline-none px-4 py-3",
                "text-base leading-relaxed placeholder:text-muted-foreground/50",
                "focus:ring-0 min-h-[48px] max-h-[160px]"
              )}
              style={{ height: `${height}px` }}
              rows={1}
              disabled={isSubmitting}
              aria-label="Chat input"
            />
          </div>

          <div className="flex items-center gap-1 pr-2 pb-2">
            <Button
              type="submit"
              disabled={!value.trim() || isSubmitting}
              className={cn(
                "h-10 w-10 rounded-xl bg-primary text-primary-foreground",
                "hover:bg-primary/90 active:scale-[0.98] transition-all",
                "disabled:opacity-40 disabled:cursor-not-allowed"
              )}
              aria-label="Send message"
            >
              <Send size={18} className="rotate-45" />
            </Button>
          </div>
        </div>

        <p className="mt-2 text-center text-xs text-muted-foreground/50 max-w-3xl mx-auto px-4">
          Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">Enter</kbd> to send, <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">Shift+Enter</kbd> for new line
        </p>
      </div>
    </form>
  );
};