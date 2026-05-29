"use client";

import { useRef, useState } from "react";

export default function HeroVideo({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const [ok, setOk] = useState(true);

  if (!ok) return null;

  return (
    <video
      ref={ref}
      src={src}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      onError={() => setOk(false)}
      onCanPlay={() => ref.current?.play().catch(() => {})}
      className="absolute inset-0 w-full h-full object-cover opacity-[0.32] pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}
