// Serverless proxy for the YouTube Data API.
//
// The API key lives in a Netlify environment variable and never reaches the
// browser — a key shipped in the React bundle would be readable by anyone and
// could be used until the daily quota ran out.
//
// Flow: playlistItems.list → collect video ids → videos.list to get each
// video's real player dimensions, which is how we tell 16:9 apart from 9:16.
//
// SETUP (one time):
//   Netlify → Site configuration → Environment variables
//     YOUTUBE_API_KEY      = <key from Google Cloud>
//     YOUTUBE_PLAYLIST_ID  = PLNeKjdQzHAcs   (optional, this is the default)

const DEFAULT_PLAYLIST = 'PLNeKjdQzHAcs'
const API = 'https://www.googleapis.com/youtube/v3'

/** Cache at the CDN edge so repeat visitors don't spend quota. */
const CACHE_SECONDS = 900 // 15 minutes

const json = (statusCode, body, cache = false) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': cache
      ? `public, max-age=0, s-maxage=${CACHE_SECONDS}, stale-while-revalidate=86400`
      : 'no-store',
  },
  body: JSON.stringify(body),
})

/**
 * Ask the API to size the player to a fixed height. YouTube returns an iframe
 * whose width reflects the video's real aspect ratio, which is the only
 * dependable way to detect a vertical upload — thumbnails are always
 * letterboxed to 16:9 and tell us nothing.
 */
function aspectFromEmbed(embedHtml) {
  if (!embedHtml) return null
  const w = Number((embedHtml.match(/width="(\d+)"/) || [])[1])
  const h = Number((embedHtml.match(/height="(\d+)"/) || [])[1])
  if (!w || !h) return null
  return w / h
}

async function getJSON(url) {
  const res = await fetch(url)
  const data = await res.json()
  if (!res.ok) {
    const reason = data?.error?.message || `HTTP ${res.status}`
    throw new Error(reason)
  }
  return data
}

export async function handler() {
  const key = process.env.YOUTUBE_API_KEY
  const playlistId = process.env.YOUTUBE_PLAYLIST_ID || DEFAULT_PLAYLIST

  if (!key) {
    // Not an error the visitor caused — the page renders a calm empty state.
    return json(200, {
      videos: [],
      configured: false,
      message:
        'YOUTUBE_API_KEY is not set. Add it in Netlify → Environment variables, then redeploy.',
    })
  }

  try {
    // --- 1. Every item in the playlist (paginated, 50 at a time) -----------
    const items = []
    let pageToken = ''
    do {
      const url =
        `${API}/playlistItems?part=snippet,contentDetails&maxResults=50` +
        `&playlistId=${encodeURIComponent(playlistId)}&key=${key}` +
        (pageToken ? `&pageToken=${pageToken}` : '')
      const page = await getJSON(url)
      items.push(...(page.items || []))
      pageToken = page.nextPageToken || ''
    } while (pageToken && items.length < 200)

    const ids = items
      .map((i) => i.contentDetails?.videoId)
      .filter(Boolean)

    if (!ids.length) {
      return json(200, { videos: [], configured: true, message: 'Playlist is empty.' }, true)
    }

    // --- 2. Player dimensions for each video, 50 ids per request ----------
    const details = new Map()
    for (let i = 0; i < ids.length; i += 50) {
      const batch = ids.slice(i, i + 50).join(',')
      const url =
        `${API}/videos?part=player,snippet,status&maxHeight=720` +
        `&id=${batch}&key=${key}`
      const page = await getJSON(url)
      for (const v of page.items || []) details.set(v.id, v)
    }

    // --- 3. Shape it for the front end ------------------------------------
    const videos = ids
      .map((id) => {
        const v = details.get(id)
        // Private or deleted entries still appear in the playlist; drop them
        // rather than rendering a dead tile.
        if (!v || v.status?.privacyStatus === 'private') return null

        const ratio = aspectFromEmbed(v.player?.embedHtml)
        const t = v.snippet?.thumbnails || {}
        return {
          id,
          title: v.snippet?.title || '',
          // Highest quality thumbnail that exists for this video.
          thumbnail:
            t.maxres?.url || t.standard?.url || t.high?.url || t.medium?.url || '',
          aspect: ratio || 16 / 9,
          // Anything narrower than square is treated as a reel.
          orientation: ratio && ratio < 1 ? 'vertical' : 'horizontal',
        }
      })
      .filter(Boolean)

    return json(200, { videos, configured: true, playlistId }, true)
  } catch (err) {
    return json(200, {
      videos: [],
      configured: true,
      error: true,
      message: String(err.message || err),
    })
  }
}
