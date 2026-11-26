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

/** Everything needed to create or update a meeting (the id comes from the database). */
export type MeetingInput = Omit<SacramentMeeting, 'id'>;

/**
 * Speakers as three parallel text[] parameters. SQL turns them back into
 * rows with unnest(...) WITH ORDINALITY, which also numbers them (position)
 * in program order.
 */
function speakerRows(meetingId: ReturnType<typeof sql>, speakers: SpeakerItem[]) {
  return sql`
    SELECT ${meetingId}, sp.position, sp.name, sp.topic, sp.type
      FROM unnest(
             ${speakers.map((s) => s.name)}::text[],
             ${speakers.map((s) => s.topic)}::text[],
             ${speakers.map((s) => s.type)}::text[]
           ) WITH ORDINALITY AS sp (name, topic, type, position)
  `;
}

/** Creates a meeting and its speakers. Returns the new meeting's id. */
export async function createMeeting(input: MeetingInput): Promise<number> {
  // One statement, so the meeting and its speakers are saved together or
  // not at all.
  const rows = (await sql`
    WITH m AS (
      INSERT INTO meetings (
        meeting_date, meeting_type, presiding, conducting, announcements,
        opening_hymn_number, opening_hymn_title, opening_prayer,
        ward_business, stake_business,
        sacrament_hymn_number, sacrament_hymn_title,
        closing_hymn_number, closing_hymn_title, closing_prayer
      ) VALUES (
        ${input.date}, ${input.meetingType}, ${input.presiding}, ${input.conducting},
        ${input.announcements ?? []}::text[],
        ${input.openingHymn.number}, ${input.openingHymn.title}, ${input.openingPrayer},
        ${input.wardBusiness.map((w) => w.description)}::text[], ${input.stakeBusiness},
        ${input.sacramentHymn?.number ?? null}, ${input.sacramentHymn?.title ?? null},
        ${input.closingHymn.number}, ${input.closingHymn.title}, ${input.closingPrayer}
      )
      RETURNING id
    ), s AS (
      INSERT INTO meeting_speakers (meeting_id, position, name, topic, type)
      ${speakerRows(sql`(SELECT id FROM m)`, input.speakers)}
    )
    SELECT id FROM m
  `) as { id: number }[];
  return rows[0].id;
}

/**
 * Replaces a meeting's fields and speakers. Returns false if no meeting has
 * that id.
 */
export async function updateMeeting(id: number, input: MeetingInput): Promise<boolean> {
  if (!Number.isInteger(id) || id < 1 || id > MAX_ID) return false;

  // A transaction: either every statement succeeds or none of them do.
  const [updated] = (await sql.transaction([
    sql`
      UPDATE meetings SET
        meeting_date          = ${input.date},
        meeting_type          = ${input.meetingType},
        presiding             = ${input.presiding},
        conducting            = ${input.conducting},
        announcements         = ${input.announcements ?? []}::text[],
        opening_hymn_number   = ${input.openingHymn.number},
        opening_hymn_title    = ${input.openingHymn.title},
        opening_prayer        = ${input.openingPrayer},
        ward_business         = ${input.wardBusiness.map((w) => w.description)}::text[],
        stake_business        = ${input.stakeBusiness},
        sacrament_hymn_number = ${input.sacramentHymn?.number ?? null},
        sacrament_hymn_title  = ${input.sacramentHymn?.title ?? null},
        closing_hymn_number   = ${input.closingHymn.number},
        closing_hymn_title    = ${input.closingHymn.title},
        closing_prayer        = ${input.closingPrayer}
      WHERE id = ${id}
      RETURNING id
    `,
    sql`DELETE FROM meeting_speakers WHERE meeting_id = ${id}`,
    // Only re-add speakers if the meeting exists (else the foreign key fails).
    sql`
      INSERT INTO meeting_speakers (meeting_id, position, name, topic, type)
      ${speakerRows(sql`${id}::integer`, input.speakers)}
      WHERE EXISTS (SELECT 1 FROM meetings WHERE id = ${id})
    `,
  ])) as [{ id: number }[], unknown, unknown];
  return updated.length > 0;
}

/** Deletes a meeting (its speakers go with it). Returns false if none had that id. */
export async function deleteMeeting(id: number): Promise<boolean> {
  if (!Number.isInteger(id) || id < 1 || id > MAX_ID) return false;
  const rows = (await sql`DELETE FROM meetings WHERE id = ${id} RETURNING id`) as {
    id: number;
  }[];
  return rows.length > 0;
}
