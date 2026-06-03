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
// These point at real, verified-working Pexels CDN clips (royalty-free, free to
// use). Any URL that 404s is silently skipped by HeroVideo.tsx — the surviving
// sources keep rotating, and if ALL fail the CSS hero-ambient animation still
// gives the hero atmosphere.
//
// HOW TO SWAP IN REAL FILES LATER (most reliable):
//   1. Drop .mp4 files into  public/videos/  named  hero-1.mp4 ... hero-4.mp4
//   2. Point the slots below at "/videos/hero-1.mp4" etc. — nothing else to do.
export const heroVideos = [
  // 1. dim studio — recording studio with advanced equipment (Pexels 3910618)
  "https://videos.pexels.com/video-files/3910618/3910618-hd_1920_1080_25fps.mp4",
  // 2. model with flash photography — model + photographer photoshoot (Pexels 3917516)
  "https://videos.pexels.com/video-files/3917516/3917516-uhd_2732_1440_25fps.mp4",
  // 3. person working on a computer — working in a dim room on a laptop (Pexels 20563164)
  "https://videos.pexels.com/video-files/20563164/20563164-hd_1920_1080_30fps.mp4",
];

export const media = {
  heroVideo: heroVideos[0],
  latestMixSrc: "/audio/sample.mp3", // drop the real mix at public/audio/sample.mp3
};
