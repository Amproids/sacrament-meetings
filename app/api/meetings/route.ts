import type { NextRequest } from 'next/server';
import { getMeetings } from '@/lib/meetings-db';
import type { SacramentMeeting } from '@/lib/types';

// GET /api/meetings              → all meetings, newest first
// GET /api/meetings?date=2026-05-03 → only meetings on that date
export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get('date');

  // Reject dates that aren't in YYYY-MM-DD format instead of silently
  // returning an empty list.
  if (date !== null && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return Response.json(
      { error: 'date must be in YYYY-MM-DD format' },
      { status: 400 },
    );
  }

  const meetings: SacramentMeeting[] = await getMeetings(date ?? undefined);
  return Response.json(meetings);
}
