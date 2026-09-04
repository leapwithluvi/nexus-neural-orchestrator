"use client";

import Link from "next/link";

import { pricingTiers } from "@/data/pricing";

const Pricing = () => {
    return (
        <section id="pricing" className="py-20 md:py-40 border-y border-border">
            <div className="mono-container">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-20 md:mb-32 gap-8">
                    <div>
                        <span className="label-mono mb-4 block">System Economics</span>
                        <h2 className="text-5xl md:text-7xl font-bold tracking-tighter leading-none mb-4 lowercase">
                            Operational Access.
                        </h2>
                    </div>
                    <div className="max-w-xs space-y-4">
                        <p className="text-sm text-muted-foreground font-medium uppercase tracking-[0.15em] leading-relaxed">
                            Currently in alpha stage. All tiers are subject to dynamic scaling and development status.
                        </p>
                        <div className="text-[10px] bg-foreground text-background inline-block px-2 py-0.5 font-bold tracking-widest uppercase">
                            Groq Integrated
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-[1px] bg-border border border-border">
                    {pricingTiers.map((tier) => (
                        <div key={tier.name} className="bg-background p-8 md:p-16 flex flex-col hover:bg-muted/50 transition-colors">
                            <div className="flex justify-between items-start mb-12">
                                <h3 className="text-xs uppercase font-black tracking-[0.3em]">{tier.name}</h3>
                                <span className="text-[10px] font-mono opacity-30">[{tier.disabled ? "LOCKED" : "REV.2026"}]</span>
                            </div>
                            
                            <div className="mb-16">
                                <div className="flex items-baseline gap-2">
                                    <span className={`text-6xl font-black italic ${tier.disabled ? "opacity-20" : ""}`}>{tier.pricing}</span>
                                </div>
                                <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mt-2 opacity-50">
                                    {tier.subtext}
                                </p>
                            </div>

                            <ul className="space-y-6 mb-16 flex-1">
                                {tier.metrics.map((metric) => (
                                    <li key={metric} className={`text-sm font-bold border-b border-border pb-4 flex justify-between uppercase italic ${tier.disabled ? "opacity-20" : "opacity-70"}`}>
                                        <span>{metric}</span>
                                        <span className="text-[10px] opacity-30">[{tier.disabled ? "PENDING" : "ACTIVE"}]</span>
                                    </li>
                                ))}
                            </ul>
                            
                            {tier.disabled ? (
                                <button disabled className="w-full h-16 border border-border bg-transparent text-muted-foreground font-black uppercase text-xs tracking-widest flex items-center justify-center cursor-not-allowed opacity-50">
                                    {tier.cta}
                                </button>
                            ) : (
                                <Link href={tier.href} className="w-full h-16 bg-foreground text-background font-black uppercase text-xs tracking-widest flex items-center justify-center hover:opacity-90 transition-opacity border border-foreground">
                                    {tier.cta}
                                </Link>
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-20 border-l-2 border-border pl-8">
                    <p className="text-xs text-muted-foreground uppercase tracking-widest leading-relaxed font-medium">
                        *Nexus AI is currently providing free, non-guaranteed access for public testing. 
                        System availability and model performance (Groq) are undergoing active calibration.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Pricing;
