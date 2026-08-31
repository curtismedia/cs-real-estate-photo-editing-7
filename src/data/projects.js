// PORTFOLIO PROJECTS — the single shared source of truth.
//
// Both the Homepage ("Selected work") and the Work page read from this file.
// Homepage uses `featuredProjects`, Work uses `projects`. Because
// `featuredProjects` is derived from `projects`, the two pages can never fall
// out of sync: Project 01 is the same project in both places.
//
// NAMING: projects are numbered sequentially — Project 01, Project 02, …
// The only line shown under a title is `date` (completion date, D/M/YYYY).
// No property names, no locations, no service labels.
//
// MEDIA: Projects 01 and 03 use real uploaded files. Projects 02, 04, 05, 06
// still use picsum placeholders until their real images are uploaded.

const img = (seed, w = 1600, h = 1067) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`

// Real uploaded media. Files live in /public/images/work/<slug>/ and are named
// <slug>-01.<ext> … <slug>-NN.<ext>. Filenames are NOT renamed by the code.
// Extension varies per project, so pass it in: 'webp' (default) or 'jpg'.
const realImg = (slug, n, ext = 'webp') =>
  `/images/work/${slug}/${slug}-${String(n).padStart(2, '0')}.${ext}`

/**
 * Ordered list of real image paths, 01 … count.
 * `count` must match the number of files actually present in the folder.
 *   realGallery('project-01', 40)          → .webp
 *   realGallery('project-03', 46, 'jpg')   → .jpg
 */
const realGallery = (slug, count, ext = 'webp') =>
  Array.from({ length: count }, (_, i) => realImg(slug, i + 1, ext))

export const projects = [
  {
    id: 'p001',
    slug: 'project-01',
    title: 'Project 01',
    date: '20/6/2026',
    // Real media — 40 .webp files, no picsum fallback for this project.
    cover: realImg('project-01', 1),
    gallery: realGallery('project-01', 40),
    // No real before/after pairs supplied yet, so the modal's Before/After
    // block is skipped entirely (it is guarded by `beforeAfter?.length > 0`).
    beforeAfter: [],
    videos: [],
  },
  {
    id: 'p002',
    slug: 'project-02',
    title: 'Project 02',
    date: '20/6/2026',
    cover: img('cs-project-02-cover'),
    gallery: [
      img('cs-project-02-1'),
      img('cs-project-02-2'),
      img('cs-project-02-3'),
    ],
    beforeAfter: [
      { before: img('cs-project-02-b1'), after: img('cs-project-02-a1'), label: 'Living Room' },
      { before: img('cs-project-02-b2'), after: img('cs-project-02-a2'), label: 'Bedroom' },
    ],
    videos: [],
  },
  {
    id: 'p003',
    slug: 'project-03',
    title: 'Project 03',
    date: '20/6/2026',
    // Real media — 46 .jpg files, no picsum fallback for this project.
    cover: realImg('project-03', 1, 'jpg'),
    gallery: realGallery('project-03', 46, 'jpg'),
    // No real before/after pairs supplied yet, so the modal's Before/After
    // block is skipped entirely (it is guarded by `beforeAfter?.length > 0`).
    beforeAfter: [],
    videos: [],
  },
  {
    id: 'p004',
    slug: 'project-04',
    title: 'Project 04',
    date: '20/6/2026',
    cover: img('cs-project-04-cover'),
    gallery: [
      img('cs-project-04-1'),
      img('cs-project-04-2'),
      img('cs-project-04-3'),
    ],
    beforeAfter: [
      { before: img('cs-project-04-b1'), after: img('cs-project-04-a1'), label: 'Exterior' },
    ],
    videos: [],
  },
  {
    id: 'p005',
    slug: 'project-05',
    title: 'Project 05',
    date: '20/6/2026',
    cover: img('cs-project-05-cover'),
    gallery: [
      img('cs-project-05-1'),
      img('cs-project-05-2'),
      img('cs-project-05-3'),
      img('cs-project-05-4'),
    ],
    beforeAfter: [
      { before: img('cs-project-05-b1'), after: img('cs-project-05-a1'), label: 'Interior' },
    ],
    videos: [],
  },
  {
    id: 'p006',
    slug: 'project-06',
    title: 'Project 06',
    date: '20/6/2026',
    cover: img('cs-project-06-cover'),
    gallery: [
      img('cs-project-06-1'),
      img('cs-project-06-2'),
      img('cs-project-06-3'),
    ],
    beforeAfter: [
      { before: img('cs-project-06-b1'), after: img('cs-project-06-a1'), label: 'Living Room' },
    ],
    videos: [],
  },
]

// Homepage "Selected Work" shows the first N projects — same objects, same
// numbering, same order as the Work page.
export const featuredProjects = projects.slice(0, 6)

export const getProjectBySlug = (slug) => projects.find((p) => p.slug === slug)
