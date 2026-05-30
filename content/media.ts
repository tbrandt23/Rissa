// Media placeholders. Swap these for Riss's real assets in Phase 2.
export const media = {
  // Editorial / moody / muted hero loop (free Pexels CDN).
  // If this 404s in production, the hero gracefully falls back to the
  // depth-glow gradient — nothing breaks visually.
  // Moody/dark editorial loop. If this URL ever 404s, HeroVideo silently
  // hides and the gradient layers behind it become the hero background.
  heroVideo:
    "https://videos.pexels.com/video-files/3163534/3163534-uhd_2560_1440_30fps.mp4",
  // Placeholder mix preview. Replace with a real Riss track when available.
  // The audio player is visual-only in v1 anyway; this src is wired up so
  // the swap is one-line later.
  latestMixSrc: "/audio/sample.mp3",
};
