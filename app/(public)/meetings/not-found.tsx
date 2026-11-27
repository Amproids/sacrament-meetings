import Link from 'next/link';

// Shown inside the meetings layout when a page calls notFound(),
// e.g. /meetings/999 or /meetings/abc.
export default function MeetingNotFound() {
  return (
    <div className="mx-auto max-w-xl border border-rule bg-card p-8 text-center">
      <h1 className="text-2xl text-brown">Meeting not found</h1>
      <p className="mt-3 text-muted">There is no meeting at this address.</p>
      <Link href="/meetings" className="mt-6 inline-block text-olive underline">
        View all meetings
      </Link>
    </div>
  );
}
