import { homeCopy } from "@/content/copy";

export default function HomePage() {
  return (
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
      </div>
    </section>
  );
}
