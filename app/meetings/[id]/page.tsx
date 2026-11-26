import Link from 'next/link';
import { notFound } from 'next/navigation';
import MeetingDetail from '@/components/MeetingDetail';
import PrintButton from '@/components/PrintButton';
import { getMeetingById } from '@/lib/meetings-db';

export default async function MeetingPage({ params }: PageProps<'/meetings/[id]'>) {
  const { id } = await params; // params is a Promise in Next 15+
  // Only digits allowed, same as the API route ('abc', '1.5', '1abc' → 404).
  const meeting = /^\d+$/.test(id) ? await getMeetingById(Number(id)) : undefined;

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
