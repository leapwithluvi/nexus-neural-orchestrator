"use client";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { LoginForm } from "./LoginForm";
import { cn } from "@/lib/utils";

export function AuthDialog({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className={cn(
        "max-w-md p-0 rounded-none border-2 border-border bg-background shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
        "data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95",
        "duration-150 ease-out fill-mode-forward"
      )}>
        <DialogTitle className="sr-only">Authentication</DialogTitle>
        <DialogDescription className="sr-only">
          Nexus System Access Protocol
        </DialogDescription>
        
        <div className="p-8 relative">
            {/* Success Decoration */}
            <div className="absolute top-0 left-0 w-1 h-full bg-foreground opacity-10"></div>
            
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150 fill-mode-both">
              <LoginForm />
            </div>

            {/* Decorative Matrix Code bits */}
            <div className="absolute top-4 right-4 flex flex-col gap-1 pointer-events-none opacity-10 font-mono text-[6px]">
                <span>AUTH_INIT_SUCC</span>
                <span>SEC_LAYER_04</span>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
