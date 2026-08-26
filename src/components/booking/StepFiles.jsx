import { useBooking } from '../../context/BookingContext'

export default function StepFiles() {
  const { order, updateNested } = useBooking()
  const { files } = order

  return (
    <div>
      <div className="field">
        <label className="field__label" htmlFor="file-link">Link to original files</label>
        <input
          id="file-link"
          className="field__input"
          type="url"
          placeholder="Google Drive, Dropbox, WeTransfer, OneDrive…"
          value={files.link}
          onChange={(e) => updateNested('files', { link: e.target.value })}
        />
        <p className="field__hint">Paste a shareable link. No large direct uploads needed.</p>
      </div>

      <div className="field">
        <label className="field__label" htmlFor="file-instructions">Editing instructions</label>
        <textarea
          id="file-instructions"
          className="field__textarea"
          placeholder="Tell us anything specific — sky preferences, brightness, items to remove, grouping by property…"
          value={files.instructions}
          onChange={(e) => updateNested('files', { instructions: e.target.value })}
        />
      </div>

      <div className="field">
        <label className="field__label" htmlFor="file-reference">Reference link (optional)</label>
        <input
          id="file-reference"
          className="field__input"
          type="url"
          placeholder="A gallery or example whose style you want matched"
          value={files.reference}
          onChange={(e) => updateNested('files', { reference: e.target.value })}
        />
      </div>
    </div>
  )
}
