"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

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

// Slide animation variants for gallery navigation
const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (dir: number) => ({
    x: dir < 0 ? "100%" : "-100%",
    opacity: 0,
  }),
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
  const [isMobile, setIsMobile] = useState(false);

  // Gallery lightbox state
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [galleryDir, setGalleryDir] = useState(0); // 1 = next, -1 = prev

  const touchStartX = useRef(0);

  // Mobile detection via pointer media query
  useEffect(() => {
    const mq = window.matchMedia("(hover: none) and (pointer: coarse)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Keep thresholdRef in sync with threshold state
  useEffect(() => {
    thresholdRef.current = threshold;
    setStamps((s) => s.slice(-threshold));
  }, [threshold]);

  // Clear gallery when leaving the work section
  useEffect(() => {
    if (!isActive) setGalleryOpen(false);
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

  // Touch-to-stamp handler (mobile only)
  useEffect(() => {
    if (!isActive || !isMobile) return;

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      const dx = touch.clientX - lastStampPos.current.x;
      const dy = touch.clientY - lastStampPos.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < STAMP_DISTANCE) return;

      lastStampPos.current = { x: touch.clientX, y: touch.clientY };

      const photo = PHOTOS[photoIndex.current % PHOTOS.length];
      photoIndex.current += 1;

      const h = DISPLAY_HEIGHT * 0.45; // smaller on mobile
      const w = h * photo.ar;

      // No scatter offset on touch — stamp directly at finger position
      const x = touch.clientX;
      const y = touch.clientY;

      const id = nextStampId.current++;

      setStamps((prev) => {
        const next = [...prev, { id, x, y, w, h, photo }];
        return next.length > thresholdRef.current ? next.slice(-thresholdRef.current) : next;
      });
      setTotalStamped((t) => t + 1);
    };

    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    return () => window.removeEventListener("touchmove", handleTouchMove);
  }, [isActive, isMobile]);

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

  // Keyboard navigation for gallery
  useEffect(() => {
    if (!galleryOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") navigate(1);
      else if (e.key === "ArrowLeft") navigate(-1);
      else if (e.key === "Escape") setGalleryOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [galleryOpen, galleryIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  const navigate = (dir: number) => {
    setGalleryDir(dir);
    setGalleryIndex((i) => (i + dir + PHOTOS.length) % PHOTOS.length);
  };

  const openGallery = (photo: (typeof PHOTOS)[0]) => {
    const idx = PHOTOS.findIndex((p) => p.src === photo.src);
    setGalleryDir(0);
    setGalleryIndex(idx >= 0 ? idx : 0);
    setGalleryOpen(true);
  };

  return (
    <>
      {/* Root container — anchor for MutationObserver */}
      <div ref={containerRef} />

      {/* Fixed stamp layer — dark bg, covers viewport, hidden when not active */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          overflow: "hidden",
          background: "#0A0A0A",
          opacity: isActive ? 1 : 0,
          pointerEvents: isActive ? "auto" : "none",
          transition: "opacity 0.4s ease",
          zIndex: 30,
        }}
      >
        <AnimatePresence>
          {stamps.map((stamp) => (
            <motion.div
              key={stamp.id}
              style={{
                position: "absolute",
                left: stamp.x - stamp.w / 2,
                top: stamp.y - stamp.h / 2,
                width: stamp.w,
                height: stamp.h,
                cursor: "pointer",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.6 } }}
              transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
              onDoubleClick={() => openGallery(stamp.photo)}
              onClick={isMobile ? () => openGallery(stamp.photo) : undefined}
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

        {/* Section title — sits behind stamps, gets buried as cursor moves */}
        <div
          style={{
            position: "absolute",
            top: 88,
            left: 40,
            pointerEvents: "none",
            zIndex: 0,
          }}
        >
          <p
            style={{
              fontSize: 11,
              letterSpacing: "0.28em",
              color: "rgba(237,234,227,0.4)",
              textTransform: "uppercase",
              marginBottom: 10,
              fontFamily: "Satoshi, ui-sans-serif, system-ui, sans-serif",
            }}
          >
            Selected Work
          </p>
          <h2
            style={{
              fontFamily: "'Cabinet Grotesk', ui-sans-serif, system-ui, sans-serif",
              fontWeight: 200,
              fontSize: "clamp(52px, 8vw, 110px)",
              lineHeight: 0.92,
              letterSpacing: "-0.03em",
              color: "rgba(237,234,227,0.18)",
              margin: 0,
            }}
          >
            Creative
            <br />
            Gallery
          </h2>
          <p
            style={{
              marginTop: 20,
              fontSize: 11,
              letterSpacing: "0.2em",
              color: "rgba(237,234,227,0.3)",
              textTransform: "uppercase",
              fontFamily: "Satoshi, ui-sans-serif, system-ui, sans-serif",
            }}
          >
            {isMobile ? "Drag to stamp · Tap to open" : "Move mouse to explore · Double-click to open"}
          </p>
        </div>
      </div>

      {/* Gallery lightbox — opens on double-click */}
      <AnimatePresence>
        {galleryOpen && (
          <motion.div
            key="gallery-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(10,10,10,0.97)",
              zIndex: 100,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
            onClick={() => setGalleryOpen(false)}
            onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
            onTouchEnd={(e) => {
              const dx = touchStartX.current - e.changedTouches[0].clientX;
              if (Math.abs(dx) > 50) navigate(dx > 0 ? 1 : -1);
            }}
          >
            {/* Sliding image */}
            <AnimatePresence custom={galleryDir} mode="popLayout">
              <motion.div
                key={galleryIndex}
                custom={galleryDir}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 300, damping: 35, mass: 0.8 }}
                style={{
                  position: "absolute",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  height: "100%",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={PHOTOS[galleryIndex].src}
                  alt=""
                  style={{
                    maxWidth: "min(85vw, 1100px)",
                    maxHeight: "min(88vh, 1300px)",
                    objectFit: "contain",
                    display: "block",
                    pointerEvents: "none",
                    userSelect: "none",
                  }}
                  draggable={false}
                />
              </motion.div>
            </AnimatePresence>

            {/* Prev arrow */}
            <button
              onClick={(e) => { e.stopPropagation(); navigate(-1); }}
              style={{
                position: "absolute",
                left: 24,
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: "#EDEAE3",
                fontSize: 28,
                cursor: "pointer",
                padding: "12px 16px",
                opacity: 0.6,
                zIndex: 10,
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.6")}
              aria-label="Previous"
            >
              ←
            </button>

            {/* Next arrow */}
            <button
              onClick={(e) => { e.stopPropagation(); navigate(1); }}
              style={{
                position: "absolute",
                right: 24,
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: "#EDEAE3",
                fontSize: 28,
                cursor: "pointer",
                padding: "12px 16px",
                opacity: 0.6,
                zIndex: 10,
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.6")}
              aria-label="Next"
            >
              →
            </button>

            {/* Close button */}
            <button
              onClick={() => setGalleryOpen(false)}
              style={{
                position: "absolute",
                top: 20,
                right: 24,
                background: "none",
                border: "none",
                color: "#EDEAE3",
                fontSize: 20,
                cursor: "pointer",
                padding: "8px 12px",
                opacity: 0.5,
                zIndex: 10,
                letterSpacing: "0.1em",
                fontFamily: "Satoshi, ui-sans-serif, system-ui, sans-serif",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.5")}
              aria-label="Close gallery"
            >
              ✕
            </button>

            {/* Image counter */}
            <div
              style={{
                position: "absolute",
                bottom: 24,
                left: "50%",
                transform: "translateX(-50%)",
                color: "#6B6862",
                fontSize: 11,
                letterSpacing: "0.2em",
                fontVariantNumeric: "tabular-nums",
                fontFamily: "Satoshi, ui-sans-serif, system-ui, sans-serif",
                zIndex: 10,
                pointerEvents: "none",
              }}
            >
              {String(galleryIndex + 1).padStart(2, "0")} / {String(PHOTOS.length).padStart(2, "0")}
            </div>
          </motion.div>
        )}
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
            color: "#EDEAE3",
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
                  color: i === 0 ? "#EDEAE3" : "#6B6862",
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

          {/* Center-right: threshold control (desktop only) */}
          {!isMobile && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              <span style={{ color: "#6B6862" }}>Threshold:</span>
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
                  color: "#EDEAE3",
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
                  color: "#EDEAE3",
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
                  color: "#EDEAE3",
                  padding: "0 4px",
                }}
              >
                +
              </button>
            </div>
          )}

          {/* Right: session stamp counter */}
          <span style={{ fontVariantNumeric: "tabular-nums", color: "#6B6862" }}>
            {String(totalStamped).padStart(4, "0")} / {String(PHOTOS.length).padStart(4, "0")}
          </span>
        </div>
      )}
    </>
  );
}
