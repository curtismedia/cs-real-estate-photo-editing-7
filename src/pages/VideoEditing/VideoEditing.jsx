import { useSEO } from '../../hooks/useSEO'
import VideoTile from '../../components/VideoTile/VideoTile'
import CTA from '../../components/CTA/CTA'
import { landscapeVideos, verticalVideos, PLAYLIST_URL } from '../../data/videos'
import './VideoEditing.css'

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
            <VideoTile key={v.youtubeId} video={v} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default function VideoEditing() {
  useSEO({
    title: 'Real Estate Video Editing Portfolio | CS',
    description:
      'Property films, listing videos and social reels edited for real estate photographers and media teams — colour grading, pacing, music and titles.',
  })

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

      <VideoGroup
        label="16:9"
        title="Property videos"
        blurb="Full listing films and walkthroughs, cut for websites, MLS and YouTube."
        videos={landscapeVideos}
        variant="wide"
      />

      <VideoGroup
        label="9:16"
        title="Social media reels"
        blurb="Vertical edits built for Instagram, TikTok and YouTube Shorts."
        videos={verticalVideos}
        variant="tall"
      />

      <section className="video-outro">
        <div className="container">
          <a className="link" href={PLAYLIST_URL} target="_blank" rel="noopener noreferrer">
            Open the full playlist on YouTube <span className="arrow" aria-hidden="true">→</span>
          </a>
        </div>
      </section>

      <CTA />
    </>
  )
}
