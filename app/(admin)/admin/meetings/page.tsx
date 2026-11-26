import type { Metadata } from 'next';
import Link from 'next/link';
import DeleteMeetingButton from '@/components/admin/DeleteMeetingButton';
import MeetingSearch from '@/components/MeetingSearch';
import Pagination, { ResultSummary } from '@/components/Pagination';
import { parseListParams } from '@/lib/list-params';
import { searchMeetings } from '@/lib/meetings-db';
import { formatMeetingDate } from '@/lib/dates';
import { MEETING_TYPE_LABELS } from '@/lib/labels';
import { deleteMeeting } from './actions';

export const metadata: Metadata = {
  title: 'Manage meetings',
};

export default async function AdminMeetingsPage({ searchParams }: PageProps<'/admin/meetings'>) {
  const params = parseListParams(await searchParams);
  const { meetings, total } = await searchMeetings(params);

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl text-brown">Manage meetings</h1>
          <p className="mt-2 text-muted">Create, edit, or delete sacrament meeting programs.</p>
        </div>
        <Link
          href="/admin/meetings/new"
          className="border border-olive bg-olive px-5 py-2 text-sm tracking-[0.15em] text-card uppercase transition-colors hover:bg-olive-dark"
        >
          New meeting
        </Link>
      </div>

      <div className="mt-6 space-y-3">
        <MeetingSearch basePath="/admin/meetings" params={params} />
        <ResultSummary params={params} total={total} />
      </div>

      {meetings.length === 0 ? (
        <p className="mt-8 italic">
          {params.query || total > 0 ? 'No meetings to show.' : 'No meetings have been planned yet.'}
        </p>
      ) : (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full border border-rule bg-card text-left text-sm">
            <thead className="border-b border-rule text-xs tracking-[0.15em] text-muted uppercase">
              <tr>
                <th scope="col" className="px-4 py-3 font-normal">Date</th>
                <th scope="col" className="px-4 py-3 font-normal">Type</th>
                <th scope="col" className="px-4 py-3 font-normal">Conducting</th>
                <th scope="col" className="px-4 py-3 font-normal">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {meetings.map((meeting) => {
                const label = formatMeetingDate(meeting.date);
                return (
                  <tr key={meeting.id} className="border-b border-rule last:border-0">
                    <td className="px-4 py-3">
                      <time dateTime={meeting.date}>{label}</time>
                    </td>
                    <td className="px-4 py-3">{MEETING_TYPE_LABELS[meeting.meetingType]}</td>
                    <td className="px-4 py-3">{meeting.conducting}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-3">
                        <Link href={`/meetings/${meeting.id}`} className="text-muted hover:text-ink hover:underline">
                          View<span className="sr-only"> {label}</span>
                        </Link>
                        <Link
                          href={`/admin/meetings/${meeting.id}/edit`}
                          className="text-olive hover:text-olive-dark hover:underline"
                        >
                          Edit<span className="sr-only"> {label}</span>
                        </Link>
                        <DeleteMeetingButton action={deleteMeeting.bind(null, meeting.id)} meetingLabel={label} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Pagination basePath="/admin/meetings" params={params} total={total} />
    </>
  );
}
