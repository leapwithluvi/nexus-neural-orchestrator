"use client";

import { technicalSpecs } from "@/data/features";

const Features = () => {
  return (
    <section id="features" className="py-20 md:py-40 bg-foreground text-background">
      <div className="mono-container">
        <div className="flex flex-col mb-20 md:mb-32 border-l border-background/20 pl-8">
            <span className="label-mono mb-4 text-background/50">Core Infrastructure • Integrating Groq</span>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter leading-none mb-4 lowercase">
                Technical Specifications.
            </h2>
            <p className="text-xl max-w-2xl text-background/70 font-medium">
                Our platform interfaces with the world&apos;s most advanced models to provide high-integrity intelligence.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {technicalSpecs.map((spec) => (
            <div key={spec.id} className="p-8 md:p-12 border border-background/10 hover:bg-background/5 transition-all group">
                <span className="text-xs font-bold font-mono opacity-30 mb-12 block group-hover:opacity-100 transition-opacity">[{spec.id}]</span>
                <h3 className="text-2xl font-bold mb-6 tracking-tight tracking-wide">{spec.title}</h3>
                <p className="text-sm leading-relaxed opacity-60 font-medium group-hover:opacity-100 transition-opacity">
                  {spec.description}
                </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
