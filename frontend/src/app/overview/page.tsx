"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";
import Hero from "@/components/overview/Hero";
import Features from "@/components/overview/Features";
import HowItWorks from "@/components/overview/HowItWorks";
import Contact from "@/components/overview/Contact";
import Pricing from "@/components/overview/Pricing";
import { techStack } from "@/data/techstack";
import { socialLinks } from "@/data/contact";
import { systemMetadata, footerManifest } from "@/data/metadata";

export default function OverviewPage() {
  return (
    <div className="bg-background text-foreground selection:bg-foreground selection:text-background min-h-screen">
      <Navbar />
      <main>
        <Hero />
        
        {/* Tech Stack Marquee (High-Integrity Infrastructure) */}
        <section className="py-20 border-y border-border bg-muted/20 overflow-hidden relative">
            <div className="absolute left-0 top-0 bottom-0 w-40 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>
            
            <div className="flex animate-marquee whitespace-nowrap w-max">
                {[...techStack, ...techStack, ...techStack, ...techStack].map((tech, i) => (
                    <div key={i} className="flex items-center gap-6 mx-16 opacity-40 hover:opacity-100 transition-opacity cursor-default grayscale hover:grayscale-0 group shrink-0">
                        {tech.imageUrl ? (
                            <img 
                                src={tech.imageUrl} 
                                alt={tech.name}
                                className="h-6 w-6 object-contain rounded-full"
                            />
                        ) : tech.slug ? (
                            <img 
                                src={`https://cdn.simpleicons.org/${tech.slug}/${tech.color}`} 
                                alt={tech.name}
                                className="h-6 w-6 object-contain"
                            />
                        ) : null}
                        <span className="text-xl font-black uppercase tracking-tighter italic">{tech.name}</span>
                    </div>
                ))}
            </div>
        </section>

        <Features />
        <HowItWorks />
        <Pricing />
        <Contact />
      </main>
      
      <footer className="py-20 md:py-32 border-t border-border bg-background">
        <div className="mono-container space-y-20">
            {/* Top Section */}
            <div className="flex flex-col lg:flex-row justify-between items-start gap-16 md:gap-20">
                <div className="space-y-6 max-w-xl">
                    <div className="text-5xl md:text-7xl font-black tracking-tighter italic">{footerManifest.title}</div>
                    <p className="text-[10px] md:text-[11px] uppercase tracking-[0.3em] font-black text-muted-foreground leading-relaxed max-w-sm">
                        {footerManifest.tagline}
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-12 sm:gap-16 md:gap-32 w-full lg:w-auto">
                    <div className="space-y-6">
                        <div className="text-[9px] font-black uppercase tracking-[0.5em] text-muted-foreground border-b border-border pb-2">Modules</div>
                        <ul className="space-y-3 text-[10px] font-black uppercase tracking-widest">
                            <li><Link href="/" className="hover:underline">Execute_Chat</Link></li>
                            <li><Link href="/docs" className="hover:underline">Documentation</Link></li>
                            <li><Link href="https://github.com/leapwithluvi/nexus-neural-orchestrator" className="hover:underline">Source Code</Link></li>
                        </ul>
                    </div>
                    <div className="space-y-6">
                        <div className="text-[9px] font-black uppercase tracking-[0.5em] text-muted-foreground border-b border-border pb-2">Nodes</div>
                        <ul className="space-y-3 text-[10px] font-black uppercase tracking-widest">
                            {socialLinks.map((social) => (
                                <li key={social.name}>
                                    <a href={social.href} className="hover:underline" target="_blank" rel="noopener noreferrer">
                                        {social.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Section: Manifest */}
            <div className="pt-12 border-t border-border flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 md:gap-16 w-full md:w-auto">
                    {systemMetadata.map((meta) => (
                        <div key={meta.label} className="flex flex-col">
                            <span className="text-[8px] font-black text-muted-foreground uppercase opacity-50">{meta.label}</span>
                            <span className={`text-[10px] font-mono font-bold uppercase italic ${meta.color}`}>
                                {meta.value}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="text-left md:text-right w-full md:w-auto">
                    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground opacity-50">
                        {footerManifest.copyright}
                    </p>
                </div>
            </div>
        </div>
      </footer>
    </div>
  );
}
