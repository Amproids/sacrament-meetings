import type { NextRequest } from 'next/server';
import { getMeetingById } from '@/lib/meetings-db';

// GET /api/meetings/[id]
//   200 → the meeting
//   400 → id is not a whole number (e.g. /api/meetings/abc)
//   404 → no meeting with that id
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }, // params is a Promise in Next 15+
) {
  const { id } = await params;

  // Only digits allowed. This rejects 'abc', '1.5', '-1', and '1abc'
  // (parseInt('1abc') would wrongly return 1).
  if (!/^\d+$/.test(id)) {
    return Response.json(
      { error: 'Meeting id must be a positive whole number' },
      { status: 400 },
    );
  }

  const meeting = await getMeetingById(Number(id));

  if (!meeting) {
    return Response.json(
      { error: `No meeting found with id ${id}` },
      { status: 404 },
    );
  }

  return Response.json(meeting);
}
