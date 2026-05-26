"use client";

import { useEffect } from "react";

// JS-driven full-page deck:
//  - one gesture = one section (no resting in the gap between sections)
//  - controlled "boom" jump, then the landed section plays its entrance
//  - the tall #work section is free-scroll
export default function SectionDeck() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const deck = Array.from(document.querySelectorAll<HTMLElement>("[data-snap]"));
    const work = document.getElementById("work");
    if (deck.length === 0) return;

    const topOf = (el: HTMLElement) => el.getBoundingClientRect().top + window.scrollY;
    const workTop = () => (work ? topOf(work) : Number.POSITIVE_INFINITY);
    const inWork = () => window.scrollY >= workTop() - 4;
    const atWorkTop = () => Math.abs(window.scrollY - workTop()) <= 8;
    const isLast = () => index >= deck.length - 1;

    let index = 0;

    const updateActive = () => {
      const deckActive = !inWork();
      deck.forEach((s, i) => s.classList.toggle("is-active", deckActive && i === index));
    };

    // start at the top, hero active
    window.scrollTo({ top: 0, behavior: "auto" });
    updateActive();
    const resetTop = () => {
      window.scrollTo({ top: 0, behavior: "auto" });
      index = 0;
      updateActive();
    };
    window.addEventListener("load", resetTop);
    window.addEventListener("pageshow", resetTop);

    if (reduce) {
      // no scroll hijacking; still ensure everything is visible
      deck.forEach((s) => s.classList.add("is-active"));
      return () => {
        window.removeEventListener("load", resetTop);
        window.removeEventListener("pageshow", resetTop);
      };
    }

    // ---- controlled scroll animation ----
    let rafScroll = 0;
    let animating = false;
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
    const animateTo = (targetY: number, onDone: () => void) => {
      cancelAnimationFrame(rafScroll);
      const startY = window.scrollY;
      const dist = targetY - startY;
      const duration = 620;
      const start = performance.now();
      animating = true;
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        window.scrollTo(0, startY + dist * easeOutCubic(t));
        if (t < 1) {
          rafScroll = requestAnimationFrame(step);
        } else {
          animating = false;
          onDone();
        }
      };
      rafScroll = requestAnimationFrame(step);
    };

    // ---- gesture lock: release only after motion + momentum settle ----
    let locked = false;
    let lastWheel = 0;
    let watching = false;
    const unlockWatch = () => {
      if (!animating && performance.now() - lastWheel > 160) {
        locked = false;
        watching = false;
        return;
      }
      requestAnimationFrame(unlockWatch);
    };
    const startWatch = () => {
      if (!watching) {
        watching = true;
        requestAnimationFrame(unlockWatch);
      }
    };

    const goTo = (i: number) => {
      index = Math.max(0, Math.min(i, deck.length - 1));
      locked = true;
      animateTo(topOf(deck[index]), updateActive);
      startWatch();
    };
    const enterWork = () => {
      locked = true;
      animateTo(workTop(), updateActive);
      startWatch();
    };

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
        if (!down && atWorkTop()) {
          e.preventDefault();
          lastWheel = performance.now();
          if (!locked) goTo(deck.length - 1);
        }
        return; // free-scroll through the work images
      }

      e.preventDefault();
      lastWheel = performance.now();
      if (locked) return;
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

    // hero CTAs / scroll prompt drive the same deck animation
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement)?.closest?.(
        'a[href^="#"]',
      ) as HTMLAnchorElement | null;
      if (!a) return;
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      e.preventDefault();
      if (id === "#work") {
        enterWork();
        return;
      }
      const target = document.querySelector(id) as HTMLElement | null;
      const i = target ? deck.indexOf(target) : -1;
      if (i !== -1 && !locked) goTo(i);
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

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    document.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(rafScroll);
      window.removeEventListener("load", resetTop);
      window.removeEventListener("pageshow", resetTop);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      document.removeEventListener("click", onClick);
    };
  }, []);

  return null;
}
