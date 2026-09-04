"use client";

import { LoginForm } from "@/components/auth/LoginForm";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="bg-background min-h-screen selection:bg-foreground selection:text-background font-sans relative">
      <main className="flex flex-col items-center justify-center min-h-screen py-20 px-4">
        
        <div className="w-full max-w-md mb-6 flex justify-start">
          <Link 
            href="/overview" 
            className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={16} /> Returns
          </Link>
        </div>

        <div className="w-full max-w-md p-10 border-2 border-border bg-background shadow-[30px_30px_0px_0px_rgba(0,0,0,0.05)] relative overflow-hidden group">
          {/* Subtle Grid Pattern Overlay */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:20px_20px]"></div>
          
          <LoginForm onSwitch={() => router.push("/register")} />
          
          <div className="mt-8 pt-8 border-t border-border flex justify-between items-center opacity-30">
              <span className="text-[8px] font-black tracking-widest uppercase">NXS SECURE AUTH</span>
              <span className="text-[8px] font-mono">v4.0.1</span>
          </div>
        </div>
      </main>
    </div>
  );
}
