"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { Capability } from "@/content/capabilities";

const AUTO_ADVANCE_MS = 6500;

// Full-bleed editorial carousel modelled on mohamedshehata.net's "experiments"
// section: one project fills the stage, dark-graded imagery, a small section
// label top-left, a mono counter top-right, the title block clip-revealing from
// the bottom edge, hairline meta chips, and a segmented progress bar that fills
// across the auto-advance interval. Reworked into Riss's warm/extralight palette
// (no chromatic CTA — the off-white carries it).
export default function WorkGallery({
  items,
  label = "Selected Work",
}: {
  items: Capability[];
  label?: string;
}) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const n = items.length;
  const go = (i: number) => setCurrent(((i % n) + n) % n);
  const next = () => go(current + 1);
  const prev = () => go(current - 1);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      setCurrent((c) => (c + 1) % n);
    }, AUTO_ADVANCE_MS);
    return () => window.clearInterval(id);
  }, [paused, n]);

  const interact = (fn: () => void) => () => {
    setPaused(true);
    fn();
  };

  const cap = items[current];
  const two = String(n).padStart(2, "0");

  return (
    <div
      className="group/gal relative w-full select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative w-full overflow-hidden border border-border-soft bg-background h-[58vh] min-h-[440px] md:h-[70vh]">
        {/* image layers — crossfade + Ken Burns on the active slide */}
        {items.map((c, i) => (
          <Image
            key={c.number}
            src={c.image}
            alt={c.title}
            fill
            unoptimized
            priority={i === 0}
            sizes="(min-width: 1024px) 90vw, 100vw"
            className={`object-cover transition-opacity duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
              i === current ? "opacity-100 ken-burns z-[1]" : "opacity-0 z-0"
            }`}
            style={{ filter: "brightness(0.58) contrast(1.08)" }}
          />
        ))}

        {/* legibility grade — darker top + bottom, image breathes in the middle */}
        <div
          aria-hidden
          className="absolute inset-0 z-[2] pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(10,10,10,0.45) 0%, rgba(10,10,10,0) 28%, rgba(10,10,10,0.12) 52%, rgba(10,10,10,0.92) 100%)",
          }}
        />

        {/* section label — top-left */}
        <div className="absolute top-5 left-5 md:top-7 md:left-9 z-[4] text-[10px] uppercase tracking-[0.3em] text-foreground/55">
          {label}
        </div>

        {/* counter — top-right */}
        <div className="absolute top-5 right-5 md:top-7 md:right-9 z-[4] font-sans text-[11px] tracking-[0.14em] text-foreground/50 tabular-nums">
          <span className="text-foreground">{String(current + 1).padStart(2, "0")}</span>
          <span className="mx-1">/</span>
          {two}
        </div>

        {/* title block — clip-reveals on every slide change */}
        <div
          key={`panel-${current}`}
          className="clip-rise absolute left-5 right-5 bottom-16 md:left-10 md:right-10 md:bottom-[88px] z-[4] max-w-[720px]"
        >
          <div className="text-[10px] uppercase tracking-[0.3em] text-foreground/60 mb-3 md:mb-4">
            {cap.kicker}
          </div>
          <h3 className="font-display font-extralight text-[clamp(34px,6.2vw,76px)] leading-[0.94] tracking-[-0.035em] text-foreground mb-4">
            {cap.title}
          </h3>
          <p className="font-sans font-light text-[13px] md:text-[15px] leading-[1.6] text-foreground-cool max-w-[48ch] mb-5">
            {cap.description}
          </p>
          <div className="flex flex-wrap gap-2 md:gap-2.5">
            {cap.tags.map((t) => (
              <span
                key={t}
                className="font-sans text-[10px] uppercase tracking-[0.14em] text-foreground/80 border border-foreground/25 px-3 py-[7px]"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* arrows — quiet, surface on hover (always visible on touch) */}
        <button
          type="button"
          onClick={interact(prev)}
          aria-label="Previous"
          className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 z-[5] h-11 w-11 inline-flex items-center justify-center bg-background/30 backdrop-blur-sm border border-foreground/15 text-foreground/80 transition-all duration-300 hover:bg-background/55 hover:border-foreground/50 hover:text-foreground md:opacity-0 md:group-hover/gal:opacity-100"
        >
          <span aria-hidden className="text-[18px] leading-none">←</span>
        </button>
        <button
          type="button"
          onClick={interact(next)}
          aria-label="Next"
          className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 z-[5] h-11 w-11 inline-flex items-center justify-center bg-background/30 backdrop-blur-sm border border-foreground/15 text-foreground/80 transition-all duration-300 hover:bg-background/55 hover:border-foreground/50 hover:text-foreground md:opacity-0 md:group-hover/gal:opacity-100"
        >
          <span aria-hidden className="text-[18px] leading-none">→</span>
        </button>

        {/* segmented progress bar — one segment per project */}
        <div className="absolute left-5 right-5 md:left-10 md:right-10 bottom-6 md:bottom-8 z-[5] flex gap-2 md:gap-2.5">
          {items.map((it, i) => (
            <button
              key={it.number}
              type="button"
              onClick={interact(() => go(i))}
              aria-label={`Go to ${it.title}`}
              className="relative h-[2px] flex-1 overflow-hidden bg-foreground/20 transition-colors duration-300 hover:bg-foreground/40"
            >
              {i < current && (
                <span className="absolute inset-0 bg-foreground" />
              )}
              {i === current && (
                <span
                  key={`fill-${current}`}
                  className="seg-fill absolute inset-0 bg-foreground"
                  style={{
                    animationDuration: `${AUTO_ADVANCE_MS}ms`,
                    animationPlayState: paused ? "paused" : "running",
                  }}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
