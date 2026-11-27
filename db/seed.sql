-- Sample data: the ward's meetings from May to November 2026.
-- Run after schema.sql. Clears existing rows first so it can be re-run.

TRUNCATE meeting_speakers, meetings RESTART IDENTITY;

INSERT INTO meetings (id, meeting_date, meeting_type, presiding, conducting, announcements, opening_hymn_number, opening_hymn_title, opening_prayer, ward_business, stake_business, sacrament_hymn_number, sacrament_hymn_title, closing_hymn_number, closing_hymn_title, closing_prayer)
VALUES (1, '2026-05-03', 'testimony', 'Bishop Daniel Reyes', 'Brother Mark Ellison',
  ARRAY['Fast offerings may be given to any member of the bishopric.', 'Ward temple night is Thursday at 7:00 p.m.'],
  2, 'The Spirit of God', 'Sister Hannah Brooks',
  ARRAY['Confirmation of Olivia Martinez as a member of the Church.'],
  FALSE, 193, 'I Stand All Amazed',
  134, 'I Believe in Christ', 'Brother Tyler Nguyen');

INSERT INTO meetings (id, meeting_date, meeting_type, presiding, conducting, announcements, opening_hymn_number, opening_hymn_title, opening_prayer, ward_business, stake_business, sacrament_hymn_number, sacrament_hymn_title, closing_hymn_number, closing_hymn_title, closing_prayer)
VALUES (2, '2026-10-04', 'general', 'First Presidency', 'General Conference broadcast',
  ARRAY['No sacrament meeting will be held in the ward building.', 'Watch the Sunday sessions of General Conference at 10:00 a.m. and 2:00 p.m.'],
  19, 'We Thank Thee, O God, for a Prophet', 'As assigned in the broadcast',
  '{}',
  FALSE, NULL, NULL,
  6, 'Redeemer of Israel', 'As assigned in the broadcast');

INSERT INTO meetings (id, meeting_date, meeting_type, presiding, conducting, announcements, opening_hymn_number, opening_hymn_title, opening_prayer, ward_business, stake_business, sacrament_hymn_number, sacrament_hymn_title, closing_hymn_number, closing_hymn_title, closing_prayer)
VALUES (3, '2026-10-11', 'regular', 'Bishop Daniel Reyes', 'Brother Samuel Okafor',
  ARRAY['The Primary program will be held on November 15.'],
  85, 'How Firm a Foundation', 'Sister Grace Whitaker',
  ARRAY['Release of Sister Emily Carter as Primary secretary.', 'Sustaining of Brother James Lowe as elders quorum secretary.'],
  FALSE, 169, 'As Now We Take the Sacrament',
  241, 'Count Your Blessings', 'Brother Caleb Turner');

INSERT INTO meeting_speakers (meeting_id, position, name, topic, type) VALUES
  (3, 1, 'Sister Rachel Kim', 'Ministering like the Savior', 'speaker'),
  (3, 2, 'Brother Ethan Price', 'The blessings of the temple', 'speaker'),
  (3, 3, 'Young Women chorus', 'I Know That My Redeemer Lives', 'musical-number'),
  (3, 4, 'Brother Mark Ellison', 'Faith in Jesus Christ', 'speaker');

INSERT INTO meetings (id, meeting_date, meeting_type, presiding, conducting, announcements, opening_hymn_number, opening_hymn_title, opening_prayer, ward_business, stake_business, sacrament_hymn_number, sacrament_hymn_title, closing_hymn_number, closing_hymn_title, closing_prayer)
VALUES (4, '2026-10-18', 'stake', 'President Harold Whitmore', 'President Luis Ramirez',
  ARRAY['No sacrament meeting will be held in the ward building.', 'Stake conference begins at 10:00 a.m. at the stake center.'],
  3, 'Now Let Us Rejoice', 'Sister Megan Holt',
  '{}',
  TRUE, NULL, NULL,
  152, 'God Be with You Till We Meet Again', 'Brother Isaac Morales');

INSERT INTO meeting_speakers (meeting_id, position, name, topic, type) VALUES
  (4, 1, 'Sister Anne Whitmore', 'Strengthening our homes', 'speaker'),
  (4, 2, 'Stake choir', 'Come, Come, Ye Saints', 'musical-number'),
  (4, 3, 'President Harold Whitmore', 'Covenant belonging', 'speaker');

INSERT INTO meetings (id, meeting_date, meeting_type, presiding, conducting, announcements, opening_hymn_number, opening_hymn_title, opening_prayer, ward_business, stake_business, sacrament_hymn_number, sacrament_hymn_title, closing_hymn_number, closing_hymn_title, closing_prayer)
VALUES (5, '2026-10-25', 'regular', 'Bishop Daniel Reyes', 'Bishop Daniel Reyes',
  ARRAY['The ward Halloween party is Friday at 6:00 p.m. in the cultural hall.'],
  1, 'The Morning Breaks', 'Brother Noah Jensen',
  ARRAY['Sustaining of Sister Lily Chen as Relief Society teacher.'],
  FALSE, 172, 'In Humility, Our Savior',
  116, 'Come, Follow Me', 'Sister Mia Rasmussen');

INSERT INTO meeting_speakers (meeting_id, position, name, topic, type) VALUES
  (5, 1, 'Brother Owen Fisher', 'Repentance brings joy', 'speaker'),
  (5, 2, 'Sister Ava Patel', 'O My Father (violin solo)', 'musical-number'),
  (5, 3, 'Sister Claire Dawson', 'Hearing Him through the scriptures', 'speaker');

INSERT INTO meetings (id, meeting_date, meeting_type, presiding, conducting, announcements, opening_hymn_number, opening_hymn_title, opening_prayer, ward_business, stake_business, sacrament_hymn_number, sacrament_hymn_title, closing_hymn_number, closing_hymn_title, closing_prayer)
VALUES (6, '2026-11-01', 'testimony', 'Bishop Daniel Reyes', 'Brother Mark Ellison',
  ARRAY['Fast offerings may be given to any member of the bishopric.', 'Tithing declaration appointments are available. See the executive secretary.'],
  26, 'Joseph Smith''s First Prayer', 'Sister Abigail Hart',
  ARRAY['Name and blessing of Henry James Lowe.'],
  FALSE, 181, 'Jesus of Nazareth, Savior and King',
  98, 'I Need Thee Every Hour', 'Brother Wyatt Sorensen');

INSERT INTO meetings (id, meeting_date, meeting_type, presiding, conducting, announcements, opening_hymn_number, opening_hymn_title, opening_prayer, ward_business, stake_business, sacrament_hymn_number, sacrament_hymn_title, closing_hymn_number, closing_hymn_title, closing_prayer)
VALUES (7, '2026-11-08', 'regular', 'Bishop Daniel Reyes', 'Brother Samuel Okafor',
  ARRAY['The Primary program will be held next Sunday.', 'Youth service project Saturday at 9:00 a.m. at the food bank.'],
  27, 'Praise to the Man', 'Brother Logan Pierce',
  ARRAY['Release of Brother Ethan Price as ward clerk.', 'Sustaining of Brother Caleb Turner as ward clerk.'],
  TRUE, 196, 'Jesus, Once of Humble Birth',
  136, 'I Know That My Redeemer Lives', 'Sister Grace Whitaker');

INSERT INTO meeting_speakers (meeting_id, position, name, topic, type) VALUES
  (7, 1, 'Sister Zoe Alvarez', 'Gratitude in all things', 'speaker'),
  (7, 2, 'Brother Jacob Lin', 'Missionary preparation', 'speaker'),
  (7, 3, 'Hart family', 'Where Can I Turn for Peace?', 'musical-number'),
  (7, 4, 'Sister Hannah Brooks', 'The Atonement of Jesus Christ', 'speaker');

INSERT INTO meetings (id, meeting_date, meeting_type, presiding, conducting, announcements, opening_hymn_number, opening_hymn_title, opening_prayer, ward_business, stake_business, sacrament_hymn_number, sacrament_hymn_title, closing_hymn_number, closing_hymn_title, closing_prayer)
VALUES (8, '2026-11-15', 'regular', 'Bishop Daniel Reyes', 'Brother Mark Ellison',
  ARRAY['Thanksgiving food drive boxes are in the foyer.'],
  301, 'I Am a Child of God', 'Primary child (to be assigned)',
  '{}',
  FALSE, 187, 'God Loved Us, So He Sent His Son',
  220, 'Lord, I Would Follow Thee', 'Primary child (to be assigned)');

INSERT INTO meeting_speakers (meeting_id, position, name, topic, type) VALUES
  (8, 1, 'Primary children', 'Primary program: I Will Follow Jesus', 'speaker'),
  (8, 2, 'Primary children', 'I Am a Child of God', 'musical-number');

-- Explicit ids were inserted above, so move the sequence past them.
SELECT setval('meetings_id_seq', (SELECT MAX(id) FROM meetings));

