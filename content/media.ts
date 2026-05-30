// Media placeholders. Swap these for Riss's real footage in Phase 2.
//
// HERO VIDEO ROTATION
// ───────────────────
// Hero rotates through these clips with a crossfade. Each entry is a URL or
// a local public-folder path. The four slots map to the requested loop:
//   1. hand DJing / decks
//   2. dim studio
//   3. model with flash photography
//   4. someone working on a computer / creative process
//
// HOW TO SWAP IN REAL FILES (recommended for reliability):
//   1. Drop .mp4 files into  public/videos/  named  hero-1.mp4 ... hero-4.mp4
//   2. They'll take precedence automatically — nothing else to do.
//
// HOW TO SWAP IN URLS:
//   Replace any string in this array with a verified-working .mp4 URL.
//   Any URL that 404s is silently skipped by HeroVideo.tsx — the surviving
//   sources keep rotating, and if ALL fail the CSS hero-ambient animation
//   still gives the hero atmosphere.
export const heroVideos = [
  "/videos/hero-1.mp4", // hand DJing — drop file at public/videos/hero-1.mp4
  "/videos/hero-2.mp4", // dim studio
  "/videos/hero-3.mp4", // flash photoshoot
  "/videos/hero-4.mp4", // person on computer / process
];

export const media = {
  heroVideo: heroVideos[0],
  latestMixSrc: "/audio/sample.mp3", // drop the real mix at public/audio/sample.mp3
};
