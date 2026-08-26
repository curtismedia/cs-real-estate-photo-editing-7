// PORTFOLIO PROJECTS
// Each object is ONE property / project (not a single image).
//
// To add a project later: copy one object, change the fields, add media URLs.
// You do NOT need to touch Work.jsx or ProjectModal.jsx.
//
// Media below uses placeholder image URLs (picsum.photos) so the site builds
// and previews immediately. Replace `cover`, `gallery`, `beforeAfter` and
// `videos` with your real hosted media (CDN / image host / video host).

const img = (seed, w = 1600, h = 1067) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`

export const projects = [
  {
    id: 'p001',
    slug: 'modern-coastal-residence',
    title: 'Modern Coastal Residence',
    location: 'Malibu, CA',
    services: ['HDR', 'Twilight', 'Video'],
    cover: img('cs-coastal-cover'),
    description:
      'A cliffside home where glass meets ocean light. We balanced blown-out windows against warm interiors and finished with a dusk exterior that lets the architecture glow.',
    gallery: [img('cs-coastal-1'), img('cs-coastal-2'), img('cs-coastal-3'), img('cs-coastal-4')],
    beforeAfter: [
      { before: img('cs-coastal-b1'), after: img('cs-coastal-a1'), label: 'Interior HDR' },
      { before: img('cs-coastal-b2'), after: img('cs-coastal-a2'), label: 'Twilight Exterior' },
    ],
    videos: [],
  },
  {
    id: 'p002',
    slug: 'hillside-glass-house',
    title: 'Hillside Glass House',
    location: 'Los Angeles, CA',
    services: ['Flambient', 'Virtual Staging'],
    cover: img('cs-hillside-cover'),
    description:
      'An empty new-build brought to life with realistic virtual staging and clean flambient interiors that keep the view as the hero.',
    gallery: [img('cs-hillside-1'), img('cs-hillside-2'), img('cs-hillside-3')],
    beforeAfter: [
      { before: img('cs-hillside-b1'), after: img('cs-hillside-a1'), label: 'Virtual Staging' },
      { before: img('cs-hillside-b2'), after: img('cs-hillside-a2'), label: 'Living Room' },
    ],
    videos: [],
  },
  {
    id: 'p003',
    slug: 'downtown-loft',
    title: 'Downtown Loft',
    location: 'Chicago, IL',
    services: ['HDR', 'Video'],
    cover: img('cs-loft-cover'),
    description:
      'Industrial materials and hard window light. Careful exposure blending keeps brick texture while recovering the skyline outside.',
    gallery: [img('cs-loft-1'), img('cs-loft-2'), img('cs-loft-3'), img('cs-loft-4')],
    beforeAfter: [{ before: img('cs-loft-b1'), after: img('cs-loft-a1'), label: 'HDR Blend' }],
    videos: [],
  },
  {
    id: 'p004',
    slug: 'lakefront-estate',
    title: 'Lakefront Estate',
    location: 'Lake Tahoe, NV',
    services: ['Day to Dusk', 'Drone'],
    cover: img('cs-lake-cover'),
    description:
      'A daytime aerial capture converted to a warm dusk mood, with drone frames color-matched to the ground set.',
    gallery: [img('cs-lake-1'), img('cs-lake-2'), img('cs-lake-3')],
    beforeAfter: [{ before: img('cs-lake-b1'), after: img('cs-lake-a1'), label: 'Day to Dusk' }],
    videos: [],
  },
  {
    id: 'p005',
    slug: 'desert-modern',
    title: 'Desert Modern',
    location: 'Scottsdale, AZ',
    services: ['Flambient', 'Twilight'],
    cover: img('cs-desert-cover'),
    description:
      'Low desert sun and deep shade in the same frame. Flambient blending holds shadow detail without losing the sky.',
    gallery: [img('cs-desert-1'), img('cs-desert-2'), img('cs-desert-3'), img('cs-desert-4')],
    beforeAfter: [{ before: img('cs-desert-b1'), after: img('cs-desert-a1'), label: 'Flambient' }],
    videos: [],
  },
  {
    id: 'p006',
    slug: 'brownstone-townhouse',
    title: 'Brownstone Townhouse',
    location: 'Brooklyn, NY',
    services: ['HDR', 'Virtual Staging'],
    cover: img('cs-brownstone-cover'),
    description:
      'Classic pre-war interiors with mixed lighting. Neutral color and subtle staging respect the period detail.',
    gallery: [img('cs-brownstone-1'), img('cs-brownstone-2'), img('cs-brownstone-3')],
    beforeAfter: [{ before: img('cs-brownstone-b1'), after: img('cs-brownstone-a1'), label: 'Staging' }],
    videos: [],
  },
]

// Homepage "Selected Work" shows the first N covers only.
export const featuredProjects = projects.slice(0, 6)

export const getProjectBySlug = (slug) => projects.find((p) => p.slug === slug)
