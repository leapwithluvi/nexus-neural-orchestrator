"use client";

import { techStack } from "@/data/techstack";
import { useAppContext } from "@/context/AppContext";
import Link from "next/link";

const Hero = () => {
  const { user } = useAppContext();
  return (
    <section className="relative min-h-[50vh] flex flex-col justify-center pt-24 md:pt-32 pb-20 overflow-hidden">
      <div className="mono-container">
        <div className="flex flex-col mb-24">
            <span className="label-mono mb-8 block animate-fadeIn">Portfolio Project</span>
            <h1 className="text-huge animate-slideUp leading-[0.9]">
                ADVANCED <br />
                COGNITION.
            </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 border-t border-border pt-12 items-start">
            <div className="lg:col-span-4 space-y-4">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground border-b border-border pb-1 inline-block">
                    MissionManifest
                </span>
                <p className="text-lg leading-[1.4] font-medium text-foreground italic">
                    Our platform provides high-integrity artificial intelligence for critical operations. 
                    Built on secure architecture and validated models.
                </p>
                <Link href="/" className="inline-block text-xs uppercase tracking-[0.2em] font-bold border-b-2 border-foreground pb-1 hover:opacity-70 transition-all cursor-pointer mt-4">
                    {user ? "Open Terminal" : "Start For Free"}
                </Link>
            </div>
        </div>

        {/* Massive Background element (Subtle) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 opacity-[0.02] pointer-events-none select-none">
            <div className="text-[40vw] font-black leading-none">NX</div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
