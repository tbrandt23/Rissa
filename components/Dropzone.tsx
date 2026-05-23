"use client";

import { useState, DragEvent } from "react";
import { submitCopy } from "@/content/copy";

export default function Dropzone() {
  const [active, setActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const onDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setActive(false);
    const f = e.dataTransfer.files?.[0];
    if (f) setFileName(f.name);
  };

  return (
    <label
      onDragOver={(e) => {
        e.preventDefault();
        setActive(true);
      }}
      onDragLeave={() => setActive(false)}
      onDrop={onDrop}
      className={`block cursor-pointer border border-dashed px-6 py-16 md:py-20 text-center transition-colors duration-300 ${
        active ? "border-foreground" : "border-border hover:border-muted"
      }`}
    >
      <input
        type="file"
        className="sr-only"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) setFileName(f.name);
        }}
      />
      <div className="font-display font-light text-[18px] md:text-[20px] text-foreground mb-3">
        {fileName ?? "Drop files here or click to browse"}
      </div>
      <div className="text-[11px] uppercase tracking-[0.2em] text-muted">
        {submitCopy.acceptedTypes}
      </div>
    </label>
  );
}
