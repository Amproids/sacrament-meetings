import type { Metadata } from 'next';
import MeetingForm from '@/components/admin/MeetingForm';
import { toFormValues } from '@/lib/meeting-form';
import { createMeeting } from '../actions';

export const metadata: Metadata = {
  title: 'New meeting',
};

export default function NewMeetingPage() {
  return (
    <>
      <h1 className="mb-8 text-3xl text-brown">New meeting</h1>
      <MeetingForm action={createMeeting} initialValues={toFormValues()} submitLabel="Create meeting" />
    </>
  );
}
