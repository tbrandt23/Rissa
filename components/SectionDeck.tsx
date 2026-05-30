"use client";

import { useEffect } from "react";

// JS-driven full-page deck.
//
// Gesture detection: any wheel event arriving <200ms after the previous one
// is treated as the same gesture (or its momentum tail) and ignored.
// Only a "new" gesture (≥200ms gap of silence) advances. This is the only
// model that reliably distinguishes a Mac trackpad swipe from its 1-second
// momentum tail. Plus a 550ms hard rate-limit between advances as a safety.
export default function SectionDeck() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const deck = Array.from(document.querySelectorAll<HTMLElement>("[data-snap]"));
    if (deck.length === 0) return;

    const topOf = (el: HTMLElement) => el.getBoundingClientRect().top + window.scrollY;

    let index = 0;

    const updateActive = () => {
      deck.forEach((s, i) => s.classList.toggle("is-active", i === index));
    };

    window.scrollTo({ top: 0, behavior: "auto" });
    updateActive();
    const onPageShow = () => {
      window.scrollTo({ top: 0, behavior: "auto" });
      index = 0;
      updateActive();
    };
    window.addEventListener("pageshow", onPageShow);

    if (reduce) {
      deck.forEach((s) => s.classList.add("is-active"));
      return () => window.removeEventListener("pageshow", onPageShow);
    }

    // ---- controlled scroll animation ----
    let rafScroll = 0;
    let animating = false;
    const easeOutQuint = (t: number) => 1 - Math.pow(1 - t, 5);
    const animateTo = (targetY: number, onDone: () => void) => {
      cancelAnimationFrame(rafScroll);
      const startY = window.scrollY;
      const dist = targetY - startY;
      const duration = 480;
      const start = performance.now();
      animating = true;
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        window.scrollTo(0, startY + dist * easeOutQuint(t));
        if (t < 1) {
          rafScroll = requestAnimationFrame(step);
        } else {
          animating = false;
          onDone();
        }
      };
      rafScroll = requestAnimationFrame(step);
    };

    let lastWheelTime = 0;
    let lastAdvanceTime = 0;
    const NEW_GESTURE_GAP = 200; // ms of silence required to count as a new gesture
    const MIN_ADVANCE_INTERVAL = 550; // hard rate-limit between advances

    const goTo = (i: number) => {
      const clamped = Math.max(0, Math.min(i, deck.length - 1));
      if (clamped === index && !animating) return;
      index = clamped;
      animateTo(topOf(deck[index]), updateActive);
    };

    const advance = (down: boolean) => {
      lastAdvanceTime = performance.now();
      goTo(index + (down ? 1 : -1));
    };

    const tryAdvance = (down: boolean) => {
      const now = performance.now();
      if (now - lastAdvanceTime < MIN_ADVANCE_INTERVAL) return;
      advance(down);
    };

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < 1) return;
      e.preventDefault();
      const now = performance.now();
      const gap = now - lastWheelTime;
      lastWheelTime = now;
      // Continuation of existing gesture / momentum tail — ignore
      if (gap < NEW_GESTURE_GAP) return;
      tryAdvance(e.deltaY > 0);
    };

    const onKey = (e: KeyboardEvent) => {
      const down = ["ArrowDown", "PageDown", " "].includes(e.key);
      const up = ["ArrowUp", "PageUp"].includes(e.key);
      if (!down && !up) return;
      e.preventDefault();
      tryAdvance(down);
    };

    let touchX = 0;
    let touchY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchX = e.touches[0].clientX;
      touchY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      const dx = touchX - e.touches[0].clientX;
      const dy = touchY - e.touches[0].clientY;
      if (Math.abs(dx) > Math.abs(dy)) return; // horizontal — let carousel handle
      if (e.cancelable) e.preventDefault();
    };
    const onTouchEnd = (e: TouchEvent) => {
      const dx = touchX - e.changedTouches[0].clientX;
      const dy = touchY - e.changedTouches[0].clientY;
      if (Math.abs(dx) > Math.abs(dy)) return;
      if (Math.abs(dy) < 45) return;
      tryAdvance(dy > 0);
    };

    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement)?.closest?.(
        'a[href^="#"]',
      ) as HTMLAnchorElement | null;
      if (!a) return;
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      e.preventDefault();
      const target = document.querySelector(id) as HTMLElement | null;
      const i = target ? deck.indexOf(target) : -1;
      if (i !== -1 && !animating) {
        lastAdvanceTime = performance.now();
        goTo(i);
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    document.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(rafScroll);
      window.removeEventListener("pageshow", onPageShow);
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
