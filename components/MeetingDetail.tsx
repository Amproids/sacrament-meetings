import type { ReactNode } from 'react';
import type { Hymn, SacramentMeeting } from '@/lib/types';
import { formatMeetingDate } from '@/lib/dates';
import { MEETING_TYPE_LABELS, WARD_NAME, isSacramentMeeting } from '@/lib/labels';

interface MeetingDetailProps {
  meeting: SacramentMeeting;
}

interface ProgramRowProps {
  label: string;
  children: ReactNode;
  /** Optional smaller line under the value (e.g. a talk topic). */
  note?: string;
}

/**
 * One line of the printed program: "Opening Hymn ........ No. 85 ...".
 * Must be rendered inside a <dl>. The dotted leader is drawn with the
 * dt's ::after pseudo-element so the markup stays a valid dt/dd pair.
 */
function ProgramRow({ label, children, note }: ProgramRowProps) {
  return (
    <div className="flex items-baseline gap-3 py-1.5 print:py-1">
      <dt className="flex flex-1 items-baseline gap-3 text-muted after:min-w-6 after:flex-1 after:border-b after:border-dotted after:border-brown/50">
        {label}
      </dt>
      <dd className="max-w-[60%] text-right">
        {children}
        {note && <span className="block text-sm text-muted italic">{note}</span>}
      </dd>
    </div>
  );
}

function HymnText({ hymn }: { hymn: Hymn }) {
  return (
    <>
      <span className="text-sm text-muted">No. {hymn.number}</span>{' '}
      <span className="italic">{hymn.title}</span>
    </>
  );
}

function SectionHeading({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2
      id={id}
      className="mb-3 text-center text-xs tracking-[0.3em] text-olive uppercase"
    >
      {children}
    </h2>
  );
}

/** Centered italic line for program items without a person attached. */
function ProgramNote({ children }: { children: ReactNode }) {
  return <p className="py-3 text-center italic text-brown">{children}</p>;
}

export default function MeetingDetail({ meeting }: MeetingDetailProps) {
  const isSacrament = isSacramentMeeting(meeting.meetingType);
  const announcements = meeting.announcements ?? [];

  return (
    <article
      aria-labelledby="meeting-title"
      className="mx-auto max-w-2xl border border-brown/40 bg-card px-6 py-10 sm:px-12 print:max-w-none print:border-0 print:bg-white print:p-0 print:text-sm"
    >
      {/* Program heading */}
      <header className="text-center">
        <p className="text-xs tracking-[0.3em] text-muted uppercase">{WARD_NAME}</p>
        <h1 id="meeting-title" className="mt-3 text-3xl text-brown">
          {MEETING_TYPE_LABELS[meeting.meetingType]}
        </h1>
        <p className="mt-2 text-muted italic">
          <time dateTime={meeting.date}>{formatMeetingDate(meeting.date)}</time>
        </p>
        <div className="mx-auto mt-6 h-0.5 w-16 bg-olive" />
      </header>

      {!isSacrament && (
        <p className="mt-8 border-l-4 border-olive bg-paper px-4 py-3 text-sm print:bg-white">
          No sacrament meeting is held in the ward building this week. The
          program below is for the {MEETING_TYPE_LABELS[meeting.meetingType].toLowerCase()}{' '}
          session.
        </p>
      )}

      <dl className="mt-8">
        <ProgramRow label="Presiding">{meeting.presiding}</ProgramRow>
        <ProgramRow label="Conducting">{meeting.conducting}</ProgramRow>
      </dl>

      {announcements.length > 0 && (
        <section aria-labelledby="announcements-heading" className="mt-10 print:mt-5">
          <SectionHeading id="announcements-heading">Announcements</SectionHeading>
          <ul className="list-disc space-y-1 pl-5">
            {announcements.map((text) => (
              <li key={text}>{text}</li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="program-heading" className="mt-10 print:mt-5">
        <SectionHeading id="program-heading">Order of Meeting</SectionHeading>

        <dl>
          <ProgramRow label="Opening Hymn">
            <HymnText hymn={meeting.openingHymn} />
          </ProgramRow>
          <ProgramRow label="Opening Prayer">{meeting.openingPrayer}</ProgramRow>
        </dl>

        <div className="py-1.5">
          <h3 className="text-muted">Ward Business</h3>
          {meeting.wardBusiness.length > 0 ? (
            <ul className="mt-1 list-disc space-y-1 pl-5 text-sm">
              {meeting.wardBusiness.map((item) => (
                <li key={item.description}>{item.description}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-1 pl-5 text-sm italic text-muted">None</p>
          )}
        </div>

        <dl>
          <ProgramRow label="Stake Business">
            {meeting.stakeBusiness ? 'Yes' : 'None'}
          </ProgramRow>
          {meeting.sacramentHymn && (
            <ProgramRow label="Sacrament Hymn">
              <HymnText hymn={meeting.sacramentHymn} />
            </ProgramRow>
          )}
        </dl>

        {meeting.sacramentHymn && (
          <ProgramNote>Administration of the Sacrament</ProgramNote>
        )}

        {meeting.speakers.length > 0 ? (
          <dl>
            {meeting.speakers.map((item, index) => (
              <ProgramRow
                // Names can repeat (e.g. "Primary children"), so include the index.
                key={`${item.name}-${index}`}
                label={item.type === 'speaker' ? 'Speaker' : 'Musical Number'}
                note={item.topic}
              >
                {item.name}
              </ProgramRow>
            ))}
          </dl>
        ) : (
          meeting.meetingType === 'testimony' && (
            <ProgramNote>Bearing of Testimonies</ProgramNote>
          )
        )}

        <dl>
          <ProgramRow label="Closing Hymn">
            <HymnText hymn={meeting.closingHymn} />
          </ProgramRow>
          <ProgramRow label="Closing Prayer">{meeting.closingPrayer}</ProgramRow>
        </dl>
      </section>
    </article>
  );
}
