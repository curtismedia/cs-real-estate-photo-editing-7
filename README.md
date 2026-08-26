# CS Real Estate Photo Editing

Premium multi-page marketing + conversion website. React + Vite + React Router.

## Run locally

```bash
npm install        # install dependencies (creates node_modules)
npm run dev        # start local dev server (usually http://localhost:5173)
npm run build      # production build → dist/
npm run preview    # preview the production build locally
```

## Deploy (Netlify)

- **Build command:** `npm run build`
- **Publish directory:** `dist`
- SPA routing is handled by `netlify.toml` and `public/_redirects` (both send
  unknown paths to `index.html` so `/work`, `/services`, `/book` etc. survive a
  browser refresh).

## What to push to GitHub

Push **everything except** `node_modules` and `dist` (already listed in
`.gitignore`). Netlify installs dependencies and builds from source itself.

## Where to edit content (no layout changes needed)

All content lives in `src/data/`:

- `siteData.js` — brand name, navigation, contact details, CTAs
- `projects.js` — portfolio projects (cover, gallery, before/after, video)
- `services.js` — services (photo vs video, examples)
- `testimonials.js` — testimonial carousel
- `clients.js` — "Trusted by" marquee
- `faq.js` — FAQ accordion
- `pricing.js` — all rates + the live estimate calculation

## Replace placeholder media

Images currently use `picsum.photos` placeholders and sample videos. Replace the
URLs in the data files (and `src/components/Hero/Hero.jsx`) with your own hosted
media — external CDN / image host / video host URLs are fully supported.

## Connect the contact form / booking submissions (later)

The Contact form and Booking wizard currently show a success state without a
backend. To receive submissions, connect Netlify Forms, Formspree, or your own
endpoint. For real payments, integrate Stripe Checkout — never handle card data
in the frontend.

---

## Booking, Free Test & Contact forms (Netlify Forms)

Three forms are wired to Netlify Forms:

| Form name | Used by | Route |
|---|---|---|
| `project-booking` | Booking wizard | `/book` |
| `free-test-request` | Free test wizard | `/free-test` |
| `contact-message` | Contact page | `/contact` |

**How it works.** Netlify's build bot only detects forms in static HTML, and React
renders at runtime — so `index.html` contains one hidden static form per form name
listing every field. The React app then POSTs url-encoded data to `/` with a
matching `form-name` (see `src/lib/netlifyForms.js`).

> **Do not delete the hidden `<form>` blocks in `index.html`.** Removing them
> silently stops submissions from being stored. If you add a field to a payload in
> `src/lib/bookingSubmission.js`, add the same field name to the matching hidden form.

**Forms do not work in local dev** (`npm run dev`) — there is no Netlify form
handler running, so submissions will show the error state. Test on a deploy preview
or the live site.

### Enabling email notifications (manual — must be done in the Netlify dashboard)

Netlify does not allow notification recipients to be set from repository code.
After deploying:

1. Go to <https://app.netlify.com> and open this site.
2. Click **Forms** in the left sidebar (or **Project configuration → Forms**).
3. Confirm `project-booking`, `free-test-request` and `contact-message` are listed.
   They only appear after a deploy that includes `index.html`.
4. Go to **Project configuration → Notifications → Emails and webhooks**.
5. Click **Add notification → Email notification**.
6. Set **Event to listen for** = `New form submission`,
   **Form** = `project-booking`,
   **Email to notify** = `curtisvisuals.sales@gmail.com`. Save.
7. Repeat steps 5–6 for `free-test-request` and `contact-message`.

Submissions are always stored under **Forms** even if email notifications are off.

## Replacing placeholder media

No fake image files are committed. Every media path goes through
`resolveMedia()` in `src/data/media.js`, which serves a temporary remote
fallback until you upload the real files.

1. Add your files to the matching folder under `public/`:
   - `public/images/hero/hero-01.webp` … `hero-04.webp`
   - `public/images/home/approach.webp`
   - `public/images/services/<slug>/cover.webp`, `before-01.webp`, `after-01.webp`, …
     (slugs: `video-editing`, `virtual-staging`, `hdr`, `object-removal`,
     `flambient`, `twilight`, `day-to-dusk`, `drone-aerial`, `single`, `floor-plan`)
2. Flip that folder's flag in `LOCAL_MEDIA_READY` (`src/data/media.js`) to `true`.

Nothing else needs changing. Flags are per-folder, so you can switch services over
one at a time.

## Changing prices

All pricing lives in `src/data/pricing.js` (`serviceRates`). Fixed-price services
use `type: 'fixed'`; variable services use `type: 'range'` with `min`/`max` and are
always displayed as estimates. No component hard-codes a price.
