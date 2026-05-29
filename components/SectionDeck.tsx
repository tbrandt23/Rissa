"use client";

import { useEffect } from "react";

// JS-driven full-page deck: every [data-snap] is a snap target.
// One gesture = one section. Reverse-direction scroll releases the lock
// instantly so going back up doesn't feel held by the previous animation.
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

    // open at the top, but only on real navigations (initial mount + bfcache restore)
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
      return () => {
        window.removeEventListener("pageshow", onPageShow);
      };
    }

    // ---- controlled scroll animation ----
    let rafScroll = 0;
    let animating = false;
    const easeOutQuint = (t: number) => 1 - Math.pow(1 - t, 5);
    const animateTo = (targetY: number, onDone: () => void) => {
      cancelAnimationFrame(rafScroll);
      const startY = window.scrollY;
      const dist = targetY - startY;
      const duration = 380;
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

    // ---- gesture lock: simple fixed cooldown after each advance ----
    // Predictable: ignore wheel during animation + a short cooldown, then
    // the next wheel event advances. No momentum tracking (which was
    // trackpad-dependent and either too sticky or too loose).
    let locked = false;
    let lastDir = 0;
    let unlockTimer = 0;
    const COOLDOWN = 180; // post-animation grace to absorb gesture tail

    const lockFor = (totalMs: number) => {
      locked = true;
      window.clearTimeout(unlockTimer);
      unlockTimer = window.setTimeout(() => {
        locked = false;
      }, totalMs);
    };

    const goTo = (i: number) => {
      const clamped = Math.max(0, Math.min(i, deck.length - 1));
      if (clamped === index && !animating) return;
      index = clamped;
      animateTo(topOf(deck[index]), updateActive);
      lockFor(380 + COOLDOWN);
    };

    const advance = (down: boolean) => {
      lastDir = down ? 1 : -1;
      goTo(index + (down ? 1 : -1));
    };

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < 1) return;
      const down = e.deltaY > 0;
      const dir = down ? 1 : -1;
      e.preventDefault();

      if (locked) {
        // direction reversal after animation done → release and advance
        if (!animating && dir !== lastDir) {
          window.clearTimeout(unlockTimer);
          locked = false;
          advance(down);
        }
        return;
      }
      advance(down);
    };

    const onKey = (e: KeyboardEvent) => {
      const down = ["ArrowDown", "PageDown", " "].includes(e.key);
      const up = ["ArrowUp", "PageUp"].includes(e.key);
      if (!down && !up) return;
      e.preventDefault();
      if (locked) {
        if (!animating && (down ? 1 : -1) !== lastDir) {
          window.clearTimeout(unlockTimer);
          locked = false;
          advance(down);
        }
        return;
      }
      advance(down);
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
      // let native handle clearly horizontal swipes (carousel)
      if (Math.abs(dx) > Math.abs(dy)) return;
      if (e.cancelable) e.preventDefault();
    };
    const onTouchEnd = (e: TouchEvent) => {
      const dx = touchX - e.changedTouches[0].clientX;
      const dy = touchY - e.changedTouches[0].clientY;
      if (Math.abs(dx) > Math.abs(dy)) return; // horizontal — carousel handled it
      if (Math.abs(dy) < 45) return;
      const down = dy > 0;
      if (locked && (animating || (down ? 1 : -1) === lastDir)) return;
      if (locked) {
        window.clearTimeout(unlockTimer);
        locked = false;
      }
      advance(down);
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
      if (i !== -1 && !animating) goTo(i);
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
