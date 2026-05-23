import type { LinkItem } from "@/content/links";

export default function LinkRow({ item }: { item: LinkItem }) {
  return (
    <a
      href={item.href}
      className="group flex items-center justify-between gap-6 py-6 border-b border-border last:border-b-0 transition-opacity duration-300 hover:opacity-60"
    >
      <span className="font-sans font-normal text-[13px] uppercase tracking-[0.2em] text-foreground">
        {item.platform}
      </span>
      <span
        className={`font-sans font-light text-[14px] text-muted ${
          item.comingSoon ? "opacity-60" : ""
        }`}
      >
        {item.handle}
      </span>
    </a>
  );
}
