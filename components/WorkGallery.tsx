"use client";

import { useEffect, useRef, useState } from "react";
import ImageFrame from "@/components/ImageFrame";
import type { Capability } from "@/content/capabilities";

const AUTO_ADVANCE_MS = 6000;

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

  // gentle auto-advance, pauses on user interaction
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

  return (
    <div
      className="relative w-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* counter + hint */}
      <div className="mb-4 flex items-center justify-between gap-4 text-[10px] uppercase tracking-[0.25em] text-muted">
        <span>
          {String(current + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
        </span>
        <span className="hidden md:inline">{items[current].title}</span>
      </div>

      {/* carousel viewport with arrows */}
      <div className="relative">
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-[700ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {items.map((cap, i) => (
              <div key={cap.number} className="w-full shrink-0 px-2 md:px-4">
                <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-6 md:gap-10 items-center">
                  <div className={i === current ? "pop-now" : "pop-hidden"}>
                    <ImageFrame
                      src={cap.image}
                      alt={cap.title}
                      ratio="video"
                      priority={i === 0}
                    />
                  </div>
                  <div className="md:pl-2">
                    <div
                      className={`text-[10px] uppercase tracking-[0.3em] text-muted mb-3 ${
                        i === current ? "pop-now" : "pop-hidden"
                      }`}
                      style={{ transitionDelay: i === current ? "120ms" : "0ms" }}
                    >
                      Section {cap.number}
                    </div>
                    <h3
                      className={`font-display font-extralight text-[24px] md:text-[30px] tracking-[-0.02em] mb-3 text-foreground ${
                        i === current ? "pop-now" : "pop-hidden"
                      }`}
                      style={{ transitionDelay: i === current ? "200ms" : "0ms" }}
                    >
                      {cap.title}
                    </h3>
                    <p
                      className={`font-sans font-light text-[14px] md:text-[15px] leading-[1.6] text-muted ${
                        i === current ? "pop-now" : "pop-hidden"
                      }`}
                      style={{ transitionDelay: i === current ? "280ms" : "0ms" }}
                    >
                      {cap.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* prominent prev / next arrows */}
        <button
          type="button"
          onClick={interact(prev)}
          aria-label="Previous"
          className="absolute left-0 md:-left-2 top-1/2 -translate-y-1/2 z-10 h-12 w-12 md:h-14 md:w-14 inline-flex items-center justify-center bg-background/70 backdrop-blur-sm border border-border text-foreground transition-all duration-300 hover:bg-background hover:border-foreground"
        >
          <span aria-hidden className="text-[20px] md:text-[22px] leading-none">←</span>
        </button>
        <button
          type="button"
          onClick={interact(next)}
          aria-label="Next"
          className="absolute right-0 md:-right-2 top-1/2 -translate-y-1/2 z-10 h-12 w-12 md:h-14 md:w-14 inline-flex items-center justify-center bg-background/70 backdrop-blur-sm border border-border text-foreground transition-all duration-300 hover:bg-background hover:border-foreground"
        >
          <span aria-hidden className="text-[20px] md:text-[22px] leading-none">→</span>
        </button>
      </div>

      {/* dots */}
      <div className="mt-6 md:mt-8 flex items-center justify-center gap-2">
        {items.map((it, i) => (
          <button
            key={it.number}
            type="button"
            aria-label={`Go to ${it.title}`}
            onClick={interact(() => go(i))}
            className={`h-[6px] transition-all duration-300 ${
              i === current ? "w-10 bg-foreground" : "w-2 bg-muted/40 hover:bg-muted"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
