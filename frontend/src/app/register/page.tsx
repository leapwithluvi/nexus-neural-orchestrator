"use client";

import { RegisterForm } from "@/components/auth/RegisterForm";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();

  return (
    <div className="bg-background min-h-screen selection:bg-foreground selection:text-background font-sans relative">
      <Link 
        href="/" 
        className="absolute top-8 left-8 p-2 text-muted-foreground hover:text-foreground transition-colors z-10"
      >
        <ArrowLeft size={24} />
      </Link>
      <main className="flex items-center justify-center min-h-screen py-20 px-4">
        <div className="w-full max-w-md p-10 border-2 border-border bg-background shadow-[30px_30px_0px_0px_rgba(0,0,0,0.05)] relative overflow-hidden group">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:20px_20px]"></div>
          
          <RegisterForm onSwitch={() => router.push("/login")} />
          
          <div className="mt-8 pt-8 border-t border-border flex justify-between items-center opacity-30">
              <span className="text-[8px] font-black tracking-widest uppercase">NXS NODE DEPLOY</span>
              <span className="text-[8px] font-mono">v4.0.1</span>
          </div>
        </div>
      </main>
    </div>
  );
}
