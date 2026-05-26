"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import Snap from "lenis/snap";

export default function SmoothScroll() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
    });

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    // section-to-section snapping (gentle: only engages near a boundary)
    const snap = new Snap(lenis, {
      type: "proximity",
      distanceThreshold: "25%",
      duration: 1.0,
      easing: (t) => 1 - Math.pow(1 - t, 3),
    });
    const removers: Array<() => void> = [];
    document.querySelectorAll<HTMLElement>("[data-snap]").forEach((el) => {
      removers.push(snap.addElement(el, { align: "start" }));
    });

    // smooth in-page anchor jumps
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement)?.closest?.(
        'a[href^="#"]',
      ) as HTMLAnchorElement | null;
      if (!anchor) return;
      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: 0 });
    };
    document.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("click", onClick);
      removers.forEach((r) => r());
      snap.destroy();
      lenis.destroy();
    };
  }, []);

  return null;
}
