/**
 * Discount badge. Colour is driven by the percentage alone, so every card in
 * the wizard, the review step and anywhere else stays consistent without
 * components choosing their own colours.
 *
 *   15% → sale--15 (deep red)
 *   10% → sale--10 (deep green)
 *
 * Anything else falls back to the neutral variant rather than inventing a
 * colour, so an unexpected value is visible rather than silently mis-styled.
 */
const VARIANTS = { 15: 'sale--15', 10: 'sale--10' }

export default function DiscountBadge({ percent, className = '' }) {
  if (!percent) return null
  const variant = VARIANTS[percent] || 'sale--neutral'
  return (
    <span className={`sale-badge ${variant} ${className}`.trim()}>
      {percent}% OFF
    </span>
  )
}
