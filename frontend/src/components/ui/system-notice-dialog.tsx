"use client";

import { AlertCircle, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface SystemNoticeDialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  statusLabel?: string;
  message?: string;
  footnote?: string;
  confirmLabel?: string;
  children?: React.ReactNode;
}

export function SystemNoticeDialog({
  open,
  onClose,
  title,
  subtitle,
  statusLabel,
  message,
  footnote,
  confirmLabel,
  children,
}: SystemNoticeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-none border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-black uppercase tracking-widest text-destructive">
            <AlertCircle size={18} />
            {title}
          </DialogTitle>
          <DialogDescription className="text-[10px] font-bold uppercase tracking-wider opacity-70">
            {subtitle}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {children ? (
            // Custom body: render any JSX passed as children
            <div>{children}</div>
          ) : (
            // Default body: database initialization notice
            <div className="flex flex-col gap-3 font-mono text-[11px] text-muted-foreground bg-muted/30 p-4 border border-border/50">
              <span className="flex items-center gap-2">
                <Database size={14} className="opacity-50" />
                <span>{statusLabel}</span>
              </span>
              <p className="leading-relaxed border-t border-border/50 pt-3">
                {message}
              </p>
              {footnote && (
                <p className="opacity-60 text-[10px] mt-1">{footnote}</p>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            onClick={onClose}
            className="rounded-none font-black uppercase tracking-widest text-[10px]"
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
