import type { Metadata } from 'next';
import { connection } from 'next/server';
import MeetingCard from '@/components/MeetingCard';
import { getMeetings } from '@/lib/meetings-db';

export const metadata: Metadata = {
  title: 'Meetings',
};

export default async function MeetingsPage() {
  // Read the database on each request, not once at build time.
  await connection();
  const meetings = await getMeetings();

  return (
    <>
      <h1 className="text-3xl text-brown">Meetings</h1>
      <p className="mt-2 text-muted">
        Select a Sunday to view or print its program.
      </p>

      {meetings.length === 0 ? (
        <p className="mt-8 italic">No meetings have been planned yet.</p>
      ) : (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {meetings.map((meeting) => (
            <li key={meeting.id}>
              <MeetingCard meeting={meeting} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
