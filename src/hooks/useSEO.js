import { useEffect } from 'react'

/**
 * Lightweight per-page SEO without extra dependencies.
 * Sets document.title and the <meta name="description"> content.
 */
export function useSEO({ title, description }) {
  useEffect(() => {
    if (title) document.title = title

    if (description) {
      let tag = document.querySelector('meta[name="description"]')
      if (!tag) {
        tag = document.createElement('meta')
        tag.setAttribute('name', 'description')
        document.head.appendChild(tag)
      }
      tag.setAttribute('content', description)
    }
  }, [title, description])
}
