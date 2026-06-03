import ImageFrame from "@/components/ImageFrame";
import type { Capability } from "@/content/capabilities";

export default function CapabilitySection({ cap, priority = false }: { cap: Capability; priority?: boolean }) {
  if (cap.variant === "full") {
    return (
      <div className="rise w-full" style={{ transitionDelay: "0ms" }}>
        <ImageFrame
          src={cap.image}
          alt={cap.title}
          ratio={cap.ratio}
          label={cap.title}
          number={cap.number}
          priority={priority}
        />
      </div>
    );
  }

  if (cap.variant === "diptych") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 w-full">
        <div className="rise" style={{ transitionDelay: "0ms" }}>
          <ImageFrame
            src={cap.image}
            alt={`${cap.title} A`}
            ratio={cap.ratio}
            label={cap.title}
            number={`${cap.number}a`}
          />
        </div>
        {cap.imageB && (
          <div className="rise" style={{ transitionDelay: "180ms" }}>
            <ImageFrame
              src={cap.imageB}
              alt={`${cap.title} B`}
              ratio={cap.ratio}
              label={cap.title}
              number={`${cap.number}b`}
            />
          </div>
        )}
      </div>
    );
  }

  const isRight = cap.variant === "split-right";
  const cols = isRight ? "md:grid-cols-[1fr_1.4fr]" : "md:grid-cols-[1.4fr_1fr]";
  const frameOrder = isRight ? "md:order-2" : "";
  const textOrder = isRight ? "md:order-1" : "";

  return (
    <section className={`grid grid-cols-1 ${cols} gap-8 md:gap-16 items-center w-full`}>
      <div className={`${frameOrder} rise`} style={{ transitionDelay: "0ms" }}>
        <ImageFrame src={cap.image} alt={cap.title} ratio={cap.ratio} number={cap.number} label={cap.title} />
      </div>
      <div className={textOrder}>
        <div className="rise text-[10px] uppercase tracking-[0.3em] text-muted mb-4" style={{ transitionDelay: "180ms" }}>
          Section {cap.number}
        </div>
        <h3 className="rise font-display font-extralight text-[28px] md:text-[34px] tracking-[-0.02em] mb-4 text-foreground" style={{ transitionDelay: "280ms" }}>
          {cap.title}
        </h3>
        <p className="rise font-sans font-light text-[15px] leading-[1.6] text-muted max-w-sm" style={{ transitionDelay: "380ms" }}>
          {cap.description}
        </p>
      </div>
    </section>
  );
}
