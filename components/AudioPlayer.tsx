"use client";

import { useEffect, useRef, useState } from "react";

const fmt = (s: number) => {
  if (!isFinite(s) || s < 0) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
};

export default function AudioPlayer({
  src,
  artist,
  title,
  fallbackDuration = "47:12",
}: {
  src: string;
  artist: string;
  title: string;
  fallbackDuration?: string;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0..1
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hasAudio, setHasAudio] = useState(true);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onTime = () => {
      setCurrent(a.currentTime);
      if (a.duration > 0) setProgress(a.currentTime / a.duration);
    };
    const onMeta = () => setDuration(a.duration || 0);
    const onEnd = () => setPlaying(false);
    const onErr = () => setHasAudio(false);
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("loadedmetadata", onMeta);
    a.addEventListener("ended", onEnd);
    a.addEventListener("error", onErr);
    return () => {
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("loadedmetadata", onMeta);
      a.removeEventListener("ended", onEnd);
      a.removeEventListener("error", onErr);
    };
  }, []);

  const toggle = () => {
    const a = audioRef.current;
    if (!a || !hasAudio) {
      // visual-only fallback: animate a fake progress
      setPlaying((p) => !p);
      return;
    }
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      a.play().then(() => setPlaying(true)).catch(() => {
        setHasAudio(false);
        setPlaying((p) => !p);
      });
    }
  };

  // visual-only fake progress when no real audio
  useEffect(() => {
    if (hasAudio || !playing) return;
    const id = setInterval(() => {
      setProgress((p) => (p >= 1 ? 0 : p + 0.005));
    }, 100);
    return () => clearInterval(id);
  }, [hasAudio, playing]);

  return (
    <div className="w-full border border-border p-6 md:p-8">
      <audio ref={audioRef} src={src} preload="metadata" />
      <div className="flex items-center gap-5 md:gap-7">
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pause" : "Play"}
          className="shrink-0 h-12 w-12 md:h-14 md:w-14 inline-flex items-center justify-center border border-border text-foreground transition-colors duration-300 hover:border-foreground"
        >
          {playing ? (
            <span className="flex gap-[3px]">
              <span className="block w-[3px] h-[14px] bg-foreground" />
              <span className="block w-[3px] h-[14px] bg-foreground" />
            </span>
          ) : (
            <span
              aria-hidden
              style={{
                width: 0,
                height: 0,
                borderTop: "7px solid transparent",
                borderBottom: "7px solid transparent",
                borderLeft: "10px solid currentColor",
                marginLeft: "2px",
              }}
            />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-3 mb-3 flex-wrap">
            <span className="font-display font-light text-[16px] md:text-[18px] tracking-[-0.01em] text-foreground truncate">
              {title}
            </span>
            <span className="text-[10px] uppercase tracking-[0.25em] text-muted shrink-0">
              {artist}
            </span>
          </div>
          <div className="h-[2px] bg-border relative overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-foreground transition-[width] duration-100 ease-linear"
              style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between text-[10px] uppercase tracking-[0.2em] text-muted">
            <span>{fmt(current)}</span>
            <span>{duration > 0 ? fmt(duration) : fallbackDuration}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
