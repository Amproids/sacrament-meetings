import { neon } from '@neondatabase/serverless';
import type { MeetingType, SacramentMeeting, SpeakerItem } from './types';

// Neon's HTTP driver. Every value interpolated into a sql`...` template is
// sent as a separate query parameter ($1, $2, ...), never pasted into the
// SQL text, so user input can't change the query (no SQL injection).
//
// DATABASE_URL lives in .env.local (never committed) and in the Vercel
// project's environment variables. neon() doesn't connect until the first
// query, so the app still builds without it.
export const sql = neon(process.env.DATABASE_URL!);

/** Largest value a Postgres INTEGER (SERIAL) column can hold. */
const MAX_ID = 2_147_483_647;

/** A meetings row joined with its speakers, as returned by MEETING_SELECT. */
interface MeetingRow {
  id: number;
  date: string;
  meeting_type: MeetingType;
  presiding: string;
  conducting: string;
  announcements: string[];
  opening_hymn_number: number;
  opening_hymn_title: string;
  opening_prayer: string;
  ward_business: string[];
  stake_business: boolean;
  sacrament_hymn_number: number | null;
  sacrament_hymn_title: string | null;
  closing_hymn_number: number;
  closing_hymn_title: string;
  closing_prayer: string;
  speakers: SpeakerItem[];
}

// Shared column list for every meeting query. The date is formatted in SQL
// because the driver would otherwise turn a DATE into a JS Date at local
// midnight, which can shift the day depending on the server's time zone.
const MEETING_SELECT = sql`
  SELECT
    m.id,
    to_char(m.meeting_date, 'YYYY-MM-DD') AS date,
    m.meeting_type,
    m.presiding,
    m.conducting,
    m.announcements,
    m.opening_hymn_number,
    m.opening_hymn_title,
    m.opening_prayer,
    m.ward_business,
    m.stake_business,
    m.sacrament_hymn_number,
    m.sacrament_hymn_title,
    m.closing_hymn_number,
    m.closing_hymn_title,
    m.closing_prayer,
    COALESCE(
      (SELECT json_agg(
                json_build_object('name', s.name, 'topic', s.topic, 'type', s.type)
                ORDER BY s.position)
         FROM meeting_speakers s
        WHERE s.meeting_id = m.id),
      '[]'::json
    ) AS speakers
  FROM meetings m
`;

function toMeeting(row: MeetingRow): SacramentMeeting {
  return {
    id: row.id,
    date: row.date,
    meetingType: row.meeting_type,
    presiding: row.presiding,
    conducting: row.conducting,
    announcements: row.announcements,
    openingHymn: { number: row.opening_hymn_number, title: row.opening_hymn_title },
    openingPrayer: row.opening_prayer,
    wardBusiness: row.ward_business.map((description) => ({ description })),
    stakeBusiness: row.stake_business,
    sacramentHymn:
      row.sacrament_hymn_number !== null && row.sacrament_hymn_title !== null
        ? { number: row.sacrament_hymn_number, title: row.sacrament_hymn_title }
        : undefined,
    speakers: row.speakers,
    closingHymn: { number: row.closing_hymn_number, title: row.closing_hymn_title },
    closingPrayer: row.closing_prayer,
  };
}

/**
 * Returns all meetings, newest first. If `date` ('YYYY-MM-DD') is given,
 * returns only the meetings on that date.
 */
export async function getMeetings(date?: string): Promise<SacramentMeeting[]> {
  const where = date ? sql`WHERE m.meeting_date = ${date}` : sql``;
  const rows = (await sql`
    ${MEETING_SELECT}
    ${where}
    ORDER BY m.meeting_date DESC, m.id DESC
  `) as MeetingRow[];
  return rows.map(toMeeting);
}

/** Returns the meeting with the given id, or undefined if none exists. */
export async function getMeetingById(
  id: number,
): Promise<SacramentMeeting | undefined> {
  // Ids are Postgres INTEGERs; anything bigger can't exist (and would make
  // Postgres throw an "out of range" error instead of returning no rows).
  if (!Number.isInteger(id) || id < 1 || id > MAX_ID) return undefined;

  const rows = (await sql`
    ${MEETING_SELECT}
    WHERE m.id = ${id}
  `) as MeetingRow[];
  return rows[0] ? toMeeting(rows[0]) : undefined;
}
