import Link from 'next/link';
import type { SacramentMeeting } from '@/lib/types';
import { formatMeetingDate } from '@/lib/dates';
import { MEETING_TYPE_LABELS } from '@/lib/labels';

interface MeetingCardProps {
  meeting: SacramentMeeting;
}

export default function MeetingCard({ meeting }: MeetingCardProps) {
  const speakerNames = meeting.speakers
    .filter((s) => s.type === 'speaker')
    .map((s) => s.name);

  return (
    // "relative" + the link's after:absolute makes the whole card clickable
    // while keeping a single, clearly named link for screen readers.
    <article className="relative h-full border border-rule bg-card p-5 transition-colors hover:border-brown focus-within:border-olive">
      <p className="text-xs tracking-[0.2em] text-olive uppercase">
        {MEETING_TYPE_LABELS[meeting.meetingType]}
      </p>

      <h2 className="mt-2 text-lg">
        <Link
          href={`/meetings/${meeting.id}`}
          className="text-ink after:absolute after:inset-0 hover:underline focus-visible:outline-none"
        >
          <time dateTime={meeting.date}>{formatMeetingDate(meeting.date)}</time>
        </Link>
      </h2>

      <dl className="mt-3 space-y-1 text-sm text-muted">
        <div>
          <dt className="inline">Conducting: </dt>
          <dd className="inline">{meeting.conducting}</dd>
        </div>
        {speakerNames.length > 0 && (
          <div>
            <dt className="inline">Speakers: </dt>
            <dd className="inline">{speakerNames.join(', ')}</dd>
          </div>
        )}
      </dl>
    </article>
  );
}
