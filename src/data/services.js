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
const realBaSet = (slug, count, ext = 'jpg') =>
  Array.from({ length: count }, (_, i) => {
    const n = String(i + 1).padStart(2, '0')
    return {
      before: `/images/services/${slug}/before-${n}.${ext}`,
      after: `/images/services/${slug}/after-${n}.${ext}`,
    }
  })

export const services = [
  {
    id: 's01',
    slug: 'video-editing',
    order: 1,
    name: 'Video Editing',
    type: 'video',
    tagline: 'Cinematic property films & listing reels',
    mediaDir: '/images/services/video-editing/',
    cover: cover('video-editing', 'cs-svc-video'),
    description:
      'Full-length property films, agent-branded listing videos and short social edits. Color grading, pacing, licensed music and clean titles — cut to tell the story of the home.',
    videos: [
      {
        id: 'v1',
        title: 'Listing Film — Coastal',
        poster: resolveMedia('video-editing', '/images/services/video-editing/poster-01.webp', 'cs-video-1'),
        src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
      },
      {
        id: 'v2',
        title: 'Social Reel — Loft',
        poster: resolveMedia('video-editing', '/images/services/video-editing/poster-02.webp', 'cs-video-2'),
        src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      },
    ],
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
    // Real media — 9 complete .jpg before/after pairs, numbered 01 … 09.
    // No labels: the uploaded set is a full shoot, not a few named rooms.
    beforeAfterExamples: realBaSet('virtual-staging', 9),
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
    cover: cover('object-removal', 'cs-svc-removal'),
    description:
      'Distractions removed and the scene rebuilt convincingly — parked cars, bins, cables, pool equipment, personal items and reflections. Clean plates with no smearing or repeated texture.',
    beforeAfterExamples: [
      { ...ba('object-removal', 1, 'cs-rem'), label: 'Driveway' },
      { ...ba('object-removal', 2, 'cs-rem'), label: 'Interior Clutter' },
    ],
    videos: [],
  },
  {
    id: 's05',
    slug: 'flambient',
    order: 5,
    name: 'Flambient Editing',
    type: 'photo',
    tagline: 'Flash-ambient blending, true-to-life color',
    mediaDir: '/images/services/flambient/',
    cover: cover('flambient', 'cs-svc-flambient'),
    description:
      'Hand-blended flash and ambient frames for interiors that need more than a merge — neutral color cast removal, crisp window pulls, natural shadow retention and a clean, magazine-grade finish on complex mixed lighting.',
    beforeAfterExamples: [
      { ...ba('flambient', 1, 'cs-fla'), label: 'Kitchen' },
      { ...ba('flambient', 2, 'cs-fla'), label: 'Bathroom' },
      { ...ba('flambient', 3, 'cs-fla'), label: 'Great Room' },
    ],
    videos: [],
  },
  {
    id: 's06',
    slug: 'twilight',
    order: 6,
    name: 'Twilight Editing',
    type: 'photo',
    tagline: 'Golden-hour exteriors from daytime frames',
    mediaDir: '/images/services/twilight/',
    cover: cover('twilight', 'cs-svc-twilight'),
    description:
      'Convert daytime exteriors into rich twilight scenes — warm interior glow, deep blue sky and balanced landscape lighting that makes a listing stand out in the feed.',
    beforeAfterExamples: [
      { ...ba('twilight', 1, 'cs-tw'), label: 'Front Exterior' },
      { ...ba('twilight', 2, 'cs-tw'), label: 'Backyard' },
    ],
    videos: [],
  },
  {
    id: 's07',
    slug: 'day-to-dusk',
    order: 7,
    name: 'Day to Dusk',
    type: 'photo',
    tagline: 'Soft evening mood, fully controlled',
    mediaDir: '/images/services/day-to-dusk/',
    // Homepage service card only. The Services page ignores `cover` for photo
    // services and renders the first before/after pair instead, so this reuses
    // a real result rather than needing a separate cover.webp upload.
    cover: '/images/services/day-to-dusk/after-01.jpg',
    description:
      'A refined evening treatment for exteriors and views — warm, natural and consistent across a full property set, without the heavy-handed look of a filter.',
    // Real media — 33 complete .jpg before/after pairs, numbered 01 … 33.
    // No labels: the uploaded set is a full shoot, not a few named rooms.
    beforeAfterExamples: realBaSet('day-to-dusk', 33),
    videos: [],
  },
  {
    id: 's08',
    slug: 'drone-aerial',
    order: 8,
    name: 'Drone / Aerial Editing',
    type: 'photo',
    tagline: 'Sky replacement & aerial color match',
    mediaDir: '/images/services/drone-aerial/',
    cover: cover('drone-aerial', 'cs-svc-drone'),
    description:
      'Aerial stills cleaned, color-matched to the ground set, with natural sky replacement and lens correction for a cohesive gallery from the first frame to the last.',
    beforeAfterExamples: [
      { ...ba('drone-aerial', 1, 'cs-dr'), label: 'Aerial' },
      { ...ba('drone-aerial', 2, 'cs-dr'), label: 'Lot Overview' },
    ],
    videos: [],
  },
  {
    id: 's09',
    slug: 'single',
    order: 9,
    name: 'Single',
    type: 'photo',
    tagline: 'Single-exposure correction, per image',
    mediaDir: '/images/services/single/',
    // Homepage service card only. The Services page ignores `cover` for photo
    // services and renders the first before/after pair instead, so this reuses
    // a real result rather than needing a separate cover.webp upload.
    cover: '/images/services/single/after-01.jpg',
    description:
      'Single-exposure editing for straightforward frames — exposure and white balance correction, vertical and lens correction, noise control and a light clean-up. The efficient option for high-volume sets.',
    // Real media — 11 complete .jpg before/after pairs, numbered 01 … 11.
