"use client";

import { useState } from "react";
import Link from "next/link";
import WorkGallery from "@/components/WorkGallery";
import SectionDeck from "@/components/SectionDeck";
import LinkRow from "@/components/LinkRow";
import Dropzone from "@/components/Dropzone";
import { FormInput, FormTextarea } from "@/components/FormField";
import LiveStatus from "@/components/LiveStatus";
import HeroVideo from "@/components/HeroVideo";
import AudioPlayer from "@/components/AudioPlayer";
import { capabilities } from "@/content/capabilities";
import { links } from "@/content/links";
import {
  homeCopy,
  creativeCopy,
  submitCopy,
  linksCopy,
  listenCopy,
} from "@/content/copy";
import { media } from "@/content/media";

const ctas = [
  { href: "#links", num: "01", label: "Links" },
  { href: "#listen", num: "02", label: "Listen" },
  { href: "#submit", num: "03", label: "Send loops" },
  { href: "#work", num: "04", label: "Work" },
];

type Intent = "loops" | "book";

export default function HomePage() {
  const [submitted, setSubmitted] = useState(false);
  const [intent, setIntent] = useState<Intent>("loops");

  return (
    <>
      <SectionDeck />

      {/* HERO */}
      <section
        data-snap
        className="relative min-h-screen w-full px-6 md:px-12 lg:px-20 pt-24 md:pt-32 pb-24 overflow-hidden"
      >
        {/* moody video background */}
        <HeroVideo src={media.heroVideo} />
        {/* darken video for legibility */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(10,10,10,0.65) 0%, rgba(10,10,10,0.55) 50%, rgba(10,10,10,0.85) 100%)",
          }}
        />
        {/* warm depth glow over the video */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            background:
              "radial-gradient(60% 40% at 28% 78%, rgba(237,234,227,0.04) 0%, transparent 60%)",
          }}
        />
        <div
          className="rise absolute top-20 md:top-24 right-6 md:right-12 lg:right-20 text-right font-sans text-[10px] md:text-[11px] tracking-[0.15em] text-muted max-w-[60%] md:max-w-none z-10"
          style={{ transitionDelay: "360ms" }}
        >
          <LiveStatus />
        </div>

        <div className="absolute bottom-[10vh] left-6 right-6 md:left-12 md:right-12 lg:left-20 lg:right-20 z-10">
          <h1
            className="rise font-display font-extralight text-[clamp(56px,12vw,140px)] leading-[0.9] tracking-[-0.04em] text-foreground mb-4 md:mb-5"
            style={{ transitionDelay: "0ms" }}
          >
            {homeCopy.wordmark}
          </h1>
          <p
            className="rise font-sans font-light text-[clamp(15px,2vw,19px)] text-foreground-cool max-w-[520px]"
            style={{ transitionDelay: "140ms" }}
          >
            {homeCopy.descriptorPrefix}
            <span className="accent-italic" style={{ fontSize: "1.05em" }}>
              {homeCopy.descriptorAccent}
            </span>
          </p>
          <div
            className="rise mt-8 md:mt-12 flex flex-wrap gap-5 md:gap-8"
            style={{ transitionDelay: "280ms" }}
          >
            {ctas.map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className="group inline-flex items-baseline gap-3 text-foreground transition-opacity duration-300 hover:opacity-60"
              >
                <span className="text-[10px] uppercase tracking-[0.3em] text-muted group-hover:text-foreground transition-colors duration-300">
                  {c.num}
                </span>
                <span className="font-display font-light text-[18px] md:text-[22px] tracking-[-0.01em]">
                  {c.label}
                </span>
                <span aria-hidden className="text-muted group-hover:text-foreground transition-colors duration-300">
                  ↓
                </span>
              </Link>
            ))}
          </div>
        </div>

        <Link
          href="#links"
          className="rise absolute bottom-6 right-6 md:right-12 lg:right-20 text-[10px] uppercase tracking-[0.3em] text-muted transition-opacity duration-300 hover:opacity-60 z-10"
          style={{ transitionDelay: "520ms" }}
        >
          ↓ scroll
        </Link>
      </section>

      {/* LINKS */}
      <section
        id="links"
        data-snap
        className="min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-20 py-24 border-t border-border"
      >
        <div className="mx-auto w-full max-w-md">
          <div className="rise" style={{ transitionDelay: "0ms" }}>
            <div className="text-[11px] uppercase tracking-[0.25em] text-muted mb-8">
              {linksCopy.caption}
            </div>
            <h2 className="font-display font-extralight text-[40px] md:text-[56px] tracking-[-0.03em] leading-none mb-12 md:mb-16">
              {linksCopy.title}
            </h2>
          </div>
          <div>
            {links.map((item, i) => (
              <div
                key={item.platform}
                className="rise"
                style={{ transitionDelay: `${220 + i * 130}ms` }}
              >
                <LinkRow item={item} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LISTEN — latest mix */}
      <section
        id="listen"
        data-snap
        className="min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-20 py-20 border-t border-border"
      >
        <div className="mx-auto w-full max-w-2xl">
          <div className="rise" style={{ transitionDelay: "0ms" }}>
            <div className="text-[11px] uppercase tracking-[0.25em] text-muted mb-4">
              {listenCopy.caption}
            </div>
            <h2 className="font-display font-extralight text-[36px] md:text-[52px] tracking-[-0.03em] leading-[1] mb-10">
              {listenCopy.title}
            </h2>
          </div>
          <div className="rise" style={{ transitionDelay: "180ms" }}>
            <AudioPlayer
              src={media.latestMixSrc}
              artist={listenCopy.trackArtist}
              title={listenCopy.trackTitle}
              fallbackDuration={listenCopy.duration}
            />
          </div>
        </div>
      </section>

      {/* SUBMIT — with intent toggle + EPK */}
      <section
        id="submit"
        data-snap
        className="min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-20 py-16 border-t border-border"
      >
        <div className="mx-auto w-full max-w-2xl">
          <div className="rise" style={{ transitionDelay: "0ms" }}>
            <div className="text-[11px] uppercase tracking-[0.25em] text-muted mb-4">
              {submitCopy.caption}
            </div>
            <h2 className="font-display font-extralight text-[32px] md:text-[44px] tracking-[-0.03em] leading-[1] mb-4">
              {intent === "loops" ? submitCopy.title : submitCopy.bookingTitle}
            </h2>
            <p className="font-sans font-light text-[14px] md:text-[15px] leading-[1.5] text-muted max-w-[520px] mb-5">
              {intent === "loops" ? submitCopy.intro : submitCopy.bookingIntro}
            </p>
            <div className="inline-flex border border-border mb-7">
              {(["loops", "book"] as Intent[]).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setIntent(k)}
                  className={`px-4 py-2 text-[11px] uppercase tracking-[0.25em] transition-colors duration-300 ${
                    intent === k
                      ? "bg-foreground text-background"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  {k === "loops" ? "Send loops" : "Book me"}
                </button>
              ))}
            </div>
          </div>

          <div className="rise" style={{ transitionDelay: "160ms" }}>
            {submitted ? (
              <div className="border border-border px-6 py-10 text-center">
                <div className="font-display font-light text-[20px] md:text-[22px] mb-2">
                  {intent === "loops"
                    ? "Submission received."
                    : "Inquiry received."}
                </div>
                <div className="text-[11px] uppercase tracking-[0.2em] text-muted">
                  Thank you — I&apos;ll be in touch
                </div>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitted(true);
                }}
                className="space-y-4"
              >
                {intent === "loops" ? (
                  <>
                    <Dropzone />
                    <FormInput type="text" placeholder="Artist name" required />
                    <FormInput type="email" placeholder="Email" required />
                    <FormTextarea placeholder="Brief description" rows={2} />
                  </>
                ) : (
                  <>
                    <FormInput type="text" placeholder="Your name" required />
                    <FormInput type="email" placeholder="Email" required />
                    <FormInput type="text" placeholder="Project / event" required />
                    <FormTextarea placeholder="Dates, budget, scope" rows={3} />
                  </>
                )}
                <div className="flex items-center justify-between pt-1">
                  <a
                    href={submitCopy.epkHref}
                    className="text-[11px] uppercase tracking-[0.25em] text-muted transition-colors duration-300 hover:text-foreground link-underline"
                  >
                    {submitCopy.epkLabel} →
                  </a>
                  <button
                    type="submit"
                    className="font-sans text-[13px] font-normal uppercase tracking-[0.2em] text-foreground inline-flex items-center gap-2 transition-opacity duration-300 hover:opacity-60"
                  >
                    {intent === "loops" ? "Submit" : "Send"} <span aria-hidden>→</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* WORK */}
      <section
        id="work"
        data-snap
        className="min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-20 py-14 border-t border-border"
      >
        <div className="mx-auto w-full max-w-6xl">
          <div className="flex items-end justify-between gap-8 mb-6 md:mb-8">
            <div>
              <div
                className="rise text-[11px] uppercase tracking-[0.25em] text-muted mb-2"
                style={{ transitionDelay: "0ms" }}
              >
                {creativeCopy.caption}
              </div>
              <h2
                className="rise font-display font-extralight text-[36px] md:text-[48px] tracking-[-0.03em] leading-[1]"
                style={{ transitionDelay: "120ms" }}
              >
                {creativeCopy.title}
              </h2>
            </div>
            <div
              className="rise hidden md:block text-[10px] uppercase tracking-[0.25em] text-muted text-right max-w-[260px] leading-[1.6]"
              style={{ transitionDelay: "220ms" }}
            >
              {creativeCopy.intro}
            </div>
          </div>
          <div className="rise" style={{ transitionDelay: "280ms" }}>
            <WorkGallery items={capabilities} />
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section
        data-snap
        className="min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-20 py-24 border-t border-border"
      >
        <div className="mx-auto w-full max-w-2xl text-center">
          <div className="rise" style={{ transitionDelay: "0ms" }}>
            <div className="text-[11px] uppercase tracking-[0.25em] text-muted mb-8">
              Contact
            </div>
            <p className="font-display font-extralight text-[24px] md:text-[34px] tracking-[-0.02em] leading-[1.2] text-foreground mb-6">
              For portfolio inquiries
            </p>
          </div>
          <a
            href={`mailto:${creativeCopy.contactEmail}`}
            className="rise inline-block font-sans font-light text-[18px] md:text-[22px] text-foreground link-underline"
            style={{ transitionDelay: "180ms" }}
          >
            {creativeCopy.contactEmail}
          </a>
        </div>
      </section>
    </>
  );
}
