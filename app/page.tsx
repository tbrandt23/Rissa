import Link from "next/link";
import CapabilitySection from "@/components/CapabilitySection";
import FadeIn from "@/components/FadeIn";
import { capabilities } from "@/content/capabilities";
import { homeCopy, creativeCopy } from "@/content/copy";

export default function HomePage() {
  return (
    <>
      {/* HERO — magazine cover, off-center */}
      <section className="relative min-h-screen w-full px-6 md:px-12 lg:px-20 pt-24 md:pt-32 pb-24">
        <div className="absolute top-20 md:top-24 right-6 md:right-12 lg:right-20 text-right font-sans text-[10px] md:text-[11px] tracking-[0.15em] text-muted max-w-[60%] md:max-w-none">
          {homeCopy.metaTopRight}
        </div>

        <div className="absolute bottom-[10vh] left-6 right-6 md:left-12 md:right-12 lg:left-20 lg:right-20">
          <h1 className="font-display font-extralight text-[clamp(56px,12vw,140px)] leading-[0.9] tracking-[-0.04em] text-foreground mb-4 md:mb-5">
            {homeCopy.wordmark}
          </h1>
          <p className="font-sans font-light text-[clamp(15px,2vw,19px)] text-foreground-cool max-w-[520px]">
            {homeCopy.descriptorPrefix}
            <span className="accent-italic" style={{ fontSize: "1.05em" }}>
              {homeCopy.descriptorAccent}
            </span>
          </p>
          <Link
            href="/submit"
            className="mt-8 md:mt-10 inline-flex items-center gap-2 text-[10px] md:text-[11px] uppercase tracking-[0.25em] text-muted transition-colors duration-300 hover:text-foreground"
          >
            now accepting loop submissions <span aria-hidden>→</span>
          </Link>
        </div>

        {/* scroll prompt — stitches into the work below */}
        <Link
          href="#work"
          scroll={true}
          className="absolute bottom-6 right-6 md:right-12 lg:right-20 text-[10px] uppercase tracking-[0.3em] text-muted transition-opacity duration-300 hover:opacity-60"
        >
          ↓ work
        </Link>
      </section>

      {/* WORK — same content as /creative, scrolled into seamlessly */}
      <section
        id="work"
        className="px-6 md:px-12 lg:px-20 pt-24 md:pt-32 pb-24 scroll-mt-16"
      >
        <div className="mx-auto w-full max-w-6xl">
          <FadeIn>
            <div className="text-[11px] uppercase tracking-[0.25em] text-muted mb-8">
              {creativeCopy.caption}
            </div>
            <h2 className="font-display font-extralight text-[44px] md:text-[72px] tracking-[-0.03em] leading-[1] mb-8">
              {creativeCopy.title}
            </h2>
            <p className="font-sans font-light text-[15px] md:text-[17px] leading-[1.55] text-muted max-w-[560px] mb-20 md:mb-28">
              {creativeCopy.intro}
            </p>
          </FadeIn>

          <div>
            {capabilities.map((cap) => (
              <FadeIn key={cap.number}>
                <CapabilitySection cap={cap} />
              </FadeIn>
            ))}
          </div>

          <FadeIn>
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
          </FadeIn>
        </div>
      </section>
    </>
  );
}
