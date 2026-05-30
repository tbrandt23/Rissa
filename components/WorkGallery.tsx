"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Capability } from "@/content/capabilities";

const AUTO_ADVANCE_MS = 7000;

export default function WorkGallery({ items }: { items: Capability[] }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const go = (i: number) => {
    const n = items.length;
    setCurrent(((i % n) + n) % n);
  };
  const next = () => go(current + 1);
  const prev = () => go(current - 1);

  useEffect(() => {
    if (paused) return;
    intervalRef.current = window.setInterval(() => {
      setCurrent((c) => (c + 1) % items.length);
    }, AUTO_ADVANCE_MS);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [paused, items.length]);

  const interact = (fn: () => void) => () => {
    setPaused(true);
    fn();
  };

  const cap = items[current];

  return (
    <div
      className="relative w-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* counter row */}
      <div className="mb-3 flex items-baseline justify-between gap-4 text-[10px] uppercase tracking-[0.3em] text-muted">
        <span>
          {String(current + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
        </span>
        <span className="hidden md:inline text-foreground/70">{cap.title}</span>
      </div>

      {/* image stage — single card, full bleed, with overlays */}
      <div className="relative overflow-hidden border border-border-soft">
        <div className="aspect-[16/10] md:aspect-[16/9] w-full relative">
          {items.map((c, i) => (
            <Image
              key={c.number}
              src={c.image}
              alt={c.title}
              fill
              unoptimized
              priority={i === 0}
              sizes="(min-width: 1024px) 80vw, 100vw"
              className={`object-cover transition-opacity duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                i === current
                  ? "opacity-100 ken-burns z-[1]"
                  : "opacity-0 z-0"
              }`}
            />
          ))}

          {/* legibility gradient at the bottom */}
          <div
            aria-hidden
            className="absolute inset-0 z-[2] pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, rgba(10,10,10,0) 35%, rgba(10,10,10,0.05) 60%, rgba(10,10,10,0.85) 100%)",
            }}
          />

          {/* giant section number */}
          <div
            key={`num-${current}`}
            className="absolute top-5 right-6 md:top-7 md:right-8 z-[3] font-display font-extralight text-[64px] md:text-[96px] leading-none text-foreground/30 select-none rise-now"
          >
            {cap.number}
          </div>

          {/* title + description overlay */}
          <div className="absolute bottom-5 left-6 md:bottom-8 md:left-10 z-[3] max-w-[88%] md:max-w-[60%]">
            <div
              key={`cap-${current}`}
              className="text-[10px] uppercase tracking-[0.3em] text-muted mb-2 rise-now"
              style={{ animationDelay: "60ms" }}
            >
              Section {cap.number}
            </div>
            <h3
              key={`title-${current}`}
              className="font-display font-extralight text-[28px] md:text-[44px] tracking-[-0.02em] leading-[1] text-foreground mb-3 rise-now"
              style={{ animationDelay: "160ms" }}
            >
              {cap.title}
            </h3>
            <p
              key={`desc-${current}`}
              className="font-sans font-light text-[13px] md:text-[15px] leading-[1.55] text-foreground-cool max-w-md rise-now"
              style={{ animationDelay: "260ms" }}
            >
              {cap.description}
            </p>
          </div>

          {/* arrows over the image */}
          <button
            type="button"
            onClick={interact(prev)}
            aria-label="Previous"
            className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 z-[4] h-11 w-11 md:h-12 md:w-12 inline-flex items-center justify-center bg-background/60 backdrop-blur-md border border-border text-foreground transition-all duration-300 hover:bg-background/80 hover:border-foreground"
          >
            <span aria-hidden className="text-[18px] md:text-[20px] leading-none">←</span>
          </button>
          <button
            type="button"
            onClick={interact(next)}
            aria-label="Next"
            className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 z-[4] h-11 w-11 md:h-12 md:w-12 inline-flex items-center justify-center bg-background/60 backdrop-blur-md border border-border text-foreground transition-all duration-300 hover:bg-background/80 hover:border-foreground"
          >
            <span aria-hidden className="text-[18px] md:text-[20px] leading-none">→</span>
          </button>
        </div>
      </div>

      {/* thumbnail strip — clear visual proof there are more slides */}
      <div className="mt-4 md:mt-5 flex items-center gap-2 md:gap-3 overflow-x-auto">
        {items.map((it, i) => (
          <button
            key={it.number}
            type="button"
            onClick={interact(() => go(i))}
            aria-label={`Go to ${it.title}`}
            className={`relative shrink-0 w-16 h-12 md:w-20 md:h-14 overflow-hidden border transition-all duration-300 ${
              i === current
                ? "border-foreground opacity-100"
                : "border-border opacity-50 hover:opacity-90"
            }`}
          >
            <Image src={it.image} alt={it.title} fill unoptimized className="object-cover" sizes="80px" />
          </button>
        ))}
      </div>
    </div>
  );
}
