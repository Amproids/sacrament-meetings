-- Schema for the Sacrament Meeting Planner (Neon Postgres).
-- Run with `npm run db:setup`, or paste into the Neon SQL Editor.
-- Safe to re-run: tables are only created if they don't exist.

CREATE TABLE IF NOT EXISTS meetings (
  id                    SERIAL PRIMARY KEY,
  meeting_date          DATE NOT NULL,
  meeting_type          TEXT NOT NULL
                        CHECK (meeting_type IN ('regular', 'testimony', 'stake', 'general')),
  presiding             TEXT NOT NULL,
  conducting            TEXT NOT NULL,
  announcements         TEXT[] NOT NULL DEFAULT '{}',
  opening_hymn_number   INTEGER NOT NULL CHECK (opening_hymn_number > 0),
  opening_hymn_title    TEXT NOT NULL,
  opening_prayer        TEXT NOT NULL,
  ward_business         TEXT[] NOT NULL DEFAULT '{}',
  stake_business        BOOLEAN NOT NULL DEFAULT FALSE,
  -- Both NULL for stake and general conference (no sacrament is administered).
  sacrament_hymn_number INTEGER CHECK (sacrament_hymn_number > 0),
  sacrament_hymn_title  TEXT,
  closing_hymn_number   INTEGER NOT NULL CHECK (closing_hymn_number > 0),
  closing_hymn_title    TEXT NOT NULL,
  closing_prayer        TEXT NOT NULL,
  CHECK ((sacrament_hymn_number IS NULL) = (sacrament_hymn_title IS NULL))
);

CREATE INDEX IF NOT EXISTS meetings_date_idx ON meetings (meeting_date DESC);

-- Speakers and musical numbers, in program order.
CREATE TABLE IF NOT EXISTS meeting_speakers (
  id         SERIAL PRIMARY KEY,
  meeting_id INTEGER NOT NULL REFERENCES meetings (id) ON DELETE CASCADE,
  position   INTEGER NOT NULL,
  name       TEXT NOT NULL,
  topic      TEXT NOT NULL DEFAULT '',
  type       TEXT NOT NULL CHECK (type IN ('speaker', 'musical-number'))
);

CREATE INDEX IF NOT EXISTS meeting_speakers_meeting_idx ON meeting_speakers (meeting_id, position);
