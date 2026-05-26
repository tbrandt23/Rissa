"use client";

import { useEffect } from "react";

// JS-driven full-page deck: one gesture = one section, no resting in gaps.
// Deck sections carry [data-snap]; the tall #work section is free-scroll.
export default function SectionDeck() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    // always open at the top — ignore the browser's remembered scroll position
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo({ top: 0, behavior: "auto" });

    const deck = Array.from(document.querySelectorAll<HTMLElement>("[data-snap]"));
    const work = document.getElementById("work");
    if (deck.length === 0) return;

    const topOf = (el: HTMLElement) => el.getBoundingClientRect().top + window.scrollY;
    const workTop = () => (work ? topOf(work) : Number.POSITIVE_INFINITY);
    const inWork = () => window.scrollY >= workTop() - 4;
    const atWorkTop = () => Math.abs(window.scrollY - workTop()) <= 8;
    const isLast = () => index >= deck.length - 1;

    let index = 0;
    let locked = false;
    let quietTimer = 0;

    // release the lock only after the gesture AND its momentum have stopped
    const scheduleUnlock = () => {
      window.clearTimeout(quietTimer);
      quietTimer = window.setTimeout(() => {
        locked = false;
      }, 160);
    };

    const scrollToY = (y: number) => {
      locked = true;
      window.scrollTo({ top: y, behavior: "smooth" });
      scheduleUnlock();
    };

    const goTo = (i: number) => {
      index = Math.max(0, Math.min(i, deck.length - 1));
      scrollToY(topOf(deck[index]));
    };

    const enterWork = () => scrollToY(workTop());

    // keep `index` synced while free-scrolling Work or after resize
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting && e.intersectionRatio >= 0.55) {
            const i = deck.indexOf(e.target as HTMLElement);
            if (i !== -1) index = i;
          }
        }),
      { threshold: [0.55] },
    );
    deck.forEach((s) => io.observe(s));

    const advance = (down: boolean) => {
      if (down) {
        if (isLast()) enterWork();
        else goTo(index + 1);
      } else {
        goTo(index - 1);
      }
    };

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < 1) return;
      const down = e.deltaY > 0;

      if (inWork()) {
        // free-scroll through the work images; only intercept an upward
        // gesture at the very top to hop back to the last deck section
        if (!down && atWorkTop()) {
          e.preventDefault();
          if (!locked) goTo(deck.length - 1);
        }
        return;
      }

      e.preventDefault();
      if (locked) {
        scheduleUnlock();
        return;
      }
      advance(down);
    };

    const onKey = (e: KeyboardEvent) => {
      if (inWork()) return;
      const down = ["ArrowDown", "PageDown", " "].includes(e.key);
      const up = ["ArrowUp", "PageUp"].includes(e.key);
      if (!down && !up) return;
      e.preventDefault();
      if (!locked) advance(down);
    };

    let touchY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!inWork() && e.cancelable) e.preventDefault();
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (inWork()) return;
      const dy = touchY - e.changedTouches[0].clientY;
      if (Math.abs(dy) < 45) return;
      if (!locked) advance(dy > 0);
    };

    const onScrollEnd = () => scheduleUnlock();

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("scrollend", onScrollEnd);

    return () => {
      io.disconnect();
      window.clearTimeout(quietTimer);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("scrollend", onScrollEnd);
    };
  }, []);

  return null;
}
