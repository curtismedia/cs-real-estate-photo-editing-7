import { useState } from 'react'
import { useSEO } from '../../hooks/useSEO'
import { useYouTubePlaylist } from '../../hooks/useYouTubePlaylist'
import CTA from '../../components/CTA/CTA'
import './VideoEditing.css'

/**
 * One tile. Shows the thumbnail until the visitor clicks, then swaps in the
 * YouTube iframe with autoplay. Loading 30 iframes up front would pull in
 * megabytes of YouTube's player for videos nobody watches, so the embed is
 * created on demand — one per tile, only once.
 */
function VideoTile({ video }) {
  const [playing, setPlaying] = useState(false)

  return (
    <figure className="video-tile">
      <div className="video-tile__frame">
        {playing ? (
          <iframe
            className="video-tile__player"
            src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
            title={video.title}
            /* `fullscreen` is what actually enables the fullscreen button. */
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
            allowFullScreen
            loading="lazy"
          />
        ) : (
          <button
            type="button"
            className="video-tile__poster"
            onClick={() => setPlaying(true)}
            aria-label={`Play ${video.title}`}
          >
            {video.thumbnail && (
              <img src={video.thumbnail} alt="" loading="lazy" decoding="async" />
            )}
            <span className="video-tile__play" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 20 20">
                <path d="M6 4l10 6-10 6z" fill="currentColor" />
              </svg>
            </span>
          </button>
        )}
      </div>
      <figcaption className="video-tile__title muted">{video.title}</figcaption>
    </figure>
  )
}

function VideoGroup({ label, title, blurb, videos, variant }) {
  if (!videos.length) return null
  return (
    <section className="video-group">
      <div className="container">
        <span className="label">{label}</span>
        <h2 className="h2 video-group__title">{title}</h2>
        <p className="muted video-group__blurb">{blurb}</p>
        <div className={`video-grid video-grid--${variant}`}>
          {videos.map((v) => (
            <VideoTile key={v.id} video={v} />
          ))}
        </div>
      </div>
    </section>
  )
}

const PLAYLIST_URL = 'https://www.youtube.com/playlist?list=PLNeKjdQzHAcs'

export default function VideoEditing() {
  useSEO({
    title: 'Real Estate Video Editing Portfolio | CS',
    description:
      'Property films, listing videos and social reels edited for real estate photographers and media teams — colour grading, pacing, music and titles.',
  })

  const { status, videos, message } = useYouTubePlaylist()

  // Aspect ratio comes from the API, so a vertical reel is never cropped into
  // a landscape box or stretched to fill one.
  const horizontal = videos.filter((v) => v.orientation === 'horizontal')
  const vertical = videos.filter((v) => v.orientation === 'vertical')

  return (
    <>
      <section className="page-intro">
        <div className="container">
          <span className="label">Video editing</span>
          <h1 className="display page-intro__title">
            Property films cut<br />to sell the space.
          </h1>
          <p className="lead page-intro__lead">
            Full-length listing films, agent-branded walkthroughs and short social edits —
            colour graded, paced and titled so the home reads well on every screen.
          </p>
        </div>
      </section>

      {status === 'loading' && (
        <section className="video-group">
          <div className="container">
            <p className="muted">Loading portfolio…</p>
          </div>
        </section>
      )}

      {status === 'ready' && (
        <>
          <VideoGroup
            label="16:9"
            title="Property videos"
            blurb="Full listing films and walkthroughs, cut for websites, MLS and YouTube."
            videos={horizontal}
            variant="wide"
          />
          <VideoGroup
            label="9:16"
            title="Social media reels"
            blurb="Vertical edits built for Instagram, TikTok and YouTube Shorts."
            videos={vertical}
            variant="tall"
          />
          {!videos.length && (
            <section className="video-group">
              <div className="container">
                <p className="muted">
                  No videos in the portfolio yet.{' '}
                  <a className="link" href={PLAYLIST_URL} target="_blank" rel="noopener noreferrer">
                    View the playlist <span className="arrow" aria-hidden="true">→</span>
                  </a>
                </p>
              </div>
            </section>
          )}
        </>
      )}

      {(status === 'unconfigured' || status === 'error') && (
        <section className="video-group">
          <div className="container">
            <div className="video-notice">
              <p className="muted">
                The video portfolio is temporarily unavailable.{' '}
                <a className="link" href={PLAYLIST_URL} target="_blank" rel="noopener noreferrer">
                  Watch it on YouTube <span className="arrow" aria-hidden="true">→</span>
                </a>
              </p>
              {/* Diagnostic for whoever is maintaining the site, hidden from
                  the page but visible in the DOM and the console. */}
              {message && <p hidden>{message}</p>}
            </div>
          </div>
        </section>
      )}

      <CTA />
    </>
  )
}
