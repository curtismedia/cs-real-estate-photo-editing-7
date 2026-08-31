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
// TO ADD A PROJECT: copy an object, bump `id`, `slug`, `title` and set `date`.
// Nothing in Home.jsx or Work.jsx needs to change.
//
// MEDIA: still placeholder images (picsum.photos). Real files are not wired up
// yet.

const img = (seed, w = 1600, h = 1067) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`

export const projects = [
  {
    id: 'p001',
    slug: 'project-01',
    title: 'Project 01',
    date: '20/6/2026',
    cover: img('cs-project-01-cover'),
    gallery: [
      img('cs-project-01-1'),
      img('cs-project-01-2'),
      img('cs-project-01-3'),
      img('cs-project-01-4'),
    ],
    beforeAfter: [
      { before: img('cs-project-01-b1'), after: img('cs-project-01-a1'), label: 'Interior' },
      { before: img('cs-project-01-b2'), after: img('cs-project-01-a2'), label: 'Exterior' },
    ],
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
    cover: img('cs-project-03-cover'),
    gallery: [
      img('cs-project-03-1'),
      img('cs-project-03-2'),
      img('cs-project-03-3'),
      img('cs-project-03-4'),
    ],
    beforeAfter: [
      { before: img('cs-project-03-b1'), after: img('cs-project-03-a1'), label: 'Interior' },
    ],
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
