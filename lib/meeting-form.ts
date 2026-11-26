import type { MeetingInput } from './meetings-db';
import type { MeetingType, SacramentMeeting, SpeakerItem } from './types';
import { isValidISODate } from './dates';
import { MEETING_TYPE_LABELS, isSacramentMeeting } from './labels';

/*
  The admin meeting form, as plain strings (what the <input>s hold).
  Used to fill the form, and sent back with errors so a failed submit
  keeps what the user typed.
*/
export interface MeetingFormValues {
  date: string;
  meetingType: MeetingType;
  presiding: string;
  conducting: string;
  announcements: string; // one per line
  openingHymnNumber: string;
  openingHymnTitle: string;
  openingPrayer: string;
  wardBusiness: string; // one per line
  stakeBusiness: boolean;
  sacramentHymnNumber: string;
  sacramentHymnTitle: string;
  speakers: SpeakerItem[];
  closingHymnNumber: string;
  closingHymnTitle: string;
  closingPrayer: string;
}

/** Field name → message. `form` is for errors not tied to one field. */
export type MeetingFormErrors = Partial<Record<keyof MeetingFormValues | 'form', string>>;

export interface MeetingFormState {
  values: MeetingFormValues;
  errors: MeetingFormErrors;
  /** Bumped on every failed submit so the form re-mounts with `values`. */
  attempt: number;
}

export function toFormValues(meeting?: SacramentMeeting): MeetingFormValues {
  return {
    date: meeting?.date ?? '',
    meetingType: meeting?.meetingType ?? 'regular',
    presiding: meeting?.presiding ?? '',
    conducting: meeting?.conducting ?? '',
    announcements: (meeting?.announcements ?? []).join('\n'),
    openingHymnNumber: meeting ? String(meeting.openingHymn.number) : '',
    openingHymnTitle: meeting?.openingHymn.title ?? '',
    openingPrayer: meeting?.openingPrayer ?? '',
    wardBusiness: (meeting?.wardBusiness ?? []).map((w) => w.description).join('\n'),
    stakeBusiness: meeting?.stakeBusiness ?? false,
    sacramentHymnNumber: meeting?.sacramentHymn ? String(meeting.sacramentHymn.number) : '',
    sacramentHymnTitle: meeting?.sacramentHymn?.title ?? '',
    speakers: meeting?.speakers ?? [],
    closingHymnNumber: meeting ? String(meeting.closingHymn.number) : '',
    closingHymnTitle: meeting?.closingHymn.title ?? '',
    closingPrayer: meeting?.closingPrayer ?? '',
  };
}

function text(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === 'string' ? value.trim() : '';
}

function lines(value: string): string[] {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function isMeetingType(value: string): value is MeetingType {
  return Object.hasOwn(MEETING_TYPE_LABELS, value);
}

/** Hymn numbers are whole numbers; the hymnbook has a few hundred. */
function parseHymnNumber(value: string): number | null {
  return /^\d{1,4}$/.test(value) && Number(value) > 0 ? Number(value) : null;
}

export function readMeetingForm(formData: FormData): MeetingFormValues {
  // Speaker rows arrive as repeated fields, one entry per row, in order.
  const names = formData.getAll('speakerName').map((v) => String(v).trim());
  const topics = formData.getAll('speakerTopic').map((v) => String(v).trim());
  const types = formData.getAll('speakerType').map(String);
  const speakers: SpeakerItem[] = names.map((name, i) => ({
    name,
    topic: topics[i] ?? '',
    type: types[i] === 'musical-number' ? 'musical-number' : 'speaker',
  }));

  const meetingType = text(formData, 'meetingType');

  return {
    date: text(formData, 'date'),
    meetingType: isMeetingType(meetingType) ? meetingType : 'regular',
    presiding: text(formData, 'presiding'),
    conducting: text(formData, 'conducting'),
    announcements: text(formData, 'announcements'),
    openingHymnNumber: text(formData, 'openingHymnNumber'),
    openingHymnTitle: text(formData, 'openingHymnTitle'),
    openingPrayer: text(formData, 'openingPrayer'),
    wardBusiness: text(formData, 'wardBusiness'),
    stakeBusiness: formData.get('stakeBusiness') === 'on',
    sacramentHymnNumber: text(formData, 'sacramentHymnNumber'),
    sacramentHymnTitle: text(formData, 'sacramentHymnTitle'),
    // Drop rows left completely blank (e.g. an extra "Add" click).
    speakers: speakers.filter((s) => s.name || s.topic),
    closingHymnNumber: text(formData, 'closingHymnNumber'),
    closingHymnTitle: text(formData, 'closingHymnTitle'),
    closingPrayer: text(formData, 'closingPrayer'),
  };
}

/**
 * Checks the submitted values. Returns the meeting to save, or the errors
 * to show next to each field.
 */
export function validateMeetingForm(
  values: MeetingFormValues,
): { input: MeetingInput; errors?: undefined } | { input?: undefined; errors: MeetingFormErrors } {
  const errors: MeetingFormErrors = {};
  const required = (field: keyof MeetingFormValues, label: string) => {
    if (!values[field]) errors[field] = `${label} is required.`;
  };

  if (!isValidISODate(values.date)) errors.date = 'Enter a valid date.';
  required('presiding', 'Presiding');
  required('conducting', 'Conducting');
  required('openingPrayer', 'Opening prayer');
  required('closingPrayer', 'Closing prayer');

  const openingNumber = parseHymnNumber(values.openingHymnNumber);
  if (openingNumber === null) errors.openingHymnNumber = 'Enter a hymn number.';
  required('openingHymnTitle', 'Opening hymn title');

  const closingNumber = parseHymnNumber(values.closingHymnNumber);
  if (closingNumber === null) errors.closingHymnNumber = 'Enter a hymn number.';
  required('closingHymnTitle', 'Closing hymn title');

  // Sacrament meetings need a sacrament hymn; conferences have none.
  const hasSacramentHymn = Boolean(values.sacramentHymnNumber || values.sacramentHymnTitle);
  const sacramentNumber = parseHymnNumber(values.sacramentHymnNumber);
  if (isSacramentMeeting(values.meetingType) || hasSacramentHymn) {
    if (sacramentNumber === null) errors.sacramentHymnNumber = 'Enter a hymn number.';
    required('sacramentHymnTitle', 'Sacrament hymn title');
  }

  if (values.speakers.some((s) => !s.name)) {
    errors.speakers = 'Each speaker or musical number needs a name.';
  }

  if (Object.keys(errors).length > 0) return { errors };

  return {
    input: {
      date: values.date,
      meetingType: values.meetingType,
      presiding: values.presiding,
      conducting: values.conducting,
      announcements: lines(values.announcements),
      openingHymn: { number: openingNumber!, title: values.openingHymnTitle },
      openingPrayer: values.openingPrayer,
      wardBusiness: lines(values.wardBusiness).map((description) => ({ description })),
      stakeBusiness: values.stakeBusiness,
      sacramentHymn:
        sacramentNumber !== null && values.sacramentHymnTitle
          ? { number: sacramentNumber, title: values.sacramentHymnTitle }
          : undefined,
      speakers: values.speakers,
      closingHymn: { number: closingNumber!, title: values.closingHymnTitle },
      closingPrayer: values.closingPrayer,
    },
  };
}
