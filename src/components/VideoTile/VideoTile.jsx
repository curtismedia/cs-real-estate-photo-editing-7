import { useState } from 'react'
import { thumbnailFor, thumbnailFallbackFor, embedFor } from '../../data/videos'
import './VideoTile.css'

/**
 * One video card: thumbnail first, iframe only after the visitor clicks.
 *
 * Rendering nine YouTube iframes on load would pull in the player script nine
 * times over for videos nobody may watch, so the embed is created on demand —
 * one per tile, once.
 */
export default function VideoTile({ video, className = '' }) {
  const [playing, setPlaying] = useState(false)
  const [src, setSrc] = useState(thumbnailFor(video.youtubeId))

  return (
    <figure className={`vtile ${className}`.trim()}>
      <div className={`vtile__frame vtile__frame--${video.orientation}`}>
        {playing ? (
          <iframe
            className="vtile__player"
            src={embedFor(video.youtubeId)}
            title={video.title}
            /* `fullscreen` in allow, plus allowFullScreen, is what actually
               enables the fullscreen button inside the player. */
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
            allowFullScreen
            loading="lazy"
          />
        ) : (
          <button
            type="button"
            className="vtile__poster"
            onClick={() => setPlaying(true)}
            aria-label={`Play ${video.title}`}
          >
            <img
              src={src}
              alt=""
              loading="lazy"
              decoding="async"
              /* maxresdefault is missing for anything uploaded below 720p;
                 hqdefault always exists. */
              onError={() => setSrc(thumbnailFallbackFor(video.youtubeId))}
            />
            <span className="vtile__play" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 20 20">
                <path d="M6 4l10 6-10 6z" fill="currentColor" />
              </svg>
            </span>
          </button>
        )}
      </div>
      {video.title && <figcaption className="vtile__title muted">{video.title}</figcaption>}
    </figure>
  )
}
