"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Capability } from "@/content/capabilities";

const ratioClass = (r: Capability["ratio"]) =>
  r === "video"
    ? "aspect-video"
    : r === "4/5"
    ? "aspect-[4/5]"
    : r === "3/4"
    ? "aspect-[3/4]"
    : "aspect-square";

export default function ImageFrame({
  src,
  alt,
  ratio,
  label,
  number,
  priority,
}: {
  src: string;
  alt: string;
  ratio: Capability["ratio"];
  label?: string;
  number?: string;
  priority?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`group relative w-full overflow-hidden border border-border-soft reveal-mask ${
        visible ? "is-visible" : ""
      } ${ratioClass(ratio)}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 60vw, 100vw"
        className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
        priority={priority}
      />
      {label && (
        <div className="absolute bottom-5 left-5 md:bottom-6 md:left-6 z-10 text-[10px] uppercase tracking-[0.25em] text-muted transition-transform duration-500 ease-out group-hover:-translate-y-1">
          Section {number}
          <span className="block font-display font-light text-[16px] md:text-[18px] tracking-[-0.01em] normal-case text-foreground mt-2">
            {label}
          </span>
        </div>
      )}
    </div>
  );
}
