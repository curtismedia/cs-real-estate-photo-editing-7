// SERVICES — single source of truth for the service catalogue.
//
// `type: 'photo'` renders Before/After examples in the modal.
// `type: 'video'` renders video thumbnails that open a Video Modal.
//
// `order` controls display order on the Services page and homepage carousel.
// Numbering (01, 02, …) is derived from this order — never hard-coded.
//
// MEDIA: every path below is the REAL path your files will live at once you
// upload them (e.g. /public/images/services/hdr/cover.webp). Until then
// resolveMedia() serves a safe fallback so nothing renders broken.
// See src/data/media.js to switch a folder over to real media.

import { resolveMedia } from './media'
import { videoCover, videoEditingVideos } from './videos'

const cover = (slug, seed) =>
  resolveMedia(slug, `/images/services/${slug}/cover.webp`, seed)

const ba = (slug, n, seed) => ({
  before: resolveMedia(slug, `/images/services/${slug}/before-0${n}.webp`, `${seed}-b${n}`),
  after: resolveMedia(slug, `/images/services/${slug}/after-0${n}.webp`, `${seed}-a${n}`),
})

// --- REAL uploaded before/after pairs -------------------------------------
// Bypasses resolveMedia() on purpose: these files are already in /public, so
// they need no readiness flag. Use this per-service as real pairs land, which
// lets one service switch to real media while the rest keep their fallbacks.
// `count` must match the number of COMPLETE pairs present in the folder.
const pairPath = (slug, n, ext) => {
  const num = String(n).padStart(2, '0')
  return {
    before: `/images/services/${slug}/before-${num}.${ext}`,
    after: `/images/services/${slug}/after-${num}.${ext}`,
  }
}

const realBaSet = (slug, count, ext = 'jpg') =>
  Array.from({ length: count }, (_, i) => pairPath(slug, i + 1, ext))

/**
 * Same thing for folders whose numbering has GAPS — pass the ranges that
 * actually exist, inclusive, in order. `realBaSet` would emit a pair for every
 * missing number and each one would render as two broken images.
 *   realBaSetFrom('flambient', [[1, 22], [24, 30]])
 */
const realBaSetFrom = (slug, ranges, ext = 'jpg') =>
  ranges
    .flatMap(([from, to]) =>
      Array.from({ length: to - from + 1 }, (_, i) => from + i)
    )
    .map((n) => pairPath(slug, n, ext))

export const services = [
  {
    id: 's01',
    slug: 'video-editing',
    order: 1,
    name: 'Video Editing',
    type: 'video',
    tagline: 'Cinematic property films & listing reels',
    mediaDir: '/images/services/video-editing/',
    // Cover and the popup's video list both come from src/data/videos.js, so
    // changing the first video there updates the Homepage card, this row and
    // the popup together. No placeholder or sample footage anywhere.
    cover: videoCover,
    description:
      'Full-length property films, agent-branded listing videos and short social edits. Color grading, pacing, licensed music and clean titles — cut to tell the story of the home.',
    videos: videoEditingVideos,
    beforeAfterExamples: [],
  },
  {
    id: 's02',
    slug: 'virtual-staging',
    order: 2,
    name: 'Virtual Staging',
    type: 'photo',
    tagline: 'Realistic furniture, lighting-matched',
    mediaDir: '/images/services/virtual-staging/',
    // Homepage service card only. The Services page ignores `cover` for photo
    // services and renders the first before/after pair instead, so this reuses
    // a real result rather than needing a separate cover.webp upload.
    cover: '/images/services/virtual-staging/after-01.jpg',
    description:
      'Empty rooms furnished with photorealistic staging — correct perspective, shadows and lighting so the result reads as real, not pasted in. Multiple style directions available.',
    // Real media — 25 complete .jpg before/after pairs, numbered 01 … 25.
    // No labels: the uploaded set is a full shoot, not a few named rooms.
    beforeAfterExamples: realBaSet('virtual-staging', 25),
    videos: [],
  },
  {
    id: 's03',
    slug: 'hdr',
    order: 3,
    name: 'HDR Editing',
    type: 'photo',
    tagline: 'Bracketed exposures, merged and balanced',
    mediaDir: '/images/services/hdr/',
    // Homepage service card only. The Services page ignores `cover` for photo
    // services and renders the first before/after pair instead, so this reuses
    // a real HDR result rather than needing a separate cover.webp upload.
    cover: '/images/services/hdr/after-12.jpg',
    description:
      'Bracketed exposures merged into one clean, natural frame — controlled highlights, open shadows, true window detail and accurate white balance. The dependable everyday workhorse of listing photography, delivered consistently across a full set.',
    // Real media — 33 complete .jpg before/after pairs, numbered 01 … 33.
    // No labels: the uploaded set is a full shoot, not three named rooms.
    beforeAfterExamples: realBaSet('hdr', 33),
    videos: [],
  },
  {
    id: 's04',
    slug: 'object-removal',
    order: 4,
    name: 'Object Removal',
    type: 'photo',
    tagline: 'Clutter, cars, cables — cleanly gone',
    mediaDir: '/images/services/object-removal/',
    // Homepage service card only. The Services page ignores `cover` for photo
    // services and renders the first before/after pair instead, so this reuses
    // a real result rather than needing a separate cover.webp upload.
    cover: '/images/services/object-removal/after-01.jpg',
    description:
      'Distractions removed and the scene rebuilt convincingly — parked cars, bins, cables, pool equipment, personal items and reflections. Clean plates with no smearing or repeated
