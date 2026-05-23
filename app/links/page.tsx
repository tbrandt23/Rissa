import LinkRow from "@/components/LinkRow";
import { links } from "@/content/links";
import { linksCopy } from "@/content/copy";

export const metadata = { title: "Links · Riss Creative" };

export default function LinksPage() {
  return (
    <section className="px-6 md:px-12 lg:px-20 pt-32 md:pt-40 pb-24">
      <div className="mx-auto w-full max-w-md">
        <div className="text-[11px] uppercase tracking-[0.25em] text-muted mb-8">
          {linksCopy.caption}
        </div>
        <h1 className="font-display font-extralight text-[40px] md:text-[56px] tracking-[-0.03em] leading-none mb-12 md:mb-16">
          {linksCopy.title}
        </h1>
        <div>
          {links.map((item) => (
            <LinkRow key={item.platform} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
