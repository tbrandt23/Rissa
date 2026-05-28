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
      <div
        ref={scrollerRef}
        className="gallery-scroller flex gap-6 md:gap-10 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 -mx-6 md:-mx-12 lg:-mx-20 px-6 md:px-12 lg:px-20"
      >
        {items.map((cap, i) => (
          <div
            key={cap.number}
            ref={(el) => {
              cardsRef.current[i] = el;
            }}
            className={`shrink-0 snap-start w-[85vw] md:w-[64vw] lg:w-[58vw] ${
              i === current ? "is-current" : ""
            }`}
          >
            <div className="grid grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-6 md:gap-10 items-center">
              <div className="pop" style={{ transitionDelay: "0ms" }}>
                <ImageFrame
                  src={cap.image}
                  alt={cap.title}
                  ratio={cap.ratio}
                  number={cap.number}
                  label={cap.title}
                  priority={i === 0}
                />
              </div>
              <div>
                <div
                  className="pop text-[10px] uppercase tracking-[0.3em] text-muted mb-4"
                  style={{ transitionDelay: "180ms" }}
                >
                  Section {cap.number}
                </div>
                <h3
                  className="pop font-display font-extralight text-[28px] md:text-[36px] tracking-[-0.02em] mb-4 text-foreground"
                  style={{ transitionDelay: "260ms" }}
                >
                  {cap.title}
                </h3>
                <p
                  className="pop font-sans font-light text-[15px] leading-[1.6] text-muted max-w-sm"
                  style={{ transitionDelay: "340ms" }}
                >
                  {cap.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* indicators + prev/next */}
      <div className="mt-8 md:mt-10 flex items-center justify-between gap-6">
        <button
          type="button"
          onClick={() => scrollToCard(Math.max(0, current - 1))}
          disabled={current === 0}
          aria-label="Previous"
          className="font-sans text-[12px] uppercase tracking-[0.25em] text-muted transition-opacity duration-300 hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ← Prev
        </button>

        <div className="flex items-center gap-2">
          {items.map((it, i) => (
            <button
              key={it.number}
              type="button"
              aria-label={`Go to ${it.title}`}
              onClick={() => scrollToCard(i)}
              className={`h-[6px] rounded-none transition-all duration-300 ${
                i === current ? "w-8 bg-foreground" : "w-2 bg-muted/40 hover:bg-muted"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => scrollToCard(Math.min(items.length - 1, current + 1))}
          disabled={current === items.length - 1}
          aria-label="Next"
          className="font-sans text-[12px] uppercase tracking-[0.25em] text-muted transition-opacity duration-300 hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
