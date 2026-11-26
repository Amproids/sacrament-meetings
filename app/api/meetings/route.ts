import type { NextRequest } from 'next/server';
import { getMeetings } from '@/lib/meetings-db';
import { isValidISODate } from '@/lib/dates';
import type { SacramentMeeting } from '@/lib/types';

// GET /api/meetings              → all meetings, newest first
// GET /api/meetings?date=2026-05-03 → only meetings on that date
export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get('date');

  // Reject dates that aren't real YYYY-MM-DD dates instead of silently
  // returning an empty list (or letting Postgres fail on '2026-13-45').
  if (date !== null && !isValidISODate(date)) {
    return Response.json(
      { error: 'date must be in YYYY-MM-DD format' },
      { status: 400 },
    );
  }

  const meetings: SacramentMeeting[] = await getMeetings(date ?? undefined);
  return Response.json(meetings);
}
