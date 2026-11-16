export type MeetingType =
  | 'testimony'
  | 'regular'
  | 'stake' // stake conference (non-sacrament meeting)
  | 'general'; // general conference (non-sacrament meeting)

export interface Hymn {
  number: number;
  title: string;
}

export interface SpeakerItem {
  name: string;
  topic: string;
  type: 'speaker' | 'musical-number';
}

export interface WardBusinessItem {
  description: string;
}

export interface SacramentMeeting {
  id: number;
  date: string; // ISO date string: 'YYYY-MM-DD'
  meetingType: MeetingType;
  presiding: string;
  conducting: string;
  announcements?: string[];
  openingHymn: Hymn;
  openingPrayer: string;
  wardBusiness: WardBusinessItem[];
  stakeBusiness: boolean;
  // Optional because stake and general conference sessions do not
  // administer the sacrament, so there is no sacrament hymn.
  sacramentHymn?: Hymn;
  speakers: SpeakerItem[];
  closingHymn: Hymn;
  closingPrayer: string;
}
