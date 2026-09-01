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
// MEDIA: every project uses real uploaded .jpg files. The picsum helper below
// is kept only as a safe fallback for any project added before its images are.

const img = (seed, w = 1600, h = 1067) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`

// Real uploaded media. Files live in /public/images/work/<slug>/ and are named
// <slug>-01.<ext> … <slug>-NN.<ext>. Filenames are NOT renamed by the code.
// Extension varies per project, so pass it in: 'webp' (default) or 'jpg'.
//
// `cover` and `gallery` are independent: the cover may point at ANY numbered
// file, while the gallery always runs 01 … NN in numerical order. Choosing a
// different cover therefore never reorders the gallery.
const realImg = (slug, n, ext = 'webp') =>
  `/images/work/${slug}/${slug}-${String(n).padStart(2, '0')}.${ext}`

/**
 * Ordered list of real image paths, 01 … count.
 * `count` must match the number of files actually present in the folder.
 *   realGallery('project-07', 12)          → .webp (default)
 *   realGallery('project-01', 63, 'jpg')   → .jpg
 */
const realGallery = (slug, count, ext = 'webp') =>
  Array.from({ length: count }, (_, i) => realImg(slug, i + 1, ext))

export const projects = [
  {
    id: 'p001',
    slug: 'project-01',
    title: 'Project 01',
    date: '20/6/2026',
    // Real media — 63 .jpg files, no picsum fallback for this project.
    // Cover is file 03; the gallery still starts at 01 and stays in order.
    cover: realImg('project-01', 3, 'jpg'),
    gallery: realGallery('project-01', 63, 'jpg'),
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
    // Real media — 102 .jpg files, numbered 01–102 with no gaps.
    // Cover is file 74; the gallery still starts at 01 and stays in order.
    cover: realImg('project-02', 74, 'jpg'),
    gallery: realGallery('project-02', 102, 'jpg'),
    // No real before/after pairs supplied yet, so the modal's Before/After
    // block is skipped entirely (it is guarded by `beforeAfter?.length > 0`).
    beforeAfter: [],
    videos: [],
  },
  {
    id: 'p003',
    slug: 'project-03',
    title: 'Project 03',
    date: '20/6/2026',
    // Real media — 46 .jpg files, no picsum fallback for this project.
    // Cover is file 06; the gallery still starts at 01 and stays in order.
    cover: realImg('project-03', 6, 'jpg'),
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
    // Real media — 57 .jpg files, numbered 01–57 with no gaps.
    cover: realImg('project-04', 1, 'jpg'),
    gallery: realGallery('project-04', 57, 'jpg'),
    // No real before/after pairs supplied yet, so the modal's Before/After
    // block is skipped entirely (it is guarded by `beforeAfter?.length > 0`).
    beforeAfter: [],
    videos: [],
  },
  {
    id: 'p005',
    slug: 'project-05',
    title: 'Project 05',
    date: '20/6/2026',
    // Real media — 36 .jpg files, numbered 01–36 with no gaps.
    // Cover is file 04; the gallery still starts at 01 and stays in order.
    cover: realImg('project-05', 4, 'jpg'),
    gallery: realGallery('project-05', 36, 'jpg'),
    // No real before/after pairs supplied yet, so the modal's Before/After
    // block is skipped entirely (it is guarded by `beforeAfter?.length > 0`).
    beforeAfter: [],
    videos: [],
  },
  {
    id: 'p006',
    slug: 'project-06',
    title: 'Project 06',
    date: '20/6/2026',
    // Real media — 70 .jpg files, numbered 01–70 with no gaps.
    // Cover is file 68; the gallery still starts at 01 and stays in order.
    cover: realImg('project-06', 68, 'jpg'),
    gallery: realGallery('project-06', 70, 'jpg'),
    // No real before/after pairs supplied yet, so the modal's Before/After
    // block is skipped entirely (it is guarded by `beforeAfter?.length > 0`).
    beforeAfter: [],
    videos: [],
  },
]

// Homepage "Selected Work" shows the first N projects — same objects, same
// numbering, same order as the Work page.
export const featuredProjects = projects.slice(0, 6)

export const getProjectBySlug = (slug) => projects.find((p) => p.slug === slug)
