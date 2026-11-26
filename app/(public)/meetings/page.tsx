import type { Metadata } from 'next';
import Link from 'next/link';
import MeetingCard from '@/components/MeetingCard';
import MeetingSearch from '@/components/MeetingSearch';
import Pagination, { ResultSummary } from '@/components/Pagination';
import { listHref, parseListParams } from '@/lib/list-params';
import { searchMeetings } from '@/lib/meetings-db';

export const metadata: Metadata = {
  title: 'Meetings',
};

// /meetings?q=temple&page=2&limit=6
export default async function MeetingsPage({ searchParams }: PageProps<'/meetings'>) {
  // searchParams only exists at request time, so this page reads the
  // database per request rather than at build time.
  const params = parseListParams(await searchParams);
  const { meetings, total } = await searchMeetings(params);

  return (
    <>
      <h1 className="text-3xl text-brown">Meetings</h1>
      <p className="mt-2 text-muted">
        Select a Sunday to view or print its program.
      </p>

      <div className="mt-6 space-y-3">
        <MeetingSearch basePath="/meetings" params={params} />
        <ResultSummary params={params} total={total} />
      </div>

      {meetings.length === 0 ? (
        <p className="mt-8 italic">
          {total > 0 ? (
            <>
              There are no meetings on this page.{' '}
              <Link href={listHref('/meetings', { ...params, page: 1 })} className="text-olive underline">
                Go to the first page
              </Link>
              .
            </>
          ) : params.query ? (
            'No meetings match your search.'
          ) : (
            'No meetings have been planned yet.'
          )}
        </p>
      ) : (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {meetings.map((meeting) => (
            <li key={meeting.id}>
              <MeetingCard meeting={meeting} />
            </li>
          ))}
        </ul>
      )}

      <Pagination basePath="/meetings" params={params} total={total} />
    </>
  );
}
