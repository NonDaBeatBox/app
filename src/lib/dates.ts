// ---------------------------------------------------------------------------
// Small, dependency-free date helpers. All "dates" are local YYYY-MM-DD
// strings so check-ins line up with the member's own calendar day. We build
// Date objects at local noon to sidestep DST / off-by-one-hour surprises.
// ---------------------------------------------------------------------------

/** Format a Date as a local YYYY-MM-DD string. */
export function isoDate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** Today as a local YYYY-MM-DD string. */
export function todayISO(): string {
  return isoDate(new Date())
}

/** Parse a YYYY-MM-DD string to a local Date at noon. */
export function parseISO(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d, 12, 0, 0, 0)
}

/** Add (or subtract) whole days to a YYYY-MM-DD string. */
export function addDays(iso: string, n: number): string {
  const d = parseISO(iso)
  d.setDate(d.getDate() + n)
  return isoDate(d)
}

/** Yesterday relative to a YYYY-MM-DD string (default: today). */
export function yesterdayISO(iso: string = todayISO()): string {
  return addDays(iso, -1)
}

/**
 * The last `n` calendar days ending at (and including) `end`.
 * Returned oldest-first, e.g. lastNDays('2026-07-13', 3) ->
 * ['2026-07-11','2026-07-12','2026-07-13'].
 */
export function lastNDays(end: string, n: number): string[] {
  const out: string[] = []
  for (let i = n - 1; i >= 0; i--) out.push(addDays(end, -i))
  return out
}

/** 0 = Sunday ... 6 = Saturday. */
export function dayOfWeek(iso: string): number {
  return parseISO(iso).getDay()
}

/** Monday–Friday. */
export function isWeekday(iso: string): boolean {
  const d = dayOfWeek(iso)
  return d >= 1 && d <= 5
}

/**
 * Is `iso` a scheduled day for the given frequency?
 * daily -> every day; weekdays -> Mon–Fri.
 */
export function isScheduledDay(
  iso: string,
  frequency: 'daily' | 'weekdays',
): boolean {
  return frequency === 'daily' ? true : isWeekday(iso)
}

/** Count scheduled days within a window (inclusive). */
export function scheduledDaysIn(
  days: string[],
  frequency: 'daily' | 'weekdays',
): number {
  return days.filter((d) => isScheduledDay(d, frequency)).length
}

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
/** Short weekday label, e.g. 'Mon'. */
export function weekdayLabel(iso: string): string {
  return WEEKDAY_LABELS[dayOfWeek(iso)]
}

/** Single-letter weekday, e.g. 'M'. */
export function weekdayLetter(iso: string): string {
  return weekdayLabel(iso).charAt(0)
}

/** Human relative time for chat, e.g. "now", "5m", "2h", "3d". */
export function relativeTime(iso: string, now: Date = new Date()): string {
  const then = new Date(iso).getTime()
  const diff = Math.max(0, now.getTime() - then)
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'now'
  if (mins < 60) return `${mins}m`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d`
  return `${Math.floor(days / 7)}w`
}
