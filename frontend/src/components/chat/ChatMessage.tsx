"use client";

import { Copy, Check, Bot, User } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  isStreaming?: boolean;
}

export const ChatMessage = ({ role, content, timestamp, isStreaming }: ChatMessageProps) => {
  const isAssistant = role === "assistant";
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatContent = (text: string) => {
    return text
      .replace(/`([^`]+)`/g, '<code class="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\*([^*]+)\*/g, "<em>$1</em>")
      .replace(/```([\s\S]*?)```/g, '<pre class="bg-muted/50 p-4 rounded-lg overflow-x-auto"><code class="font-mono text-sm">$1</code></pre>')
      .replace(/\n/g, "<br />");
  };

  return (
    <div
      className={cn(
        "flex gap-3 px-4 py-3 max-w-3xl mx-auto w-full animate-fade-in",
        isAssistant ? "justify-start" : "justify-end"
      )}
    >
      <div
        className={cn(
          "flex flex-col items-center shrink-0",
          isAssistant ? "order-first" : "order-last"
        )}
      >
        <div
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
            isAssistant
              ? "bg-primary/10 text-primary"
              : "bg-muted text-muted-foreground"
          )}
          aria-hidden="true"
        >
          {isAssistant ? <Bot size={16} /> : <User size={16} />}
        </div>
      </div>

      <div
        className={cn(
          "flex flex-col gap-1 max-w-[calc(100%-3rem)]",
          isAssistant ? "items-start" : "items-end"
        )}
      >
        <div
          className={cn(
            "relative px-4 py-2.5 rounded-2xl text-base leading-relaxed whitespace-pre-wrap break-words",
            isAssistant
              ? "bg-muted/50 rounded-bl-md text-foreground"
              : "bg-primary text-primary-foreground rounded-br-md"
          )}
        >
          <div
            className="prose prose-sm max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: formatContent(content) }}
          />

          <div
            className="absolute -bottom-6 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
          >
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg bg-background/80 backdrop-blur hover:bg-background text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Copy message"
            >
              {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
            </button>
          </div>
        </div>

        <time
          className="text-xs text-muted-foreground/60 px-1"
          dateTime={timestamp}
        >
          {new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </time>
      </div>
    </div>
  );
};