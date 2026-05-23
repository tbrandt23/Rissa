export type LinkItem = {
  platform: string;
  handle: string;
  href: string;
  comingSoon?: boolean;
};

export const links: LinkItem[] = [
  { platform: "Soundcloud", handle: "DJ sets & mixes", href: "#" },
  { platform: "Instagram", handle: "@riss", href: "#" },
  { platform: "YouTube", handle: "Coming soon", href: "#", comingSoon: true },
  { platform: "TikTok", handle: "@riss", href: "#" },
];
