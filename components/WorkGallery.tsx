"use client";

import { useEffect, useRef, useState } from "react";
import ImageFrame from "@/components/ImageFrame";
import type { Capability } from "@/content/capabilities";

export default function WorkGallery({ items }: { items: Capability[] }) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const io = new IntersectionObserver(
      (entries) => {
        let bestIdx = current;
        let bestRatio = 0;
        entries.forEach((e) => {
          if (e.intersectionRatio > bestRatio) {
            const i = cardsRef.current.indexOf(e.target as HTMLDivElement);
            if (i !== -1) {
              bestRatio = e.intersectionRatio;
              bestIdx = i;
            }
          }
        });
        if (bestRatio > 0.5) setCurrent(bestIdx);
      },
      { root: scroller, threshold: [0.3, 0.55, 0.8] },
    );
    cardsRef.current.forEach((c) => c && io.observe(c));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollToCard = (i: number) => {
    const card = cardsRef.current[i];
    const scroller = scrollerRef.current;
    if (card && scroller) {
      scroller.scrollTo({ left: card.offsetLeft - scroller.offsetLeft, behavior: "smooth" });
    }
  };

  return (
    <div className="relative w-full">
      <div className="mb-4 flex items-center justify-between gap-4 text-[10px] uppercase tracking-[0.25em] text-muted">
        <span>
          {String(current + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
        </span>
        <span className="hidden md:inline">↔ Swipe or use arrows</span>
      </div>
      <div
        ref={scrollerRef}
        className="gallery-scroller flex gap-5 md:gap-8 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 -mx-6 md:-mx-12 lg:-mx-20 px-6 md:px-12 lg:px-20"
      >
        {items.map((cap, i) => (
          <div
            key={cap.number}
            ref={(el) => {
              cardsRef.current[i] = el;
            }}
            className={`shrink-0 snap-start w-[78vw] md:w-[44vw] lg:w-[34vw] ${
              i === current ? "is-current" : ""
            }`}
          >
            <div className="flex flex-col">
              <div className="pop" style={{ transitionDelay: "0ms" }}>
                <ImageFrame
                  src={cap.image}
                  alt={cap.title}
                  ratio="video"
                  priority={i === 0}
                />
              </div>
              <div className="mt-4 md:mt-5">
                <div
                  className="pop text-[10px] uppercase tracking-[0.3em] text-muted mb-2"
                  style={{ transitionDelay: "160ms" }}
                >
                  Section {cap.number}
                </div>
                <h3
                  className="pop font-display font-extralight text-[22px] md:text-[26px] tracking-[-0.02em] mb-2 text-foreground"
                  style={{ transitionDelay: "240ms" }}
                >
                  {cap.title}
                </h3>
                <p
                  className="pop font-sans font-light text-[13px] md:text-[14px] leading-[1.55] text-muted"
                  style={{ transitionDelay: "320ms" }}
                >
                  {cap.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* indicators + prev/next */}
      <div className="mt-6 md:mt-8 flex items-center justify-between gap-6">
        <button
          type="button"
          onClick={() => scrollToCard(Math.max(0, current - 1))}
          disabled={current === 0}
          aria-label="Previous"
          className="h-10 w-10 md:h-11 md:w-11 inline-flex items-center justify-center border border-border text-foreground transition-colors duration-300 hover:border-foreground disabled:opacity-25 disabled:cursor-not-allowed"
        >
          <span aria-hidden className="text-[18px] leading-none">←</span>
        </button>

        <div className="flex items-center gap-2">
          {items.map((it, i) => (
            <button
              key={it.number}
              type="button"
              aria-label={`Go to ${it.title}`}
              onClick={() => scrollToCard(i)}
              className={`h-[6px] transition-all duration-300 ${
                i === current ? "w-10 bg-foreground" : "w-2 bg-muted/40 hover:bg-muted"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => scrollToCard(Math.min(items.length - 1, current + 1))}
          disabled={current === items.length - 1}
          aria-label="Next"
          className="h-10 w-10 md:h-11 md:w-11 inline-flex items-center justify-center border border-border text-foreground transition-colors duration-300 hover:border-foreground disabled:opacity-25 disabled:cursor-not-allowed"
        >
          <span aria-hidden className="text-[18px] leading-none">→</span>
        </button>
      </div>
    </div>
  );
}
