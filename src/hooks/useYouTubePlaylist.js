import { useEffect, useState } from 'react'

/**
 * Loads the video list from the Netlify function at /api/youtube-playlist.
 *
 * The function talks to the YouTube Data API with a key held in a Netlify
 * environment variable, so nothing sensitive reaches the browser. Adding a
 * video to the playlist on YouTube is enough — no code change, no redeploy.
 * Results are cached at the CDN edge for 15 minutes.
 *
 * Three outcomes the UI has to handle, hence the explicit `status`:
 *   'loading'      – request in flight
 *   'ready'        – we have videos (possibly zero, if the playlist is empty)
 *   'unconfigured' – the API key has not been added yet
 *   'error'        – the API or the network failed
 */
export function useYouTubePlaylist() {
  const [state, setState] = useState({ status: 'loading', videos: [], message: '' })

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const res = await fetch('/api/youtube-playlist')
        // In `vite dev` the function isn't running, so the SPA fallback hands
        // back index.html. Guard against parsing HTML as JSON.
        const type = res.headers.get('content-type') || ''
        if (!type.includes('application/json')) {
          throw new Error('The playlist function is not running (expected on `vite dev`).')
        }
        const data = await res.json()
        if (cancelled) return

        if (data.configured === false) {
          setState({ status: 'unconfigured', videos: [], message: data.message || '' })
        } else if (data.error) {
          setState({ status: 'error', videos: [], message: data.message || '' })
        } else {
          setState({ status: 'ready', videos: data.videos || [], message: '' })
        }
      } catch (err) {
        if (!cancelled) {
          setState({ status: 'error', videos: [], message: String(err.message || err) })
        }
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return state
}
