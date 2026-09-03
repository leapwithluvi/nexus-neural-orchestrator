"use client";

import { useState } from "react";
import { Mail, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiUrl } from "@/lib/api";
import Link from "next/link";

export function LoginForm({ onSwitch }: { onSwitch?: () => void }) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  const handleOAuthClick = (provider: "google" | "github") => {
    setLoading(true);
    window.location.href = apiUrl(`/api/v1/auth/${provider}`);
  };

  return (
    <>
      <div className="space-y-8 py-4">
        <div className="space-y-2 text-center">
          <h2 className="text-3xl font-black tracking-tighter uppercase italic">Secure_Login</h2>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
            Initialize Authentication Protocol
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center justify-between">
              <span>System Ident Email</span>
              <span className="text-[8px] opacity-50 bg-destructive/10 text-destructive px-1.5 py-0.5 rounded">Admin Only</span>
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                type="email" 
                placeholder="USER@NEXUS.SYSTEM" 
                className="pl-10 h-10 border-border bg-muted/20 rounded-none focus-visible:ring-foreground font-medium text-xs placeholder:opacity-30"
                required 
              />
            </div>
          </div>

          <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Security_Key</Label>
                  <Link href="#" className="text-[9px] font-black uppercase tracking-widest hover:underline opacity-50">Lost_Key?</Link>
              </div>
              <Input 
                  type="password" 
                  placeholder="********" 
                  className="h-10 border-border bg-muted/20 rounded-none focus-visible:ring-foreground font-mono text-xs"
                  required 
              />
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full h-12 bg-foreground text-background font-black uppercase tracking-[0.2em] rounded-none hover:opacity-90 transition-all group"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>Execute Admin Auth <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" /></>
            )}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border"></span></div>
          <div className="relative flex justify-center text-[9px] uppercase font-black tracking-[0.4em] bg-background px-4 text-muted-foreground">
            Public OAuth Nodes
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button 
            type="button"
            disabled={loading}
            onClick={() => handleOAuthClick("github")}
            variant="outline" 
            className="h-10 rounded-none border-border font-black text-[10px] uppercase tracking-widest hover:bg-muted group"
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <svg className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>}
            GitHub
          </Button>
          <Button 
            type="button"
            disabled={loading}
            onClick={() => handleOAuthClick("google")}
            variant="outline" 
            className="h-10 rounded-none border-border font-black text-[10px] uppercase tracking-widest hover:bg-muted group"
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <svg className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>}
            Google
          </Button>
        </div>

        {/* Public Registration is handled via OAuth only - Email signups are admin-restricted */}
      </div>
    </>
  );
}
