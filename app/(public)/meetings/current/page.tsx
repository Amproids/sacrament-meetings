import Link from 'next/link';
import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import { getMeetings } from '@/lib/meetings-db';
import { formatMeetingDate, mostRecentSundayISO } from '@/lib/dates';

export default async function CurrentMeetingPage() {
  // Wait for a real request so "today" is today, not the build date.
  await connection();

  const sunday = mostRecentSundayISO();
  const [meeting] = await getMeetings(sunday);

  if (meeting) {
    redirect(`/meetings/${meeting.id}`);
  }

  // No meeting entered for this Sunday yet.
  return (
    <div className="mx-auto max-w-xl border border-rule bg-card p-8 text-center">
      <h1 className="text-2xl text-brown">No program yet</h1>
      <p className="mt-3 text-muted">
        No meeting has been planned for{' '}
        <time dateTime={sunday}>{formatMeetingDate(sunday)}</time>.
      </p>
      <Link href="/meetings" className="mt-6 inline-block text-olive underline">
        View all meetings
      </Link>
    </div>
  );
}
