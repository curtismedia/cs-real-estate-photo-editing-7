// ---------------------------------------------------------------------------
// VIDEO EDITING — single source of truth for every video on the site.
//
// The Homepage service card, the Services page row, the service popup and
// /services/video-editing all read from this one array. Change the first entry
// and every cover image on the site follows automatically.
//
// WHY IT IS A LIST AND NOT AN API CALL
// There is no way to read a YouTube playlist from the browser without an API
// key, so the ids below were taken from the playlist and are kept here by
// hand. Adding a video is a two-line edit — see below.
//
// TO ADD A VIDEO
//   1. Upload to YouTube and add it to the playlist.
//   2. Copy the id out of the watch URL:
//        https://www.youtube.com/watch?v=hv8uB-yCSgY  →  hv8uB-yCSgY
//   3. Append an entry here with a title and the orientation.
//        'landscape' = normal 16:9 property video
//        'vertical'  = 9:16 reel / YouTube Short
//   4. Order matters: entry [0] is the cover used across the site.
//
// UPGRADE PATH
// When a YouTube Data API key is available, this file can be replaced by a
// fetch that returns the same shape. Nothing else has to change.
// ---------------------------------------------------------------------------

export const PLAYLIST_ID = 'PLNeKjdQzHAcs'
export const PLAYLIST_URL = `https://www.youtube.com/playlist?list=${PLAYLIST_ID}`

export const videoEditingVideos = [
  { youtubeId: 'hv8uB-yCSgY', title: '137 Currey Rd, Wongawallan', orientation: 'landscape' },
  { youtubeId: 'EoNcBg9hdv4', title: '1953 Andover Dr, Ypsilanti, MI', orientation: 'landscape' },
  { youtubeId: 'TVH7id6KFoA', title: '717 Springwater', orientation: 'landscape' },
  { youtubeId: 'bmTsHupoWkQ', title: '1410 Pearl St, Alameda, CA', orientation: 'landscape' },
  { youtubeId: 'w4taqXGd2lI', title: '1245 S Grape St', orientation: 'landscape' },
  { youtubeId: '7fFoTw5anmU', title: 'Feature 2', orientation: 'landscape' },
  { youtubeId: 'o3mbAyiMfMY', title: 'Feature 12', orientation: 'landscape' },
  { youtubeId: 'BloUaL74eSA', title: 'Feature 14', orientation: 'vertical' },
  { youtubeId: 'JeDKP_pK5Ms', title: '32 Rancocas Blvd, Mount Laurel, NJ', orientation: 'vertical' },
]

/**
 * Best available still for a video.
 *
 * maxresdefault only exists for videos uploaded above 720p; for the rest
 * YouTube returns a 404 placeholder. The <img> onError handler in the UI
 * falls back to hqdefault, which exists for every public video.
 */
export const thumbnailFor = (youtubeId) =>
  `https://i.ytimg.com/vi/${youtubeId}/maxresdefault.jpg`

export const thumbnailFallbackFor = (youtubeId) =>
  `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`

/** Privacy-preserving embed; no cookies are set until playback starts. */
export const embedFor = (youtubeId) =>
  `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`

export const landscapeVideos = videoEditingVideos.filter((v) => v.orientation === 'landscape')
export const verticalVideos = videoEditingVideos.filter((v) => v.orientation === 'vertical')

/** Cover used by the Homepage card, the Services row and anywhere else. */
export const videoCover = thumbnailFor(videoEditingVideos[0].youtubeId)
