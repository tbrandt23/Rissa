"use client";

import { useEffect, useState } from "react";

const formatLA = () =>
  new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date());

export default function LiveStatus() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    setTime(formatLA());
    const id = setInterval(() => setTime(formatLA()), 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <span suppressHydrationWarning className="inline-flex items-center gap-2">
      <span className="inline-block w-[6px] h-[6px] rounded-full bg-foreground animate-pulse" />
      Los Angeles · {time ?? "—:—"} · In studio
    </span>
  );
}
