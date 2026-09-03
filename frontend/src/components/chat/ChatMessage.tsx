"use client";

import { Copy, Check, Zap, Activity } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  isStreaming?: boolean;
  telemetry?: any;
}

export const ChatMessage = ({ role, content, timestamp, isStreaming, telemetry }: ChatMessageProps) => {
  const isAssistant = role === "assistant";
  const [copied, setCopied] = useState(false);
  const [telemetryHovered, setTelemetryHovered] = useState(false);
  const [popupPos, setPopupPos] = useState({ top: 0, left: 0 });
  const [visible, setVisible] = useState(false);
  const telemetryRef = useRef<HTMLDivElement>(null);

  // Fade in once on mount — not on every streaming token update
  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(t);
  }, []);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Calculate fixed popup position to escape overflow:hidden scroll container
  useEffect(() => {
    if (telemetryHovered && telemetryRef.current) {
      const rect = telemetryRef.current.getBoundingClientRect();
      setPopupPos({ top: rect.bottom + 8, left: rect.left });
    }
  }, [telemetryHovered]);

  // ─── User message ─────────────────────────────────────────────────
  if (!isAssistant) {
    return (
      <div
        className={cn(
          "flex justify-end px-4 py-1.5 max-w-3xl mx-auto w-full group/message transition-opacity duration-300",
          visible ? "opacity-100" : "opacity-0"
        )}
      >
        <div className="flex flex-col items-end gap-1 max-w-[75%]">
          <div className="px-4 py-2.5 rounded-2xl rounded-br-sm bg-primary text-primary-foreground text-[15px] leading-relaxed break-words">
            {content}
          </div>
          <time className="text-xs text-muted-foreground/50 px-1">
            {new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </time>
        </div>
      </div>
    );
  }

  // ─── Assistant message — no bubble, like ChatGPT/Gemini ───────────
  return (
    <div
      className={cn(
        "flex flex-col px-4 py-1.5 max-w-3xl mx-auto w-full group/message transition-opacity duration-300",
        visible ? "opacity-100" : "opacity-0"
      )}
    >
      {/* Content — plain, no box */}
      <div className="relative">
        <div
          className={cn(
            "prose prose-sm dark:prose-invert max-w-none",
            // Force all text to use the theme foreground color (never grey in light mode)
            "[&_p]:text-foreground [&_li]:text-foreground [&_h1]:text-foreground [&_h2]:text-foreground",
            "[&_h3]:text-foreground [&_h4]:text-foreground [&_strong]:text-foreground [&_em]:text-foreground",
            "[&_blockquote]:text-foreground/80 [&_td]:text-foreground [&_th]:text-foreground",
            "[&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
            "prose-p:my-1 prose-pre:my-2",
            "prose-ul:my-1 prose-ol:my-1 prose-li:my-0",
            "prose-headings:mt-3 prose-headings:mb-1",
            "prose-code:before:content-none prose-code:after:content-none",
            "prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-foreground"
          )}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content}
          </ReactMarkdown>
        </div>

        {/* Typing indicator while AI is thinking and content is empty */}
        {isStreaming && !content && (
          <div className="flex gap-1 items-center h-5 mt-1">
            <div className="w-1.5 h-1.5 rounded-full bg-foreground/40 animate-bounce [animation-delay:-0.3s]" />
            <div className="w-1.5 h-1.5 rounded-full bg-foreground/40 animate-bounce [animation-delay:-0.15s]" />
            <div className="w-1.5 h-1.5 rounded-full bg-foreground/40 animate-bounce" />
          </div>
        )}

        {/* Copy button — appears on hover */}
        <div className="opacity-0 group-hover/message:opacity-100 transition-opacity mt-2 flex items-center gap-1">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
            aria-label="Copy message"
          >
            {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
            <span>{copied ? "Copied!" : "Copy"}</span>
          </button>
        </div>
      </div>

      {/* Timestamp + telemetry row */}
      <div className="flex items-center gap-3 mt-0.5">
        <time className="text-xs text-muted-foreground/50">
          {new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </time>

        {/* ─── Speed Insights ─── */}
        {telemetry && (
          <div
            ref={telemetryRef}
            className="relative"
            onMouseEnter={() => setTelemetryHovered(true)}
            onMouseLeave={() => setTelemetryHovered(false)}
          >
            {/* Compact row */}
            <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground/50 hover:text-foreground transition-colors cursor-help select-none">
              <span className="flex items-center gap-1">
                <Zap size={10} className="text-yellow-500/70" />
                Latency: {((telemetry.totalTime || 0) * 1000).toLocaleString("en-US", { maximumFractionDigits: 0 })} ms
              </span>
              <span className="text-muted-foreground/30">|</span>
              <span className="flex items-center gap-1">
                <Activity size={10} className="text-primary/70" />
                Tokens/s: {(telemetry.speed || 0).toLocaleString("en-US")}
              </span>
            </div>

            {/* Fixed-position popup */}
            {telemetryHovered && (
              <div
                className="fixed w-80 p-5 rounded-2xl bg-card border border-border/50 text-card-foreground shadow-2xl z-[9999]"
                style={{ top: popupPos.top, left: popupPos.left }}
                onMouseEnter={() => setTelemetryHovered(true)}
                onMouseLeave={() => setTelemetryHovered(false)}
              >
                <h4 className="font-semibold text-sm mb-4 tracking-tight">Speed Insights</h4>

                <div className="grid grid-cols-4 gap-y-3 gap-x-2 text-right text-xs mb-5">
                  <div className="text-left font-medium text-muted-foreground border-b border-border/50 pb-2">Metric</div>
                  <div className="font-medium text-muted-foreground border-b border-border/50 pb-2">Input</div>
                  <div className="font-medium text-muted-foreground border-b border-border/50 pb-2">Output</div>
                  <div className="font-medium text-muted-foreground border-b border-border/50 pb-2">Total</div>

                  <div className="text-left font-medium text-muted-foreground">Tokens</div>
                  <div className="tabular-nums font-mono">{(telemetry.promptTokens || 0).toLocaleString("en-US")}</div>
                  <div className="tabular-nums font-mono">{(telemetry.completionTokens || 0).toLocaleString("en-US")}</div>
                  <div className="tabular-nums font-mono">{(telemetry.totalTokens || 0).toLocaleString("en-US")}</div>

                  <div className="text-left font-medium text-muted-foreground leading-tight">
                    Inference <span className="text-[9px] block text-muted-foreground/60">seconds</span>
                  </div>
                  <div className="tabular-nums font-mono">{(telemetry.promptTime || 0).toFixed(2)}</div>
                  <div className="tabular-nums font-mono">{(telemetry.completionTime || 0).toFixed(2)}</div>
                  <div className="tabular-nums font-mono">{(telemetry.totalTime || 0).toFixed(2)}</div>

                  <div className="text-left font-medium text-muted-foreground">Tok/s</div>
                  <div className="tabular-nums font-mono">{Math.round((telemetry.promptTokens || 0) / (telemetry.promptTime || 1)).toLocaleString("en-US")}</div>
                  <div className="tabular-nums font-mono">{Math.round((telemetry.completionTokens || 0) / (telemetry.completionTime || 1)).toLocaleString("en-US")}</div>
                  <div className="tabular-nums font-mono">-</div>
                </div>

                <div className="pt-3 border-t border-border/50 text-xs text-muted-foreground flex flex-col gap-1.5 font-mono">
                  <div className="flex justify-between">
                    <span>Round trip:</span>
                    <span className="text-foreground">{(telemetry.totalTime || 0).toFixed(2)} s</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Model:</span>
                    <span className="text-foreground">{telemetry.model || "Groq Core"}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};