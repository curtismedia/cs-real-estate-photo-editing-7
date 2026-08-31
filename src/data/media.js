// ---------------------------------------------------------------------------
// MEDIA — central resolver for local media that has not been uploaded yet.
//
// The real image files are NOT in the repository yet. Rather than pointing the
// site at paths that would render as broken images, every media reference goes
// through `resolveMedia()`:
//
//   • flag = false  →  a safe remote fallback image is used (site keeps working)
//   • flag = true   →  the real local path under /public is used
//
// WHEN YOU UPLOAD REAL MEDIA:
//   1. Drop the files into the matching folder in /public (e.g.
//      /public/images/services/hdr/cover.webp)
//   2. Flip that folder's flag below from false to true.
// Nothing else needs to change anywhere in the codebase.
// ---------------------------------------------------------------------------

/** Flip a key to `true` once the real files exist in /public for that folder. */
export const LOCAL_MEDIA_READY = {
  hero: true,
  home: false,
  'video-editing': false,
  'virtual-staging': false,
  hdr: false,
  'object-removal': false,
  flambient: false,
  twilight: false,
  'day-to-dusk': false,
  'drone-aerial': false,
  single: false,
  'floor-plan': false,
}

/** Temporary stand-in image. Only used while a folder's flag is false. */
export const fallbackImage = (seed, w = 1400, h = 933) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`

/**
 * Resolve a media path.
 * @param {string} key       key in LOCAL_MEDIA_READY (usually the service slug)
 * @param {string} path      the real local path, e.g. '/images/services/hdr/cover.webp'
 * @param {string} seed      fallback seed used until the real file is uploaded
 * @param {[number, number]} [size] fallback dimensions
 */
export const resolveMedia = (key, path, seed, size) =>
  LOCAL_MEDIA_READY[key] ? path : fallbackImage(seed, size?.[0], size?.[1])

// ---------------------------------------------------------------------------
// HOMEPAGE HERO — cinematic crossfade slideshow.
// Add or remove entries freely; the Hero component adapts automatically.
// ---------------------------------------------------------------------------
export const heroSlides = [
  { src: resolveMedia('hero', '/images/hero/hero-01.webp', 'cs-hero-01', [2000, 1200]), alt: 'Contemporary residence at dusk' },
  { src: resolveMedia('hero', '/images/hero/hero-02.webp', 'cs-hero-02', [2000, 1200]), alt: 'Sunlit open-plan living room' },
  { src: resolveMedia('hero', '/images/hero/hero-03.webp', 'cs-hero-03', [2000, 1200]), alt: 'Architectural exterior detail' },
  { src: resolveMedia('hero', '/images/hero/hero-04.webp', 'cs-hero-04', [2000, 1200]), alt: 'Poolside twilight exterior' },
]

/** Seconds each hero slide holds before crossfading to the next. */
export const HERO_SLIDE_DURATION = 6500

// ---------------------------------------------------------------------------
// HOMEPAGE — "The Approach" editorial image
// ---------------------------------------------------------------------------
export const approachImage = {
  src: resolveMedia('home', '/images/home/approach.webp', 'cs-approach', [1200, 1500]),
  alt: 'Interior detail of a refined residential space',
}
