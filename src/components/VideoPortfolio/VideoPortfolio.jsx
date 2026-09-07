import VideoTile from '../VideoTile/VideoTile'
import { landscapeVideos, verticalVideos } from '../../data/videos'
import './VideoPortfolio.css'

/**
 * The whole video portfolio, split by orientation.
 *
 * Rendered in two places from this one component — the /services/video-editing
 * page and the Video Editing popup — so the two can never drift apart and
 * adding a video to src/data/videos.js updates both at once.
 *
 * @param {'page'|'modal'} context  only affects heading colour and spacing;
 *                                  the grids themselves are identical.
 */
function Group({ label, title, blurb, videos, variant }) {
  if (!videos.length) return null
  return (
    <div className="vport__group">
      <span className="label">{label}</span>
      <h3 className="h2 vport__title">{title}</h3>
      {blurb && <p className="muted vport__blurb">{blurb}</p>}
      <div className={`vport__grid vport__grid--${variant}`}>
        {videos.map((v) => (
          <VideoTile key={v.youtubeId} video={v} />
        ))}
      </div>
    </div>
  )
}

export default function VideoPortfolio({ context = 'page' }) {
  return (
    <div className={`vport vport--${context}`}>
      <Group
        label="16:9"
        title="Property videos"
        blurb="Full listing films and walkthroughs, cut for websites, MLS and YouTube."
        videos={landscapeVideos}
        variant="wide"
      />
      <Group
        label="9:16"
        title="Social media reels"
        blurb="Vertical edits built for Instagram, TikTok and YouTube Shorts."
        videos={verticalVideos}
        variant="tall"
      />
    </div>
  )
}
