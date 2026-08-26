// TESTIMONIALS — shown in the infinite horizontal carousel.
// Add or remove objects freely; the carousel loops automatically.

const avatar = (seed) => `https://picsum.photos/seed/${seed}/200/200`

export const testimonials = [
  {
    id: 't1',
    quote:
      'CS turned around a full twilight set overnight and matched our house style exactly. Our agents noticed the difference immediately.',
    name: 'Marcus Reed',
    role: 'Owner',
    company: 'Reed Property Media',
    photo: avatar('cs-t1'),
  },
  {
    id: 't2',
    quote:
      'The virtual staging is the most realistic I have used. No weird shadows, no fake perspective — clients believe it is real furniture.',
    name: 'Elena Vasquez',
    role: 'Listing Photographer',
    company: 'EV Studio',
    photo: avatar('cs-t2'),
  },
  {
    id: 't3',
    quote:
      'We send hundreds of images a month and the consistency never slips. It feels like an in-house editing team, not an outsource.',
    name: 'Daniel Okafor',
    role: 'Production Lead',
    company: 'Skyline Visuals',
    photo: avatar('cs-t3'),
  },
  {
    id: 't4',
    quote:
      'Their video edits made our listing films look like commercials. Pacing, color, music — all handled with taste.',
    name: 'Sophie Laurent',
    role: 'Marketing Director',
    company: 'Maison Realty',
    photo: avatar('cs-t4'),
  },
  {
    id: 't5',
    quote:
      'The free test sold me in a day. Same photos, completely different feeling. We have been a client ever since.',
    name: 'Ryan Mitchell',
    role: 'Real Estate Photographer',
    company: 'Mitchell Media',
    photo: avatar('cs-t5'),
  },
]
