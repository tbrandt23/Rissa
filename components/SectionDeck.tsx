"use client";

import { useEffect } from "react";

// JS-driven section deck: one scroll gesture = one section.
// Deck sections carry [data-snap]; the tall #work section is free-scroll.
export default function SectionDeck() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const deck = Array.from(document.querySelectorAll<HTMLElement>("[data-snap]"));
    const work = document.getElementById("work");
    if (deck.length === 0) return;

    const topOf = (el: HTMLElement) => el.getBoundingClientRect().top + window.scrollY;

    let index = 0;
    let locked = false;
    let releaseTimer = 0;
    let hardTimer = 0;

    const unlockSoon = () => {
      window.clearTimeout(releaseTimer);
      releaseTimer = window.setTimeout(() => (locked = false), 140);
    };

    const goTo = (i: number) => {
      const clamped = Math.max(0, Math.min(i, deck.length - 1));
      index = clamped;
      locked = true;
      window.scrollTo({ top: topOf(deck[clamped]), behavior: "smooth" });
      // failsafe in case scrollend never fires
      window.clearTimeout(hardTimer);
      hardTimer = window.setTimeout(() => (locked = false), 1000);
    };

    // keep `index` in sync while free-scrolling / resizing
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && e.intersectionRatio >= 0.5) {
            const i = deck.indexOf(e.target as HTMLElement);
            if (i !== -1) index = i;
          }
        });
      },
      { threshold: [0.5] },
    );
    deck.forEach((s) => io.observe(s));

    const workTop = () => (work ? topOf(work) : Number.POSITIVE_INFINITY);
    const inWork = () => window.scrollY >= workTop() - 4;
    const atWorkTop = () => window.scrollY <= workTop() + 4;
    const atLastDeck = () => index >= deck.length - 1;

    const onWheel = (e: WheelEvent) => {
      const down = e.deltaY > 0;
      if (Math.abs(e.deltaY) < 2) return;

      if (inWork()) {
        // free-scroll through the work images; only intercept an upward
        // gesture at the very top to hop back to the last deck section
        if (!down && atWorkTop()) {
          e.preventDefault();
          if (!locked) {
            goTo(deck.length - 1);
          }
        }
        return;
      }

      // deck zone
      if (down && atLastDeck()) {
        // let the page fall naturally into the free-scroll work section
        return;
      }
      e.preventDefault();
      if (locked) {
        unlockSoon();
        return;
      }
      goTo(index + (down ? 1 : -1));
    };

    const onKey = (e: KeyboardEvent) => {
      if (inWork()) return;
      if (["ArrowDown", "PageDown", " "].includes(e.key)) {
        if (atLastDeck()) return;
        e.preventDefault();
        if (!locked) goTo(index + 1);
      } else if (["ArrowUp", "PageUp"].includes(e.key)) {
        e.preventDefault();
        if (!locked) goTo(index - 1);
      }
    };

    // touch (mobile)
    let touchY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0].clientY;
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (inWork()) return;
      const dy = touchY - e.changedTouches[0].clientY;
      if (Math.abs(dy) < 45) return;
      const down = dy > 0;
      if (down && atLastDeck()) return;
      if (!locked) goTo(index + (down ? 1 : -1));
    };

    const onScrollEnd = () => unlockSoon();

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("scrollend", onScrollEnd);

    return () => {
      io.disconnect();
      window.clearTimeout(releaseTimer);
      window.clearTimeout(hardTimer);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("scrollend", onScrollEnd);
    };
  }, []);

  return null;
}
