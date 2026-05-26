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

    // mandatory snapping so every full-screen section locks to fit.
    const snap = new Snap(lenis, {
      type: "mandatory",
      duration: 0.8,
      easing: (t) => 1 - Math.pow(1 - t, 3),
    });
    const removers: Array<() => void> = [];
    document.querySelectorAll<HTMLElement>("[data-snap]").forEach((el) => {
      removers.push(snap.addElement(el, { align: "start" }));
    });

    // The Work section is taller than the viewport — mandatory snapping would
    // trap you at its top. So disable the snap once you're inside Work and
    // re-enable it when you scroll back above it.
    let workTop = Number.POSITIVE_INFINITY;
    const computeWorkTop = () => {
      const el = document.getElementById("work");
      workTop = el ? el.getBoundingClientRect().top + window.scrollY : Number.POSITIVE_INFINITY;
      snap.resize();
    };
    computeWorkTop();
    const settleTimer = setTimeout(computeWorkTop, 700);
    window.addEventListener("load", computeWorkTop);
    window.addEventListener("resize", computeWorkTop);

    let snapOff = false;
    const onScroll = ({ scroll }: { scroll: number }) => {
      if (scroll > workTop + 4 && !snapOff) {
        snapOff = true;
        snap.stop();
      } else if (scroll < workTop - 4 && snapOff) {
        snapOff = false;
        snap.start();
      }
    };
    lenis.on("scroll", onScroll);

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
      clearTimeout(settleTimer);
      window.removeEventListener("load", computeWorkTop);
      window.removeEventListener("resize", computeWorkTop);
      document.removeEventListener("click", onClick);
      lenis.off("scroll", onScroll);
      removers.forEach((r) => r());
      snap.destroy();
      lenis.destroy();
    };
  }, []);

  return null;
}
