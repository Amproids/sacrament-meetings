import type { Metadata } from 'next';
import MeetingCard from '@/components/MeetingCard';
import { fetchMeetings } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Meetings',
};

export default async function MeetingsPage() {
  const meetings = await fetchMeetings(); // GET /api/meetings

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
