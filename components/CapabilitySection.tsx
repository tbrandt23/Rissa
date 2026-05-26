import ImageFrame from "@/components/ImageFrame";
import type { Capability } from "@/content/capabilities";

export default function CapabilitySection({ cap, priority = false }: { cap: Capability; priority?: boolean }) {
  if (cap.variant === "full") {
    return (
      <section className="mb-20 md:mb-28">
        <ImageFrame
          src={cap.image}
          alt={cap.title}
          ratio={cap.ratio}
          label={cap.title}
          number={cap.number}
          priority={priority}
        />
      </section>
    );
  }

  if (cap.variant === "diptych") {
    return (
      <section className="mb-20 md:mb-28 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <ImageFrame
          src={cap.image}
          alt={`${cap.title} A`}
          ratio={cap.ratio}
          label={cap.title}
          number={`${cap.number}a`}
        />
        {cap.imageB && (
          <ImageFrame
            src={cap.imageB}
            alt={`${cap.title} B`}
            ratio={cap.ratio}
            label={cap.title}
            number={`${cap.number}b`}
          />
        )}
      </section>
    );
  }

  const isRight = cap.variant === "split-right";
  const cols = isRight ? "md:grid-cols-[1fr_1.4fr]" : "md:grid-cols-[1.4fr_1fr]";
  const frameOrder = isRight ? "md:order-2" : "";
  const textOrder = isRight ? "md:order-1" : "";

  return (
    <section className={`mb-20 md:mb-28 grid grid-cols-1 ${cols} gap-8 md:gap-16 items-center`}>
      <div className={frameOrder}>
        <ImageFrame src={cap.image} alt={cap.title} ratio={cap.ratio} number={cap.number} label={cap.title} />
      </div>
      <div className={textOrder}>
        <div className="text-[10px] uppercase tracking-[0.3em] text-muted mb-4">
          Section {cap.number}
        </div>
        <h3 className="font-display font-extralight text-[28px] md:text-[34px] tracking-[-0.02em] mb-4 text-foreground">
          {cap.title}
        </h3>
        <p className="font-sans font-light text-[15px] leading-[1.6] text-muted max-w-sm">
          {cap.description}
        </p>
      </div>
    </section>
  );
}
