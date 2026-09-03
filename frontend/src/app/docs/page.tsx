"use client";

import Navbar from "@/components/Navbar";
import { Hammer, Pickaxe, Settings2, Construction } from "lucide-react";
import Link from "next/link";

const DocsPage = () => {
  return (
    <div className="bg-background min-h-screen text-foreground selection:bg-foreground selection:text-background flex flex-col font-sans">
      <Navbar />
      
      <main className="flex-1 flex flex-col items-center justify-center mono-container pt-32 pb-40 text-center px-4 relative">
        {/* Subtle background decoration */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none overflow-hidden">
            <h1 className="text-[200px] font-black uppercase italic whitespace-nowrap">WORK IN PROGRESS</h1>
        </div>

        <div className="relative z-10 space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="inline-flex items-center justify-center p-6 bg-muted/50 rounded-full border border-border shadow-sm mb-4">
                <Construction size={48} className="opacity-80" strokeWidth={1.5} />
            </div>

            <div className="space-y-6 max-w-2xl mx-auto">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500 border border-emerald-500/30 px-3 py-1 rounded-full bg-emerald-500/10">Status: In Development</span>
                <h1 className="text-5xl md:text-6xl font-black tracking-tighter uppercase italic">
                    Under Construction
                </h1>
                <p className="text-lg text-muted-foreground font-medium leading-relaxed">
                    The documentation core is currently being structurally engineered to reflect our latest technical updates. Full architecture manifests will be available soon.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mt-12 text-left">
                {[
                    { icon: Settings2, title: "Engine Tuning", desc: "Calibrating the core inference engine documentation." },
                    { icon: Pickaxe, title: "Data Excavation", desc: "Structuring system telemetry logs into readable formats." },
                    { icon: Hammer, title: "Structural Build", desc: "Forging the frontend integration guidelines." }
                ].map((item, i) => (
                    <div key={i} className="p-6 border border-border bg-muted/20 hover:bg-muted/40 transition-colors space-y-4">
                        <item.icon size={20} className="text-foreground/60" />
                        <h3 className="text-xs font-black uppercase tracking-widest">{item.title}</h3>
                        <p className="text-[10px] text-muted-foreground uppercase leading-relaxed font-bold tracking-widest opacity-70">
                            {item.desc}
                        </p>
                    </div>
                ))}
            </div>

            <div className="pt-16">
                <Link 
                    href="/"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-foreground text-background text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] active:translate-y-[2px] active:shadow-none"
                >
                    Return to Mission Control
                </Link>
            </div>
        </div>
      </main>

      <footer className="py-12 border-t border-border bg-background relative z-10">
        <div className="mono-container flex flex-col items-center gap-4">
             <span className="text-2xl font-black tracking-tighter italic opacity-20 uppercase">Nexus_Sys</span>
             <p className="text-[9px] font-black uppercase tracking-[0.5em] opacity-30 italic text-center">
                System architecture in active development.
             </p>
        </div>
      </footer>
    </div>
  );
};

export default DocsPage;
