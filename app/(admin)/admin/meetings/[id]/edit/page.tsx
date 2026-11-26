import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import DeleteMeetingButton from '@/components/admin/DeleteMeetingButton';
import MeetingForm from '@/components/admin/MeetingForm';
import { getMeetingById } from '@/lib/meetings-db';
import { formatMeetingDate } from '@/lib/dates';
import { toFormValues } from '@/lib/meeting-form';
import { deleteMeeting, updateMeeting } from '../../actions';

export const metadata: Metadata = {
  title: 'Edit meeting',
};

export default async function EditMeetingPage({ params }: PageProps<'/admin/meetings/[id]/edit'>) {
  const { id } = await params;
  const meeting = /^\d+$/.test(id) ? await getMeetingById(Number(id)) : undefined;

  if (!meeting) notFound();

  const label = formatMeetingDate(meeting.date);

  return (
    <>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl text-brown">Edit meeting</h1>
          <p className="mt-2 text-muted">
            <time dateTime={meeting.date}>{label}</time>
          </p>
        </div>
        <DeleteMeetingButton action={deleteMeeting.bind(null, meeting.id)} meetingLabel={label} />
      </div>
      <MeetingForm
        action={updateMeeting.bind(null, meeting.id)}
        initialValues={toFormValues(meeting)}
        submitLabel="Save changes"
      />
    </>
  );
}
