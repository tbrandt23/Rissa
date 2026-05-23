import CapabilitySection from "@/components/CapabilitySection";
import { capabilities } from "@/content/capabilities";
import { creativeCopy } from "@/content/copy";

export const metadata = { title: "Creative · Riss Creative" };

export default function CreativePage() {
  return (
    <section className="px-6 md:px-12 lg:px-20 pt-32 md:pt-40 pb-24">
      <div className="mx-auto w-full max-w-6xl">
        <div className="text-[11px] uppercase tracking-[0.25em] text-muted mb-8">
          {creativeCopy.caption}
        </div>
        <h1 className="font-display font-extralight text-[44px] md:text-[72px] tracking-[-0.03em] leading-[1] mb-8">
          {creativeCopy.title}
        </h1>
        <p className="font-sans font-light text-[15px] md:text-[17px] leading-[1.55] text-muted max-w-[560px] mb-20 md:mb-28">
          {creativeCopy.intro}
        </p>

        <div>
          {capabilities.map((cap, i) => (
            <CapabilitySection key={cap.number} cap={cap} priority={i === 0} />
          ))}
        </div>

        <div className="mt-24 md:mt-32 py-16 text-center">
          <p className="font-sans font-light text-[14px] md:text-[15px] text-muted">
            For portfolio inquiries —{" "}
            <a
              href={`mailto:${creativeCopy.contactEmail}`}
              className="text-foreground transition-opacity duration-300 hover:opacity-60"
            >
              {creativeCopy.contactEmail}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
