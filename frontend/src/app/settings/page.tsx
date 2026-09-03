"use client";

import { Hammer, Pickaxe, Settings2, Construction } from "lucide-react";
import Link from "next/link";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

const SettingsPage = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex-1 flex flex-col h-screen min-w-0 bg-background">
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="h-4 w-px bg-border" />
          <h1 className="text-sm font-semibold tracking-tight">System Settings</h1>
        </header>
        
        <main className="flex-1 flex flex-col items-center justify-center p-4 relative overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none">
              <h1 className="text-[200px] font-black uppercase italic whitespace-nowrap">WORK IN PROGRESS</h1>
          </div>

          <div className="relative z-10 space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 text-center max-w-4xl mx-auto w-full">
              <div className="inline-flex items-center justify-center p-6 bg-muted/50 rounded-full border border-border shadow-sm mb-4">
                  <Construction size={48} className="opacity-80" strokeWidth={1.5} />
              </div>

              <div className="space-y-6 max-w-2xl mx-auto align-center">
                  <span className="inline-block text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500 border border-emerald-500/30 px-4 py-1.5 rounded-full bg-emerald-500/10">Status: In Development</span>
                  <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic">
                      Under Construction
                  </h1>
                  <p className="text-lg text-muted-foreground font-medium leading-relaxed">
                      The core settings module is undergoing structural upgrades. Advanced parameter controls and customization manifests will be available soon.
                  </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-3xl mx-auto mt-16 mt-12">
                  {[
                      { icon: Settings2, title: "Parameter Control", desc: "Fine-tune inference temperatures and token caps." },
                      { icon: Pickaxe, title: "Profile Sculpting", desc: "Manage your authentication identities and data." },
                      { icon: Hammer, title: "Theme Constructor", desc: "Build exact aesthetic preferences and styles." }
                  ].map((item, i) => (
                      <div key={i} className="p-6 border border-border bg-muted/20 hover:bg-muted/40 transition-colors space-y-4 rounded-xl">
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
                      className="inline-flex items-center justify-center px-8 py-4 bg-foreground text-background text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] active:translate-y-[2px] active:shadow-none rounded-md"
                  >
                      Return to Mission Control
                  </Link>
              </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default SettingsPage;
