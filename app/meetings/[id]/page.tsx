import Link from 'next/link';
import { notFound } from 'next/navigation';
import MeetingDetail from '@/components/MeetingDetail';
import PrintButton from '@/components/PrintButton';
import { fetchMeeting } from '@/lib/api';

export default async function MeetingPage({ params }: PageProps<'/meetings/[id]'>) {
  const { id } = await params; // params is a Promise in Next 15+
  const meeting = await fetchMeeting(id); // GET /api/meetings/[id]

  // The API returned 400 or 404 → show the not-found page.
  if (!meeting) notFound();

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 print:hidden">
        <Link href="/meetings" className="text-sm text-muted hover:text-ink hover:underline">
          ← All meetings
        </Link>
        <PrintButton />
      </div>
      <MeetingDetail meeting={meeting} />
    </>
  );
}
