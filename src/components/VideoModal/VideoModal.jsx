import Modal from '../Modal/Modal'
import './VideoModal.css'

export default function VideoModal({ video, onClose }) {
  if (!video) return null
  return (
    <Modal open={!!video} onClose={onClose} label={video.title}>
      <div className="video-modal">
        <h2 className="h2 video-modal__title">{video.title}</h2>
        <div className="video-modal__player">
          <video src={video.src} poster={video.poster} controls autoPlay playsInline preload="metadata" />
        </div>
      </div>
    </Modal>
  )
}
