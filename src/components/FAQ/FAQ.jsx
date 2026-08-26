import { useState } from 'react'
import { faq } from '../../data/faq'
import './FAQ.css'

function Item({ item, isOpen, onToggle, id }) {
  return (
    <div className={`faq__item ${isOpen ? 'is-open' : ''}`}>
      <h3>
        <button
          className="faq__q"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={`${id}-panel`}
          id={`${id}-btn`}
        >
          <span>{item.q}</span>
          <span className="faq__icon" aria-hidden="true">{isOpen ? '−' : '+'}</span>
        </button>
      </h3>
      <div
        className="faq__panel"
        id={`${id}-panel`}
        role="region"
        aria-labelledby={`${id}-btn`}
        hidden={!isOpen}
      >
        <p>{item.a}</p>
      </div>
    </div>
  )
}

export default function FAQ() {
  const [open, setOpen] = useState(0)
  return (
    <section className="section faq" id="faq">
      <div className="container faq__wrap">
        <div className="faq__intro">
          <span className="label">Frequently asked questions</span>
          <h2 className="h2 faq__title">Everything you may want to know before your first project.</h2>
        </div>
        <div className="faq__list">
          {faq.map((item, i) => (
            <Item
              key={i}
              id={`faq-${i}`}
              item={item}
              isOpen={open === i}
              onToggle={() => setOpen(open === i ? -1 : i)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
