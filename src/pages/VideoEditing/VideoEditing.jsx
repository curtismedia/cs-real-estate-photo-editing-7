import { useSEO } from '../../hooks/useSEO'
import VideoPortfolio from '../../components/VideoPortfolio/VideoPortfolio'
import CTA from '../../components/CTA/CTA'
import { PLAYLIST_URL } from '../../data/videos'
import './VideoEditing.css'

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

      <section className="video-page">
        <div className="container">
          {/* Same component the Homepage popup renders. */}
          <VideoPortfolio context="page" />
        </div>
      </section>

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
