import { headers } from 'next/headers';
import type { SacramentMeeting } from './types';

/*
  Helpers for Server Components to call our own API routes.

  Server-side fetch() needs a full URL (there is no "current page" on the
  server to resolve '/api/meetings' against), so we build it from the
  incoming request's Host header. This works on localhost and on any
  Vercel preview URL without extra configuration.
*/
async function getBaseUrl(): Promise<string> {
  const h = await headers();
  const host = h.get('x-forwarded-host') ?? h.get('host') ?? 'localhost:3000';
  const protocol = (h.get('x-forwarded-proto') ?? 'http').split(',')[0];
  return `${protocol}://${host}`;
}

/** GET /api/meetings (optionally filtered by 'YYYY-MM-DD' date). */
export async function fetchMeetings(date?: string): Promise<SacramentMeeting[]> {
  const url = new URL('/api/meetings', await getBaseUrl());
  if (date) url.searchParams.set('date', date);

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to load meetings (HTTP ${res.status})`);
  }
  return (await res.json()) as SacramentMeeting[];
}

/**
 * GET /api/meetings/[id]. Returns null when the API says the id is invalid
 * (400) or doesn't exist (404), so the page can show a "not found" view.
 */
export async function fetchMeeting(id: string): Promise<SacramentMeeting | null> {
  const url = new URL(`/api/meetings/${encodeURIComponent(id)}`, await getBaseUrl());
  const res = await fetch(url);

  if (res.status === 400 || res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`Failed to load meeting ${id} (HTTP ${res.status})`);
  }
  return (await res.json()) as SacramentMeeting;
}
