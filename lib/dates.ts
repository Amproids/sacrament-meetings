// The ward's local time zone. Servers (like Vercel) run in UTC, so without
// this, "today" would flip to tomorrow on Saturday evening in Utah/Idaho.
export const WARD_TIME_ZONE = 'America/Denver';

/** Today's date in the ward's time zone, as 'YYYY-MM-DD'. */
export function todayISO(now: Date = new Date()): string {
  // The 'en-CA' locale formats dates as YYYY-MM-DD.
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: WARD_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
}

/**
 * The most recent Sunday (today, if today is Sunday), as 'YYYY-MM-DD'.
 */
export function mostRecentSundayISO(now: Date = new Date()): string {
  const [year, month, day] = todayISO(now).split('-').map(Number);

  // Work in UTC so the server's own time zone can't shift the date.
  const date = new Date(Date.UTC(year, month - 1, day));
  const dayOfWeek = date.getUTCDay(); // 0 = Sunday, 6 = Saturday

  date.setUTCDate(date.getUTCDate() - dayOfWeek);
  return date.toISOString().slice(0, 10);
}

/** True for a real calendar date in 'YYYY-MM-DD' form (rejects '2026-02-30'). */
export function isValidISODate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.toISOString().slice(0, 10) === value;
}

/** Formats 'YYYY-MM-DD' for display, e.g. 'Sunday, November 8, 2026'. */
export function formatMeetingDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString('en-US', {
    timeZone: 'UTC',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
