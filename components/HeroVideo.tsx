"use client";

import { useEffect, useRef, useState } from "react";

const ROTATE_MS = 9000;
const FADE_MS = 800;

export default function HeroVideo({ sources }: { sources: string[] }) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  const [dead, setDead] = useState<boolean[]>(() => sources.map(() => false));

  // rotate through sources with a crossfade
  useEffect(() => {
    if (sources.length <= 1) return;
    const interval = window.setInterval(() => {
      setVisible(false);
      window.setTimeout(() => {
        setIdx((i) => {
          // skip any sources we've already seen fail
          for (let step = 1; step <= sources.length; step++) {
            const next = (i + step) % sources.length;
            if (!dead[next]) return next;
          }
          return i;
        });
        setVisible(true);
      }, FADE_MS);
    }, ROTATE_MS);
    return () => window.clearInterval(interval);
  }, [sources, dead]);

  // if ALL sources are dead, render nothing (gradient fallback will show through)
  if (dead.every(Boolean)) return null;

  return (
    <video
      ref={ref}
      key={sources[idx]} /* force reload on src change */
      src={sources[idx]}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      onError={() =>
        setDead((d) => {
          const next = [...d];
          next[idx] = true;
          return next;
        })
      }
      onCanPlay={() => ref.current?.play().catch(() => {})}
      style={{
        transition: `opacity ${FADE_MS}ms cubic-bezier(0.16, 1, 0.3, 1)`,
        opacity: visible ? 0.5 : 0,
      }}
      className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}
