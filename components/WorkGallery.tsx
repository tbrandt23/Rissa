"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";

// px height of every stamped image; width follows aspect ratio
const DISPLAY_HEIGHT = 560;
// cursor must move this many px from last stamp before a new one fires
const STAMP_DISTANCE = 75;
// max random horizontal offset of stamp center from cursor
const SCATTER_X = 55;
// max random vertical offset of stamp center from cursor
const SCATTER_Y = 95;

const PHOTOS = [
  { src: "https://picsum.photos/seed/aes01/900/1200",  ar: 0.75 },
  { src: "https://picsum.photos/seed/aes02/1200/800",  ar: 1.50 },
  { src: "https://picsum.photos/seed/aes03/900/1300",  ar: 0.69 },
  { src: "https://picsum.photos/seed/aes04/1200/900",  ar: 1.33 },
  { src: "https://picsum.photos/seed/aes05/800/1200",  ar: 0.66 },
  { src: "https://picsum.photos/seed/aes06/1100/1400", ar: 0.78 },
  { src: "https://picsum.photos/seed/aes07/1300/900",  ar: 1.44 },
  { src: "https://picsum.photos/seed/aes08/900/1200",  ar: 0.75 },
  { src: "https://picsum.photos/seed/aes09/1200/800",  ar: 1.50 },
  { src: "https://picsum.photos/seed/aes10/1000/1400", ar: 0.71 },
  { src: "https://picsum.photos/seed/aes11/1300/900",  ar: 1.44 },
  { src: "https://picsum.photos/seed/aes12/900/1300",  ar: 0.69 },
  { src: "https://picsum.photos/seed/aes13/1200/900",  ar: 1.33 },
  { src: "https://picsum.photos/seed/aes14/800/1100",  ar: 0.72 },
  { src: "https://picsum.photos/seed/aes15/1100/1500", ar: 0.73 },
  { src: "https://picsum.photos/seed/aes16/1300/900",  ar: 1.44 },
  { src: "https://picsum.photos/seed/aes17/900/1200",  ar: 0.75 },
  { src: "https://picsum.photos/seed/aes18/1200/800",  ar: 1.50 },
];

type Stamp = {
  id: number;
  x: number;
  y: number;
  w: number;
  h: number;
  photo: (typeof PHOTOS)[0];
};

export default function WorkGallery() {
  const containerRef = useRef<HTMLDivElement>(null);

  const lastStampPos = useRef<{ x: number; y: number }>({ x: -9999, y: -9999 });
  const nextStampId = useRef<number>(0);
  const photoIndex = useRef<number>(0);
  const thresholdRef = useRef<number>(40);

  const [isActive, setIsActive] = useState(false);
  const [stamps, setStamps] = useState<Stamp[]>([]);
  const [threshold, setThreshold] = useState(40);
  const [totalStamped, setTotalStamped] = useState(0);
  const [selectedStampId, setSelectedStampId] = useState<number | null>(null);

  // Keep thresholdRef in sync with threshold state
  useEffect(() => {
    thresholdRef.current = threshold;
    setStamps((s) => s.slice(-threshold));
  }, [threshold]);

  // Clear zoom when the selected stamp gets culled from the visible array
  useEffect(() => {
    if (selectedStampId !== null && !stamps.find((s) => s.id === selectedStampId)) {
      setSelectedStampId(null);
    }
  }, [stamps, selectedStampId]);

  // Clear zoom when leaving the work section
  useEffect(() => {
    if (!isActive) setSelectedStampId(null);
  }, [isActive]);

  // MutationObserver to detect is-active class from SectionDeck
  useEffect(() => {
    const section = containerRef.current?.closest("[data-snap]") as HTMLElement | null;
    if (!section) return;
    const check = () => setIsActive(section.classList.contains("is-active"));
    check();
    const obs = new MutationObserver(check);
    obs.observe(section, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  // Attach/detach mousemove listener based on isActive
  useEffect(() => {
    if (!isActive) return;

    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - lastStampPos.current.x;
      const dy = e.clientY - lastStampPos.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < STAMP_DISTANCE) return;

      lastStampPos.current = { x: e.clientX, y: e.clientY };

      const photo = PHOTOS[photoIndex.current % PHOTOS.length];
      photoIndex.current += 1;

      const h = DISPLAY_HEIGHT;
      const w = h * photo.ar;

      const offsetX = (Math.random() * 2 - 1) * SCATTER_X;
      const offsetY = (Math.random() * 2 - 1) * SCATTER_Y;

      const x = e.clientX + offsetX;
      const y = e.clientY + offsetY;

      const id = nextStampId.current++;

      setStamps((prev) => {
        const next = [...prev, { id, x, y, w, h, photo }];
        return next.length > thresholdRef.current ? next.slice(-thresholdRef.current) : next;
      });
      setTotalStamped((t) => t + 1);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isActive]);

  return (
    <LayoutGroup>
      {/* Root container — just a div for the MutationObserver ref */}
      <div ref={containerRef} />

      {/* Fixed stamp layer — white bg, covers viewport, hidden when not active */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          overflow: "hidden",
          background: "#ffffff",
          opacity: isActive ? 1 : 0,
          pointerEvents: isActive ? "auto" : "none",
          transition: "opacity 0.4s ease",
          cursor: selectedStampId !== null ? "zoom-out" : "none",
          zIndex: 30,
        }}
      >
        <AnimatePresence>
          {stamps.map((stamp) => (
            <motion.div
              key={stamp.id}
              layoutId={`stamp-${stamp.id}`}
              style={{
                position: "absolute",
                left: stamp.x - stamp.w / 2,
                top: stamp.y - stamp.h / 2,
                width: stamp.w,
                height: stamp.h,
                visibility: selectedStampId === stamp.id ? "hidden" : "visible",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.6 } }}
              transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
              onClick={() => setSelectedStampId(stamp.id)}
            >
              <img
                src={stamp.photo.src}
                alt=""
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  pointerEvents: "none",
                  userSelect: "none",
                }}
                draggable={false}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Idle state — shown only when no stamps yet */}
        {stamps.length === 0 && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
            }}
          >
            <span
              style={{
                fontSize: 12,
                letterSpacing: "0.15em",
                color: "#bbb",
                textTransform: "uppercase",
              }}
            >
              Move your cursor
            </span>
          </div>
        )}
      </div>

      {/* Zoom overlay */}
      <AnimatePresence>
        {selectedStampId !== null &&
          (() => {
            const stamp = stamps.find((s) => s.id === selectedStampId);
            if (!stamp) return null;
            return (
              <motion.div
                style={{
                  position: "fixed",
                  inset: 0,
                  background: "rgba(255,255,255,0.96)",
                  zIndex: 100,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedStampId(null)}
              >
                <motion.div
                  layoutId={`stamp-${selectedStampId}`}
                  style={{
                    width: "min(85vw, 1100px)",
                    height: "min(88vh, 1300px)",
                  }}
                  transition={{ type: "spring", stiffness: 220, damping: 28 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <img
                    src={stamp.photo.src}
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      display: "block",
                      pointerEvents: "none",
                      userSelect: "none",
                    }}
                    draggable={false}
                  />
                </motion.div>
              </motion.div>
            );
          })()}
      </AnimatePresence>

      {/* Bottom chrome bar — Riss's branding */}
      {isActive && (
        <div
          style={{
            position: "fixed",
            bottom: 16,
            left: 22,
            right: 22,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 13,
            color: "#111",
            zIndex: 45,
            pointerEvents: "auto",
            fontFamily: "Satoshi, ui-sans-serif, system-ui, sans-serif",
          }}
        >
          {/* Left: brand name */}
          <span style={{ fontWeight: 400, letterSpacing: "-0.01em" }}>Riss Creative</span>

          {/* Center-left: gallery nav */}
          <nav style={{ display: "flex", gap: 20 }}>
            {["Direction", "Styling", "Image", "Events"].map((label, i) => (
              <span
                key={label}
                style={{
                  color: i === 0 ? "#111" : "#999",
                  textDecoration: i === 0 ? "underline" : "none",
                  textUnderlineOffset: 3,
                  cursor: "default",
                  letterSpacing: "0.01em",
                }}
              >
                {label}
              </span>
            ))}
          </nav>

          {/* Center-right: threshold control */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            <span style={{ color: "#999" }}>Threshold:</span>
            <button
              onClick={() => {
                const t = Math.max(2, threshold - 1);
                setThreshold(t);
                thresholdRef.current = t;
                setStamps((s) => s.slice(-t));
              }}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: 13,
                color: "#111",
                padding: "0 4px",
              }}
            >
              −
            </button>
            <span
              style={{
                fontVariantNumeric: "tabular-nums",
                minWidth: "4ch",
                textAlign: "center",
              }}
            >
              {String(threshold).padStart(4, "0")}
            </span>
            <button
              onClick={() => {
                const t = Math.min(140, threshold + 1);
                setThreshold(t);
                thresholdRef.current = t;
              }}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: 13,
                color: "#111",
                padding: "0 4px",
              }}
            >
              +
            </button>
          </div>

          {/* Right: stamp counter */}
          <span style={{ fontVariantNumeric: "tabular-nums", color: "#999" }}>
            {String(totalStamped).padStart(4, "0")} / {String(PHOTOS.length).padStart(4, "0")}
          </span>
        </div>
      )}
    </LayoutGroup>
  );
}
