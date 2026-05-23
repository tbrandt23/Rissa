"use client";

import { useState } from "react";
import { FormInput, FormTextarea } from "@/components/FormField";
import Dropzone from "@/components/Dropzone";
import { submitCopy } from "@/content/copy";

export default function SubmitPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className="px-6 md:px-12 lg:px-20 pt-32 md:pt-40 pb-24">
      <div className="mx-auto w-full max-w-2xl">
        <div className="text-[11px] uppercase tracking-[0.25em] text-muted mb-8">
          {submitCopy.caption}
        </div>
        <h1 className="font-display font-extralight text-[40px] md:text-[64px] tracking-[-0.03em] leading-[1] mb-8">
          {submitCopy.title}
        </h1>
        <p className="font-sans font-light text-[15px] md:text-[17px] leading-[1.55] text-muted max-w-[520px] mb-16 md:mb-20">
          {submitCopy.intro}
        </p>

        {submitted ? (
          <div className="border border-border px-6 py-16 text-center">
            <div className="font-display font-light text-[20px] md:text-[24px] mb-3">
              Submission received.
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
            className="space-y-8"
          >
            <Dropzone />
            <div className="pt-4">
              <FormInput type="text" placeholder="Artist name" required />
            </div>
            <FormInput type="email" placeholder="Email" required />
            <FormTextarea placeholder="Brief description" />
            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="font-sans text-[13px] font-normal uppercase tracking-[0.2em] text-foreground inline-flex items-center gap-2 transition-opacity duration-300 hover:opacity-60"
              >
                Submit <span aria-hidden>→</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
