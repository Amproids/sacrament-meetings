import type { NextRequest } from 'next/server';
import { searchMeetings } from '@/lib/meetings-db';
import { isValidISODate } from '@/lib/dates';
import { MAX_PAGE_SIZE, parseWholeNumber } from '@/lib/list-params';

// GET /api/meetings                    → all meetings, newest first
// GET /api/meetings?date=2026-05-03    → only meetings on that date
// GET /api/meetings?q=temple           → speaker, topic, or hymn title matches
// GET /api/meetings?page=2&limit=6     → one page of results
//
// The body is always an array of meetings. The X-Total-Count header holds
// the number of matches across all pages.
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const date = searchParams.get('date');
  const query = searchParams.get('q')?.trim() || undefined;
  const pageParam = searchParams.get('page');
  const limitParam = searchParams.get('limit');

  // Reject dates that aren't real YYYY-MM-DD dates instead of silently
  // returning an empty list (or letting Postgres fail on '2026-13-45').
  if (date !== null && !isValidISODate(date)) {
    return Response.json(
      { error: 'date must be in YYYY-MM-DD format' },
      { status: 400 },
    );
  }

  const page = pageParam === null ? 1 : parseWholeNumber(pageParam, 1, 999_999);
  if (page === null) {
    return Response.json({ error: 'page must be a positive whole number' }, { status: 400 });
  }

  const limit = limitParam === null ? null : parseWholeNumber(limitParam, 1, MAX_PAGE_SIZE);
  if (limit === null && limitParam !== null) {
    return Response.json(
      { error: `limit must be a whole number from 1 to ${MAX_PAGE_SIZE}` },
      { status: 400 },
    );
  }

  const { meetings, total } = await searchMeetings({
    date: date ?? undefined,
    query,
    page,
    limit,
  });
  return Response.json(meetings, {
    headers: { 'X-Total-Count': String(total) },
  });
}
