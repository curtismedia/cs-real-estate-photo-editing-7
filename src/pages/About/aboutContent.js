// ===========================================================================
// ABOUT PAGE CONTENT — one place to edit images and copy for /about.
//
// This file exists so the page layout (About.jsx) never needs to be touched
// just to swap a photo, update a line of copy, or tweak a stat. Everything
// below is plain data — no JSX, no components.
// ===========================================================================

import { withBase } from '../../lib/assetPath'

const path = (p) => withBase(p)

/**
 * HIGH-RESOLUTION IMAGE SUPPORT
 * -----------------------------
 * Every image on this page is defined as { preview, highRes }. `preview` is
 * what's used in small/thumbnail contexts (cards, carousel items). `highRes`
 * is used for large, full-bleed displays (the hero photo, the featured
 * before/after, the final cinematic banner).
 *
 * If you only have one version of a photo, just set `preview` and leave
 * `highRes` as null — `pickImage()` below automatically falls back to
 * `preview` so nothing breaks.
 *
 * To add a sharper/larger version of an image later: upload the bigger file
 * next to the existing one (e.g. `hero-xl.jpg`) and set it as `highRes`.
 */
const image = (preview, highRes = null) => ({ preview, highRes })

/** Resolves an { preview, highRes } entry to a single URL. Pass `{ large: true }`
 *  for hero sections, featured before/afters, and other big display contexts;
 *  omit it (or pass nothing) for thumbnails/cards, where `preview` is enough. */
export function pickImage(entry, { large = false } = {}) {
  if (!entry) return undefined
  return (large && entry.highRes) || entry.preview
}

// ===========================================================================
// ABOUT PAGE IMAGES
// Change the file path here when you want to replace an image — nothing
// else in About.jsx needs to change. Every path below is a REAL delivered
// edit already in this repo (see /public/images/work and
// /public/images/services) — no stock photography.
// ===========================================================================
export const ABOUT_IMAGES = {
  // Section 01 — large editorial photo beside the intro copy.
  hero: image(path('/images/work/project-02/project-02-74.jpg')),

  // Section 05 — the large featured Before/After at the top of "The Work".
  workFeatured: {
    before: image(path('/images/services/day-to-dusk/before-01.jpg')),
    after: image(path('/images/services/day-to-dusk/after-01.jpg')),
    label: 'One capture, edited to the brief — day to dusk',
  },

  // Section 08 — cinematic full-bleed background behind the final CTA.
  finalCTA: image(path('/images/services/twilight/after-01.jpg')),
}

// Section 02 — "Your Style, Your Vision" — three before/after examples that
// show different editing treatments (NOT three different real clients — see
// the notes at the top of About.jsx for why). Add, remove or reorder entries
// here; the grid and popup behavior follow automatically.
export const ABOUT_STYLE_EXAMPLES = [
  {
    name: 'Natural & balanced',
    text: 'Accurate color, open shadows, true window detail — the everyday standard for listing photography.',
    before: image(path('/images/services/hdr/before-01.jpg')),
    after: image(path('/images/services/hdr/after-01.jpg')),
  },
  {
    name: 'Warm & golden-hour',
    text: 'The same property, taken to a twilight mood — deep sky, warm glow, nothing overdone.',
    before: image(path('/images/services/twilight/before-01.jpg')),
    after: image(path('/images/services/twilight/after-01.jpg')),
  },
  {
    name: 'Styled & furnished',
    text: 'An empty room brought to life with furnishing matched to the space’s own light and perspective.',
    before: image(path('/images/services/virtual-staging/before-01.jpg')),
    after: image(path('/images/services/virtual-staging/after-01.jpg')),
  },
]

// ===========================================================================
// ABOUT PAGE COPY — process steps & workflow benefits
// Edit the text here; the 4-column grid (desktop/tablet) and vertical rail
// (mobile) are generated from this array, so the layout never needs touching.
// ===========================================================================
export const ABOUT_PROCESS_STEPS = [
  {
    n: '01',
    kicker: 'Send',
    title: 'Send your files & references',
    text: 'Upload your RAW files, references, instructions, and any specific requirements.',
  },
  {
    n: '02',
    kicker: 'Understand',
    title: 'We learn your style',
    text: 'We review your references and requirements before editing, so our team knows exactly what you’re looking for.',
  },
  {
    n: '03',
    kicker: 'Edit',
    title: 'We bring it together',
    text: 'Our editors work through the project with your preferred style, requirements, and delivery standards in mind.',
  },
  {
    n: '04',
    kicker: 'QC & Deliver',
    title: 'We check before delivery',
    text: 'Every project goes through a final quality check for consistency, details, and your specific requirements before delivery.',
  },
]

// "Built For Your Workflow" trust bar. On mobile this renders as a looping
// one-line marquee instead of the 4-column grid — see .about-marquee in
// About.css — so keep these short; they also appear in all caps there.
export const ABOUT_WORKFLOW = [
  { icon: 'layers', title: 'Consistent', text: 'Your preferences and requirements are documented and followed across projects.' },
  { icon: 'workflow', title: 'Reliable', text: 'A clear workflow and quality control process from start to finish.' },
  { icon: 'bolt', title: 'Fast', text: 'Typical turnaround of 8–12 hours, depending on the project.' },
  { icon: 'calendar', title: 'Flexible', text: 'From individual properties to recurring weekly production volume.' },
]
