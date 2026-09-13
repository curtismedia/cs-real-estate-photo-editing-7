// ---------------------------------------------------------------------------
// ASSET PATH — single place that turns a root-relative media path into one
// that resolves correctly under Vite's configured `base`.
//
// WHY THIS EXISTS
// Every real media path in this project (hero images, project galleries,
// service before/afters, the header logo, …) is written as a root-relative
// string like '/images/work/project-01/project-01-01.jpg'. That works when
// the site is hosted at the domain root (Netlify), but GitHub Pages project
// sites are served from a sub-path (e.g. /cs-real-estate-photo-editing-7/),
// so a literal '/images/...' resolves to the wrong place.
//
// `withBase()` rewrites such a path using `import.meta.env.BASE_URL`, which
// Vite derives from `base` in vite.config.js — currently
// '/cs-real-estate-photo-editing-7/' for the GitHub Pages test URL.
//
// CUSTOM DOMAIN LATER
// When you move to a custom domain, change ONE line in vite.config.js
// (`base: '/'`) and every path produced by this helper updates automatically
// — nothing in src/data or src/components needs to change.
// ---------------------------------------------------------------------------

/**
 * Resolve a root-relative asset path against the app's configured base URL.
 *
 * withBase('/images/hero/hero-01.webp')
 *   → '/cs-real-estate-photo-editing-7/images/hero/hero-01.webp'   (GitHub Pages)
 *   → '/images/hero/hero-01.webp'                                  (base: '/')
 *
 * Leaves absolute URLs (http/https, protocol-relative, data URIs) untouched,
 * since those already point somewhere real (e.g. YouTube thumbnails,
 * picsum.photos fallbacks) and must never be prefixed.
 *
 * @param {string} path root-relative path, e.g. '/images/work/project-01/…'
 */
export const withBase = (path) => {
  if (!path) return path
  // Already absolute (http:, https:, //, data:) — leave it alone.
  if (/^([a-z][a-z0-9+.-]*:)?\/\//i.test(path) || path.startsWith('data:')) {
    return path
  }

  const base = import.meta.env.BASE_URL // e.g. '/cs-real-estate-photo-editing-7/' or '/'
  const trimmedBase = base.endsWith('/') ? base.slice(0, -1) : base
  const trimmedPath = path.startsWith('/') ? path : `/${path}`

  return `${trimmedBase}${trimmedPath}`
}
