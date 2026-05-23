import Image from "next/image";
import type { Capability } from "@/content/capabilities";

const ratioClass = (r: Capability["ratio"]) =>
  r === "video"
    ? "aspect-video"
    : r === "4/5"
    ? "aspect-[4/5]"
    : r === "3/4"
    ? "aspect-[3/4]"
    : "aspect-square";

function Frame({
  src,
  alt,
  ratio,
  label,
  number,
  priority,
}: {
  src: string;
  alt: string;
  ratio: Capability["ratio"];
  label?: string;
  number?: string;
  priority?: boolean;
}) {
  return (
    <div className={`relative w-full overflow-hidden border border-border-soft ${ratioClass(ratio)}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 60vw, 100vw"
        className="object-cover"
        priority={priority}
      />
      {label && (
        <div className="absolute bottom-5 left-5 md:bottom-6 md:left-6 text-[10px] uppercase tracking-[0.25em] text-muted">
          Section {number}
          <span className="block font-display font-light text-[16px] md:text-[18px] tracking-[-0.01em] normal-case text-foreground mt-2">
            {label}
          </span>
        </div>
      )}
    </div>
  );
}

export default function CapabilitySection({ cap, priority = false }: { cap: Capability; priority?: boolean }) {
  if (cap.variant === "full") {
    return (
      <section className="mb-20 md:mb-28">
        <Frame
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
        <Frame
          src={cap.image}
          alt={`${cap.title} A`}
          ratio={cap.ratio}
          label={cap.title}
          number={`${cap.number}a`}
        />
        {cap.imageB && (
          <Frame
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
        <Frame src={cap.image} alt={cap.title} ratio={cap.ratio} number={cap.number} label={cap.title} />
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
