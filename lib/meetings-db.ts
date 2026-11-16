import type { SacramentMeeting } from './types';

// Temporary in-memory data store. This will be replaced by a real
// database in a later week. Functions are async now so callers won't
// need to change when the data comes from a database.

const meetings: SacramentMeeting[] = [
  {
    id: 1,
    date: '2026-05-03',
    meetingType: 'testimony',
    presiding: 'Bishop Daniel Reyes',
    conducting: 'Brother Mark Ellison',
    announcements: [
      'Fast offerings may be given to any member of the bishopric.',
      'Ward temple night is Thursday at 7:00 p.m.',
    ],
    openingHymn: { number: 2, title: 'The Spirit of God' },
    openingPrayer: 'Sister Hannah Brooks',
    wardBusiness: [
      { description: 'Confirmation of Olivia Martinez as a member of the Church.' },
    ],
    stakeBusiness: false,
    sacramentHymn: { number: 193, title: 'I Stand All Amazed' },
    speakers: [], // Testimonies are borne by members of the congregation.
    closingHymn: { number: 134, title: 'I Believe in Christ' },
    closingPrayer: 'Brother Tyler Nguyen',
  },
  {
    id: 2,
    date: '2026-10-04',
    meetingType: 'general',
    presiding: 'First Presidency',
    conducting: 'General Conference broadcast',
    announcements: [
      'No sacrament meeting will be held in the ward building.',
      'Watch the Sunday sessions of General Conference at 10:00 a.m. and 2:00 p.m.',
    ],
    openingHymn: { number: 19, title: 'We Thank Thee, O God, for a Prophet' },
    openingPrayer: 'As assigned in the broadcast',
    wardBusiness: [],
    stakeBusiness: false,
    speakers: [],
    closingHymn: { number: 6, title: 'Redeemer of Israel' },
    closingPrayer: 'As assigned in the broadcast',
  },
  {
    id: 3,
    date: '2026-10-11',
    meetingType: 'regular',
    presiding: 'Bishop Daniel Reyes',
    conducting: 'Brother Samuel Okafor',
    announcements: ['The Primary program will be held on November 15.'],
    openingHymn: { number: 85, title: 'How Firm a Foundation' },
    openingPrayer: 'Sister Grace Whitaker',
    wardBusiness: [
      { description: 'Release of Sister Emily Carter as Primary secretary.' },
      { description: 'Sustaining of Brother James Lowe as elders quorum secretary.' },
    ],
    stakeBusiness: false,
    sacramentHymn: { number: 169, title: 'As Now We Take the Sacrament' },
    speakers: [
      { name: 'Sister Rachel Kim', topic: 'Ministering like the Savior', type: 'speaker' },
      { name: 'Brother Ethan Price', topic: 'The blessings of the temple', type: 'speaker' },
      { name: 'Young Women chorus', topic: 'I Know That My Redeemer Lives', type: 'musical-number' },
      { name: 'Brother Mark Ellison', topic: 'Faith in Jesus Christ', type: 'speaker' },
    ],
    closingHymn: { number: 241, title: 'Count Your Blessings' },
    closingPrayer: 'Brother Caleb Turner',
  },
  {
    id: 4,
    date: '2026-10-18',
    meetingType: 'stake',
    presiding: 'President Harold Whitmore',
    conducting: 'President Luis Ramirez',
    announcements: [
      'No sacrament meeting will be held in the ward building.',
      'Stake conference begins at 10:00 a.m. at the stake center.',
    ],
    openingHymn: { number: 3, title: 'Now Let Us Rejoice' },
    openingPrayer: 'Sister Megan Holt',
    wardBusiness: [],
    stakeBusiness: true,
    speakers: [
      { name: 'Sister Anne Whitmore', topic: 'Strengthening our homes', type: 'speaker' },
      { name: 'Stake choir', topic: 'Come, Come, Ye Saints', type: 'musical-number' },
      { name: 'President Harold Whitmore', topic: 'Covenant belonging', type: 'speaker' },
    ],
    closingHymn: { number: 152, title: 'God Be with You Till We Meet Again' },
    closingPrayer: 'Brother Isaac Morales',
  },
  {
    id: 5,
    date: '2026-10-25',
    meetingType: 'regular',
    presiding: 'Bishop Daniel Reyes',
    conducting: 'Bishop Daniel Reyes',
    announcements: [
      'The ward Halloween party is Friday at 6:00 p.m. in the cultural hall.',
    ],
    openingHymn: { number: 1, title: 'The Morning Breaks' },
    openingPrayer: 'Brother Noah Jensen',
    wardBusiness: [
      { description: 'Sustaining of Sister Lily Chen as Relief Society teacher.' },
    ],
    stakeBusiness: false,
    sacramentHymn: { number: 172, title: 'In Humility, Our Savior' },
    speakers: [
      { name: 'Brother Owen Fisher', topic: 'Repentance brings joy', type: 'speaker' },
      { name: 'Sister Ava Patel', topic: 'O My Father (violin solo)', type: 'musical-number' },
      { name: 'Sister Claire Dawson', topic: 'Hearing Him through the scriptures', type: 'speaker' },
    ],
    closingHymn: { number: 116, title: 'Come, Follow Me' },
    closingPrayer: 'Sister Mia Rasmussen',
  },
  {
    id: 6,
    date: '2026-11-01',
    meetingType: 'testimony',
    presiding: 'Bishop Daniel Reyes',
    conducting: 'Brother Mark Ellison',
    announcements: [
      'Fast offerings may be given to any member of the bishopric.',
      'Tithing declaration appointments are available. See the executive secretary.',
    ],
    openingHymn: { number: 26, title: "Joseph Smith's First Prayer" },
    openingPrayer: 'Sister Abigail Hart',
    wardBusiness: [
      { description: 'Name and blessing of Henry James Lowe.' },
    ],
    stakeBusiness: false,
    sacramentHymn: { number: 181, title: 'Jesus of Nazareth, Savior and King' },
    speakers: [],
    closingHymn: { number: 98, title: 'I Need Thee Every Hour' },
    closingPrayer: 'Brother Wyatt Sorensen',
  },
  {
    id: 7,
    date: '2026-11-08',
    meetingType: 'regular',
    presiding: 'Bishop Daniel Reyes',
    conducting: 'Brother Samuel Okafor',
    announcements: [
      'The Primary program will be held next Sunday.',
      'Youth service project Saturday at 9:00 a.m. at the food bank.',
    ],
    openingHymn: { number: 27, title: 'Praise to the Man' },
    openingPrayer: 'Brother Logan Pierce',
    wardBusiness: [
      { description: 'Release of Brother Ethan Price as ward clerk.' },
      { description: 'Sustaining of Brother Caleb Turner as ward clerk.' },
    ],
    stakeBusiness: true,
    sacramentHymn: { number: 196, title: 'Jesus, Once of Humble Birth' },
    speakers: [
      { name: 'Sister Zoe Alvarez', topic: 'Gratitude in all things', type: 'speaker' },
      { name: 'Brother Jacob Lin', topic: 'Missionary preparation', type: 'speaker' },
      { name: 'Hart family', topic: 'Where Can I Turn for Peace?', type: 'musical-number' },
      { name: 'Sister Hannah Brooks', topic: 'The Atonement of Jesus Christ', type: 'speaker' },
    ],
    closingHymn: { number: 136, title: 'I Know That My Redeemer Lives' },
    closingPrayer: 'Sister Grace Whitaker',
  },
  {
    id: 8,
    date: '2026-11-15',
    meetingType: 'regular',
    presiding: 'Bishop Daniel Reyes',
    conducting: 'Brother Mark Ellison',
    announcements: ['Thanksgiving food drive boxes are in the foyer.'],
    openingHymn: { number: 301, title: 'I Am a Child of God' },
    openingPrayer: 'Primary child (to be assigned)',
    wardBusiness: [],
    stakeBusiness: false,
    sacramentHymn: { number: 187, title: 'God Loved Us, So He Sent His Son' },
    speakers: [
      { name: 'Primary children', topic: 'Primary program: I Will Follow Jesus', type: 'speaker' },
      { name: 'Primary children', topic: 'I Am a Child of God', type: 'musical-number' },
    ],
    closingHymn: { number: 220, title: 'Lord, I Would Follow Thee' },
    closingPrayer: 'Primary child (to be assigned)',
  },
];

/**
 * Returns all meetings, newest first. If `date` ('YYYY-MM-DD') is given,
 * returns only the meetings on that date.
 */
export async function getMeetings(date?: string): Promise<SacramentMeeting[]> {
  const results = date ? meetings.filter((m) => m.date === date) : meetings;
  // ISO date strings sort correctly as plain strings.
  return [...results].sort((a, b) => b.date.localeCompare(a.date));
}

/** Returns the meeting with the given id, or undefined if none exists. */
export async function getMeetingById(
  id: number,
): Promise<SacramentMeeting | undefined> {
  return meetings.find((m) => m.id === id);
}
