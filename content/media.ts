// Media placeholders. Swap these for Riss's real footage in Phase 2.

// Hero rotates through these clips with a crossfade. Each is meant to evoke
// a different facet of the work: editorial portrait, hands at work, dim
// studio detail, fabric/texture. If any URL 404s, HeroVideo skips it
// silently and rotates the survivors. Swap any line for her real .mp4s.
export const heroVideos = [
  // editorial / fashion-forward portrait energy
  "https://videos.pexels.com/video-files/3209828/3209828-uhd_2560_1440_25fps.mp4",
  // hands / process — behind the scenes
  "https://videos.pexels.com/video-files/5532770/5532770-hd_1920_1080_24fps.mp4",
  // dim studio / lighting detail
  "https://videos.pexels.com/video-files/4434242/4434242-hd_1920_1080_24fps.mp4",
  // fabric / texture / styling
  "https://videos.pexels.com/video-files/3214027/3214027-uhd_2560_1440_25fps.mp4",
];

export const media = {
  // Kept for backwards-compat references
  heroVideo: heroVideos[0],
  // Placeholder mix preview. Replace with a real Riss track when available.
  latestMixSrc: "/audio/sample.mp3",
};
