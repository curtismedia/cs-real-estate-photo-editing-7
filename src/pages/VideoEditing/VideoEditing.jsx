import { useState } from 'react'
import { useSEO } from '../../hooks/useSEO'
import CTA from '../../components/CTA/CTA'
import './VideoEditing.css'

// ---------------------------------------------------------------------------
// INTERIM IMPLEMENTATION — direct playlist embed.
//
// YouTube's own playlist player does the work here: it reads the playlist
// live, so adding a video on YouTube makes it appear on the site with no code
// change, no API key, no serverless function, no environment variables.
//
// Trade-off: a plain embed cannot tell us each video's aspect ratio, so the
// page cannot be split into "Property Videos" (16:9) and "Social Media Reels"
// (9:16) — that needs the YouTube Data API. To upgrade later, restore
// src/hooks/useYouTubePlaylist.js and netlify/functions/youtube-playlist.js;
// this file is the only one that then has to change.
// ---------------------------------------------------------------------------

const PLAYLIST_ID = 'PLNeKjdQzHAcs'
const PLAYLIST_URL = `https://www.youtube.com/playlist?list=${PLAYLIST_ID}`

export default function VideoEditing() {
  useSEO({
    title: 'Real Estate Video Editing Portfolio | CS',
    description:
      'Property films, listing videos and social reels edited for real estate photographers and media teams — colour grading, pacing, music and titles.',
  })

  // The iframe is only created once the visitor asks for it. Embedding the
  // player on page load pulls in several hundred KB of YouTube script for a
  // video that may never be watched.
  const [playing, setPlaying] = useState(false)

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

      <section className="video-group">
        <div className="container">
          <span className="label">Portfolio</span>
          <h2 className="h2 video-group__title">Selected video work</h2>
          <p className="muted video-group__blurb">
            Browse the full reel below. Use the playlist button in the player to jump
            between videos, or open the playlist on YouTube for a larger window.
          </p>

          <div className="video-embed">
            {playing ? (
              <iframe
                className="video-embed__player"
                src={`https://www.youtube-nocookie.com/embed/videoseries?list=${PLAYLIST_ID}&autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                title="CS Real Estate video portfolio"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                allowFullScreen
                loading="lazy"
              />
            ) : (
              <button
                type="button"
                className="video-embed__poster"
                onClick={() => setPlaying(true)}
                aria-label="Play the video portfolio"
              >
                <span className="video-embed__play" aria-hidden="true">
                  <svg width="26" height="26" viewBox="0 0 20 20">
                    <path d="M6 4l10 6-10 6z" fill="currentColor" />
                  </svg>
                </span>
                <span className="video-embed__cue">Play portfolio</span>
              </button>
            )}
          </div>

          <p className="video-embed__note muted">
            <a className="link" href={PLAYLIST_URL} target="_blank" rel="noopener noreferrer">
              Open the full playlist on YouTube <span className="arrow" aria-hidden="true">→</span>
            </a>
          </p>
        </div>
      </section>

      <CTA />
    </>
  )
}
