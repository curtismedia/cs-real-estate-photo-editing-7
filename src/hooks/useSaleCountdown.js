import { useEffect, useState } from 'react'

/**
 * Countdown to the next midnight in a fixed IANA timezone.
 *
 * The deadline is derived purely from the current instant and the timezone —
 * nothing is stored per visitor. No localStorage, no "24h from first visit",
 * no session state. Refreshing, closing the browser or opening the site from
 * another country all produce the SAME remaining time, because every client
 * is measuring the distance from `Date.now()` to the same absolute instant.
 *
 * DST is handled by resolving the wall-clock target back to a real instant in
 * two passes (see `instantForWallClock`), so the 23-hour and 25-hour days in
 * March and November come out right.
 */

const TZ_PARTS = (tz) =>
  new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })

/** Wall-clock fields in `tz` at instant `date`. */
function zonedParts(date, tz) {
  const parts = TZ_PARTS(tz)
    .formatToParts(date)
    .filter((p) => p.type !== 'literal')
  const o = Object.fromEntries(parts.map((p) => [p.type, Number(p.value)]))
  // Some engines render midnight as hour 24 under hour12:false.
  if (o.hour === 24) o.hour = 0
  return o
}

/** How far ahead of UTC `tz` is, in ms, at instant `date`. */
function offsetMs(date, tz) {
  const p = zonedParts(date, tz)
  const asUTC = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second)
  return asUTC - Math.floor(date.getTime() / 1000) * 1000
}

/**
 * The real instant at which the wall clock in `tz` reads the given fields.
 * Two passes: guess with the current offset, then correct using the offset
 * that actually applies at the guessed instant. That second pass is what makes
 * DST transitions land correctly.
 */
function instantForWallClock({ year, month, day }, tz, reference) {
  const wantUTC = Date.UTC(year, month - 1, day, 0, 0, 0)
  let guess = new Date(wantUTC - offsetMs(reference, tz))
  guess = new Date(wantUTC - offsetMs(guess, tz))
  return guess
}

/** Milliseconds from now until the next midnight in `tz`. */
export function msUntilNextMidnight(tz, now = new Date()) {
  const p = zonedParts(now, tz)
  // Next calendar day in the target zone. Date.UTC normalises month/year
  // rollover for us, so 31 Dec + 1 becomes 1 Jan of the next year.
  const nextDay = new Date(Date.UTC(p.year, p.month - 1, p.day + 1))
  const target = instantForWallClock(
    {
      year: nextDay.getUTCFullYear(),
      month: nextDay.getUTCMonth() + 1,
      day: nextDay.getUTCDate(),
    },
    tz,
    now
  )
  return Math.max(0, target.getTime() - now.getTime())
}

const pad = (n) => String(n).padStart(2, '0')

/** Split a duration into a zero-padded HH:MM:SS string. */
export function formatDuration(ms) {
  const total = Math.max(0, Math.floor(ms / 1000))
  return `${pad(Math.floor(total / 3600))}:${pad(Math.floor((total % 3600) / 60))}:${pad(total % 60)}`
}

/**
 * @param {string} timezone IANA zone, e.g. 'America/Chicago'
 * @returns {{ ms:number, text:string, ready:boolean }}
 */
export function useSaleCountdown(timezone) {
  // Start null so the server-rendered / first-paint markup never disagrees
  // with what the clock says a tick later.
  const [ms, setMs] = useState(null)

  useEffect(() => {
    let frame
    const tick = () => setMs(msUntilNextMidnight(timezone))
    tick()
    // Align to the second boundary so the digits change cleanly, then run 1/s.
    const id = setInterval(tick, 1000)
    // Re-sync when a backgrounded tab wakes up, where timers get throttled.
    const onVisible = () => {
      if (document.visibilityState === 'visible') tick()
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      clearInterval(id)
      cancelAnimationFrame(frame)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [timezone])

  return {
    ms: ms ?? 0,
    text: ms === null ? '' : formatDuration(ms),
    ready: ms !== null,
  }
}
