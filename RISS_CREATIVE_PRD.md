# Riss Creative — Website Build Brief
**For Claude Code · v1 Visual Mockup**

---

## 0. CONTEXT FOR CLAUDE CODE

You are building a personal website for Riss, a creative director / DJ / stylist operating under the brand **Riss Creative**.

This is **Phase 1 — a high-fidelity visual mockup.** The goal is to nail the aesthetic, layout, typography, and overall feel. Backend integrations (file uploads, CMS, real form submission, real social links) come in Phase 2.

Treat this build as an **editorial personal site**, not a portfolio site and not a corporate site. Think: a stylist's personal page that happens to also be a links hub. Quiet, dark, image-led, deeply intentional. The taste *is* the product.

**Do not over-engineer.** Static pages, Tailwind, no database, no auth, no API routes. Placeholder text where copy isn't given. Placeholder image components where images aren't supplied.

---

## 1. STACK

- **Framework:** Next.js 14+ (App Router, TypeScript)
- **Styling:** Tailwind CSS
- **Fonts:** **Cabinet Grotesk** (display) + **Satoshi** (body) + **Fraunces** italic (accent only, used surgically). Load Cabinet + Satoshi via Fontshare CDN, Fraunces via Google Fonts:
  ```html
  <link rel="preconnect" href="https://api.fontshare.com" />
  <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@200,300,400,500,700&f[]=satoshi@300,400,500&display=swap" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@1,9..144,300&display=swap" />
  ```
  Expose via Tailwind: `fontFamily.display: ['Cabinet Grotesk', 'sans-serif']`, `fontFamily.sans: ['Satoshi', 'sans-serif']`, `fontFamily.accent: ['Fraunces', 'serif']`. Cabinet + Satoshi handle 99% of the site; Fraunces italic is the personality moment.
- **Icons:** Lucide React — use sparingly, only where essential
- **Animation (optional, low-priority):** Framer Motion for subtle fade-ins. Skip if it slows the build.
- **Deployment target:** Vercel
- **No CMS, no database, no backend in v1.** Hardcode everything.

---

## 2. DESIGN SYSTEM

### Colors
```
--background:    #0A0A0A   (near-black, slightly warm, not pure #000)
--foreground:    #EDEAE3   (warm off-white, editorial — not stark #FFF)
--muted:         #6B6862   (warm grey — for secondary text, borders)
--border:        #1F1E1B   (barely-visible border on dark bg)
--accent:        #EDEAE3   (no chromatic accents — accent IS the off-white)
```

No blues, no greens, no chromatic anything. The entire palette is black + warm off-white + one warm grey. This is non-negotiable to the aesthetic.

### Typography

- **Display (h1, h2, page titles, wordmark):** Cabinet Grotesk, weight 200–300 (extralight/light), tight letter-spacing on large headlines (`tracking-tight` or `-0.02em`)
- **Body:** Satoshi, weight 300–400
- **Labels/captions (small caps):** Satoshi, weight 400–500, uppercase, generous letter-spacing (`tracking-[0.2em]`)

### Type scale (mobile-first, scales up at md/lg breakpoints)
```
Display XL:   text-5xl md:text-7xl lg:text-8xl  (homepage name)
Display L:    text-3xl md:text-5xl              (page titles)
Display M:    text-2xl md:text-3xl              (section headers)
Body:         text-base md:text-lg              (paragraphs)
Caption:      text-xs uppercase tracking-widest (labels)
```

### Spacing
8px base scale. Be generous. Editorial = whitespace. Sections should breathe.
- Min vertical padding between sections: `py-24 md:py-32`
- Page horizontal padding: `px-6 md:px-12 lg:px-20`
- Max content width: `max-w-6xl` (wider than typical — feels more editorial)

### Cursor + interaction details
- Links: no underline by default, opacity transition on hover (`hover:opacity-60 transition-opacity duration-300`)
- No drop shadows. No gradients. No rounded corners except where structurally necessary (form inputs: `rounded-none` or `rounded-sm` max).
- No buttons styled with fills — text buttons with arrow indicators, or hairline-bordered outlines only.

### Distinctive Moves (the anti-generic layer)

These three moves are what separate this build from an AI-default site. Implement them precisely. Skipping any one of them collapses the personality.

**1. Film grain overlay (site-wide)**

Add a fixed-position SVG noise overlay across the entire site at ~3% opacity. This single move makes the site feel printed rather than rendered. Add to root layout, above the page content:

```jsx
<div
  aria-hidden="true"
  className="pointer-events-none fixed inset-0 z-[100] opacity-[0.035] mix-blend-overlay"
  style={{
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' /%3E%3C/svg%3E")`,
  }}
/>
```

Test it on mobile — if it's too noticeable on smaller screens, drop opacity to 0.025.

**2. Off-center homepage composition**

The homepage does NOT center the wordmark. Instead:
- Wordmark "Riss Creative" anchored to the **lower-left** of the viewport, with generous padding from the bottom edge (~10vh from bottom, left-aligned to page padding)
- Descriptor line directly below the wordmark
- A small metadata block in the **upper-right** of the viewport: `riss creative / los angeles / est. 2024` — all lowercase, small caption text, muted color, slashes as separators (no commas)
- No "↓ Enter" scroll prompt — let the user discover the nav
- Composition rule: think *magazine cover*, not *landing page*. The asymmetry is the point.

On mobile, stack: metadata top, wordmark + descriptor bottom-left. Don't try to recenter on small screens — keep the editorial weight to the bottom-left.

**3. One italic serif accent word**

Exactly ONE word on the entire site is set in Fraunces italic. That word is **"curation"**, in the homepage descriptor line:

> `creative direction, styling, & ` ***`curation.`***

All lowercase. The ampersand. The Fraunces italic on "curation" only. Body text in Satoshi, the italic word in Fraunces italic at the same size, no color change. This is the entire personality moment — do not add italic serif anywhere else on the site, ever. Its rarity is what makes it work.

### Two off-whites (subtle texture move)

Use two off-white values, not one, to add depth that reads as printed rather than digital:
- `--foreground-warm: #EDEAE3` — for display headlines, wordmark
- `--foreground-cool: #E8E6E0` — for body text

The difference is imperceptible at a glance but the page feels physical. If this feels like over-engineering during the build, both can collapse back to one value — but try it first.

---

## 3. SITE STRUCTURE

```
/                  Home / Landing
/links             Links hub (link-in-bio)
/submit            File submission page (visual only in v1)
/creative          Creative direction work page
/roster            Phase 2 — do NOT build in v1
```

### Global layout
- **No traditional nav bar.** Navigation is minimal — top-left wordmark "Riss Creative" in mixed case (softer, more personal than all-caps), top-right a small text menu (Links · Submit · Creative). Use Inter Tight at a smaller display size for the wordmark, not body weight.
- **No footer with attribution.** A single line at the bottom of each page: small caption text — `© Riss Creative · 2026` left-aligned. Nothing else. No "built with," no platform branding, no social icons in footer.

---

## 4. PAGES

### 4.1 Home (`/`)

**Purpose:** First impression. Sets the tone. Quiet, confident, editorial. **Magazine cover, not landing page.**

**Layout:** See "Distinctive Moves #2" above for the off-center composition spec. Recap:

- Full viewport height (`min-h-screen`)
- **Upper-right corner:** metadata block — `riss creative / los angeles / est. 2024` in lowercase caption text, muted color, slashes as separators
- **Lower-left:** wordmark "Riss Creative" in Display XL, light weight, slight negative letter-spacing
- **Directly below the wordmark:** descriptor line in body text — `creative direction, styling, & curation.` — with the word `curation` in Fraunces italic at the same size (see Distinctive Moves #3). All lowercase. Period at the end. Muted color OR full foreground — try both, pick whichever has more weight.
- No hero image. No scroll prompt. Pure typographic composition.
- The nav lives in its usual position (top-left wordmark mini + top-right menu) but on the homepage *only*, hide the top-left wordmark since the giant one is the whole point.

**Mobile:** Don't recenter. Keep the metadata top-right (smaller), keep the wordmark + descriptor anchored bottom-left. Scale the wordmark down but maintain the composition.

---

### 4.2 Links Hub (`/links`)

**Purpose:** Personal social/streaming aggregator. Linktree-style but editorial — not a wall of buttons.

**Layout:**
- Centered column, max-width ~`max-w-md`
- Top: small caption `LINKS` in uppercase tracking-widest
- Then her name in Display M
- A list of platforms, each row:
  - Platform name (e.g. "Soundcloud") in body text, left-aligned
  - Handle or descriptor in muted color, right-aligned on same row OR below in muted small text
  - The entire row is a clickable link with hover opacity transition
  - Hairline divider between rows (`border-b border-border`)

**Placeholder list for v1:**
```
SOUNDCLOUD       /riss          (DJ sets & mixes)
INSTAGRAM        @riss          (personal)
YOUTUBE          coming soon    (no link, muted styling)
TIKTOK           @riss          (short-form content)
```

Riss will provide real handles later. Use `href="#"` placeholders for now.

---

### 4.3 Submit (`/submit`)

**Purpose:** File intake for artists submitting loop packs and samples. In v1 this is **visual only** — the dropzone and form do not actually do anything. Use `<form onSubmit={(e) => e.preventDefault()}>` and show a "Submission received" state on click if you want, but no real upload.

**Layout:**
- Top: small caption `SUBMIT`
- Page title in Display L: *"Send Files"*
- One short paragraph of intro copy (placeholder):
  *"For loop packs, samples, and creative submissions. Drop your files below — I'll review and respond within a few days."*
- Then a vertical form:
  1. **Drag-and-drop area** — a large bordered rectangle (`border border-border border-dashed`), centered text inside: *"Drop files here or click to browse"*, accepted types listed below in muted small text: `.wav · .mp3 · .zip · max 500MB`
  2. Input: **Artist Name** — minimal styling, no label above, placeholder text inside, hairline underline only (`border-b border-border bg-transparent`)
  3. Input: **Email** — same styling
  4. Textarea: **Brief description** — same styling, 4 rows
  5. Submit button: text link style, right-aligned, `Submit →` with arrow

**Mobile:** All form fields full-width, generous spacing between them.

---

### 4.4 Creative Direction (`/creative`)

**Purpose:** The main work page. Imagery-led, editorial. Communicates range and taste without listing clients.

**Layout strategy:** A single scrolling editorial layout, NOT a grid of equal cards. Each capability is a section with its own rhythm — some sections full-bleed image, some image + text side-by-side, some text-only. Vary it.

**Top of page:**
- Small caption `CREATIVE DIRECTION`
- Page title in Display L: *"Work"* or *"Direction"* (pick one)
- Below: one paragraph of intro placeholder copy

**The six capability sections** (build one component, render 6 times with varied layout):
1. **Aesthetic Curation** — full-bleed image placeholder, label overlaid bottom-left
2. **Creative Direction** — image left, label + tiny description right
3. **Styling** — two-image diptych, side by side
4. **Event Planning** — full-bleed image
5. **Media Management** — image right, label + tiny description left
6. **Image Direction** — full-bleed image

For v1, use real Unsplash photography as placeholders so the mockup actually feels finished — gray `<div>` blocks make it hard for Riss to react to layout. Configure `next.config.js` to allow `images.unsplash.com` in `remotePatterns`. Use `next/image` for all placeholders.

**Image vibe per section** (Claude Code: pick specific Unsplash photo URLs matching these themes — search Unsplash for the themes below, grab direct image URLs from `images.unsplash.com`):

1. **Aesthetic Curation** — moody editorial still life, dark fabric textures, fashion product detail shots
2. **Creative Direction** — behind-the-scenes shoot moments, dim studio lighting, hands at work
3. **Styling** — fashion editorial portraits, model close-ups, wardrobe details (use two complementary images for the diptych)
4. **Event Planning** — nightlife atmosphere, low-light venues, crowd moments
5. **Media Management** — moody workspace shots, screens in dim light, creative process
6. **Image Direction** — high-contrast portrait, fashion-forward, looking away from camera

All images should feel dark, warm-toned, and editorial. Reject anything bright, blue-toned, or stock-photo-obvious. If a chosen photo feels too "tech stock," swap it.

Centralize all placeholder image URLs in `/content/images.ts` so they can be swapped for Riss's real photography in Phase 2 with a single file change.

For v1, use these aspect ratios for variety: `aspect-[4/5]`, `aspect-[3/4]`, `aspect-video`, `aspect-square`. Each image should have a small caption label below it in muted text showing the section name.

**Bottom of page:** Centered, generous padding above and below.
*"For portfolio inquiries — contact@risscreative.com"*
Make the email a `mailto:` link.

---

### 4.5 Roster (`/roster`) — DO NOT BUILD IN V1
Skip entirely. Don't create the route, don't link to it.

---

## 5. COMPONENT STRUCTURE

```
/app
  layout.tsx           // Root layout — fonts, metadata, <Nav />
  page.tsx             // Home
  globals.css          // Tailwind + CSS vars for colors
  /links
    page.tsx
  /submit
    page.tsx
  /creative
    page.tsx
/components
  Nav.tsx              // Top-left wordmark, top-right text menu
  Footer.tsx           // Single line caption
  LinkRow.tsx          // Reusable row for /links page
  Dropzone.tsx         // Visual dropzone for /submit
  FormField.tsx        // Hairline-underline input/textarea
  CapabilitySection.tsx // Reusable section for /creative — accepts variant prop
/content               // ALL hardcoded copy + image URLs live here
  copy.ts              // Page copy, descriptors, CTAs
  links.ts             // Social links list
  capabilities.ts      // The 6 Creative section data
  images.ts            // Unsplash placeholder URLs (swap for real photos in Phase 2)
/public
  /images              // Riss's real photos go here in Phase 2
```

**Why the `/content` directory matters:** in Phase 2 we'll swap this for a Sanity CMS so Riss can edit copy herself. Keeping all hardcoded content here in v1 means that swap is a refactor of one folder, not a rewrite of every page.

Keep components small and obvious. No abstraction for its own sake.

---

## 6. METADATA / SEO

In `layout.tsx`:
```
title: "Riss Creative"
description: "Creative direction, styling, and curation."
favicon: /favicon.ico  (placeholder for now)
```

No Open Graph image in v1 — add in Phase 2.

---

## 7. WHAT IS EXPLICITLY OUT OF SCOPE FOR V1

- Real file uploads (visual dropzone only)
- Real form submission / email routing
- Sanity CMS or any CMS
- Real social media links (use `#` placeholders)
- Roster page
- Custom email setup
- Domain configuration
- Open Graph / SEO images
- Analytics
- Cookie banners
- Any backend / API routes

---

## 8. ACCEPTANCE CRITERIA FOR V1

The site is ready for Riss to review when:
- [ ] All 4 pages render and are navigable from each other
- [ ] On mobile, all pages are fully responsive (test at 375px width)
- [ ] The aesthetic feels dark, warm, editorial, mature — NOT tech-y, NOT corporate
- [ ] Typography hierarchy is consistent across pages
- [ ] No third-party branding anywhere on screen
- [ ] Submit page form is interactive (focus states, hover states) even though it doesn't actually submit
- [ ] Page transitions feel quiet — no flashy animations
- [ ] Deploys cleanly to Vercel

---

## 8.5 AUTONOMOUS BUILD LOOP

**Read this section carefully. It governs how you work, not just what you build.**

Build in autonomous loops. After completing each unit of work (a component, a page, a system setup), run a self-verification checklist before moving on. Do NOT ask the human for approval between steps unless you hit something in the "Escalate to human" list below. Keep momentum.

### The loop

For each unit of work:

1. **Build it** per the PRD spec.
2. **Self-verify** against the checklist below.
3. **Fix any issues** you find. Re-verify.
4. **Log progress** in a single line: `✓ [unit name] complete — [one-line note]`.
5. **Move to the next unit.** Do not wait for confirmation.

### Self-verification checklist (run after every unit)

**Technical correctness:**
- [ ] `npm run build` completes with zero errors and zero TypeScript errors
- [ ] No console errors or warnings in dev mode
- [ ] No unused imports, no dead code, no `any` types where avoidable
- [ ] All links route correctly (no 404s between pages)
- [ ] All images load (no broken Unsplash URLs — if one 404s, swap it)

**Visual correctness (test at three breakpoints: 375px mobile, 768px tablet, 1280px desktop):**
- [ ] No overlapping text or elements at any breakpoint
- [ ] No horizontal scroll on mobile (375px width)
- [ ] No text clipping or cut-off content
- [ ] No "janky" layout shifts when fonts load — set proper font fallbacks
- [ ] Spacing between sections feels intentional, not cramped or arbitrary
- [ ] Typography hierarchy reads cleanly — display > body > caption is visually obvious
- [ ] All hover states work (link opacity, dropzone border, button)
- [ ] Focus states visible on form inputs (keyboard accessibility)

**Spec adherence:**
- [ ] Colors match design tokens exactly (no random hex values introduced)
- [ ] Fonts match spec (Cabinet Grotesk for display, Satoshi for body, Fraunces for the ONE accent word)
- [ ] The three Distinctive Moves are implemented and working
- [ ] No third-party branding visible anywhere
- [ ] Footer is a single line, no platform attribution

**How to test visually without a human:** Run the dev server. Use a headless approach if available (Playwright, Puppeteer) to screenshot pages at the three breakpoints and inspect for overlaps/clipping. If you don't have a screenshot tool available, read your own rendered HTML/CSS carefully and reason about layout based on the CSS — pay special attention to `position: absolute` elements, `overflow` rules, and any element whose width could exceed its container.

### Escalate to human ONLY when

Stop the loop and ask the human if you hit any of these:

1. **Ambiguity in the spec** — something in the PRD contradicts itself or is genuinely unclear after re-reading
2. **External account needed** — you need a Vercel account, domain credentials, or any login the human has to provide
3. **A taste decision** that affects multiple pages — e.g. "the homepage feels too sparse, want me to add a hero image?" — these are vibe calls, not technical ones
4. **A failed verification you can't fix after 3 attempts** — don't loop forever, surface the blocker
5. **You're about to install a major dependency not in the PRD** — confirm before adding it

Do NOT escalate for:
- Choosing between two roughly-equivalent Unsplash photos
- Minor spacing decisions (use the design system — that's what it's for)
- Variable naming, file organization within the spec'd structure
- TypeScript types you can reasonably infer
- Any decision the PRD already answers

### Build order (run the loop in this sequence)

1. Project scaffolding: Tailwind config, Fontshare + Google Fonts setup, `globals.css` with all color tokens and the two off-whites, root layout with grain overlay
2. `/content` directory: copy.ts, links.ts, capabilities.ts, images.ts (populate Unsplash URLs matching the section themes)
3. Shared components: Nav, Footer, FormField, LinkRow, Dropzone, CapabilitySection
4. Home page (off-center composition is critical — verify the magazine-cover feel before moving on)
5. Links page
6. Submit page (visual only, no real upload)
7. Creative page (vary the section rhythm per spec)
8. Final pass: re-run the full verification checklist across all 4 pages at all 3 breakpoints
9. Deploy to Vercel, report the preview URL

### Final report to human

When the full build is done, give a single summary message:
- The Vercel preview URL
- A checklist of every unit completed
- Any decisions you made autonomously that the human might want to know about
- Any items you escalated and resolved during the build
- A list of things explicitly out of scope that were skipped per the PRD

Do not give intermediate progress updates unless escalating. The human is offline (on a flight). Work the loop.

---

## 9. PHASE 2 (NOT NOW — JUST FOR CONTEXT)

After Riss approves the v1 mockup, Phase 2 will handle:

- **Submit page integration:** wire the dropzone to a real file upload backend. Likely Supabase storage (free tier, no platform branding, handles large audio files) or UploadThing. Send Riss an email notification on each submission.
- **Sanity CMS integration:** replace `/content` files with Sanity schemas. Riss gets a `/studio` admin route to edit copy, swap images, and update social links herself.
- **Build /roster page** with the same Sanity-driven approach so Riss can add/edit talent cards from her dashboard.
- **Real imagery:** replace Unsplash placeholders with Riss's actual photography.
- **Real social URLs:** swap `#` placeholders for real Soundcloud, Instagram, TikTok, YouTube links.
- **Domain setup:** point risscreative.com to Vercel.
- **Email setup:** Google Workspace for contact@risscreative.com.
- **Polish:** Open Graph card, favicon, Vercel Analytics (no branding shown to visitors).


---

**End of brief.**
