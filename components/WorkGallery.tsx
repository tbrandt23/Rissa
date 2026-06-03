"use client";

import Image from "next/image";
import { useState } from "react";
import type { Capability } from "@/content/capabilities";

// Desktop 3-col masonry placements for 6 items.
// Creates an asymmetric grid: two wide landscape cells anchor top & bottom,
// two tall portrait cells run down the right and left edges,
// and two standard cells fill the middle.
const PLACEMENTS = [
  { col: "1 / 3", row: "1 / 2" }, // 01 — wide landscape (top-left)
  { col: "3 / 4", row: "1 / 3" }, // 02 — tall portrait (right edge)
  { col: "1 / 2", row: "2 / 3" }, // 03 — standard (mid-left)
  { col: "2 / 3", row: "2 / 3" }, // 04 — standard (mid-center)
  { col: "1 / 2", row: "3 / 5" }, // 05 — tall portrait (left edge)
  { col: "2 / 4", row: "3 / 4" }, // 06 — wide landscape (bottom-right)
];

function Cell({ cap, index }: { cap: Capability; index: number }) {
  const [active, setActive] = useState(false);

  return (
    <div
      className="relative w-full h-full overflow-hidden cursor-pointer bg-border-soft"
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
    >
      <Image
        src={cap.image}
        alt={cap.title}
        fill
        unoptimized
        priority={index < 2}
        sizes="(min-width: 1024px) 50vw, (min-width: 640px) 50vw, 100vw"
        className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          filter: "brightness(0.72)",
          transform: active ? "scale(1.05)" : "scale(1)",
        }}
      />

      {/* persistent counter */}
      <span className="absolute top-3 left-3 z-10 font-sans text-[10px] tracking-[0.2em] text-foreground/50 select-none">
        {cap.number}
      </span>

      {/* hover veil */}
      <div
        aria-hidden
        className="absolute inset-0 z-[4] bg-background/65 transition-opacity duration-500"
        style={{ opacity: active ? 1 : 0 }}
      />

      {/* hover text block — slides up from bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 z-[5] p-4 lg:p-5 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          opacity: active ? 1 : 0,
          transform: active ? "translateY(0)" : "translateY(12px)",
        }}
      >
        <div className="text-[9px] uppercase tracking-[0.28em] text-foreground/55 mb-1.5">
          {cap.kicker}
        </div>
        <h3 className="font-display font-extralight text-[clamp(18px,2.2vw,26px)] leading-[1.05] tracking-[-0.02em] text-foreground mb-2">
          {cap.title}
        </h3>
        <p className="font-sans font-light text-[12px] leading-[1.55] text-foreground-cool mb-3 max-w-[26ch]">
          {cap.description}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {cap.tags.map((t) => (
            <span
              key={t}
              className="text-[9px] uppercase tracking-[0.14em] text-foreground/70 border border-foreground/20 px-2 py-[5px]"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function WorkGallery({
  items,
  label = "Selected Work",
}: {
  items: Capability[];
  label?: string;
}) {
  return (
    <div className="w-full">
      <div className="mb-5 text-[10px] uppercase tracking-[0.3em] text-muted">
        {label}
      </div>

      {/* Mobile: single column */}
      <div className="flex flex-col gap-[2px] sm:hidden">
        {items.map((cap, i) => (
          <div key={cap.number} className="relative aspect-[4/3]">
            <Cell cap={cap} index={i} />
          </div>
        ))}
      </div>

      {/* Tablet: 2-col auto grid */}
      <div className="hidden sm:grid lg:hidden grid-cols-2 gap-[2px]">
        {items.map((cap, i) => (
          <div key={cap.number} className="relative aspect-[3/4]">
            <Cell cap={cap} index={i} />
          </div>
        ))}
      </div>

      {/* Desktop: custom 3-col masonry */}
      <div
        className="hidden lg:grid gap-[2px]"
        style={{
          gridTemplateColumns: "repeat(3, 1fr)",
          gridTemplateRows: "260px 260px 300px 300px",
        }}
      >
        {items.map((cap, i) => {
          const pos = PLACEMENTS[i];
          return (
            <div
              key={cap.number}
              style={pos ? { gridColumn: pos.col, gridRow: pos.row } : undefined}
            >
              <Cell cap={cap} index={i} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
