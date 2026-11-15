import type { MeetingType } from './types';

export const WARD_NAME = 'Mapleton 17th Ward';

/** Human-readable names for each meeting type. */
export const MEETING_TYPE_LABELS: Record<MeetingType, string> = {
  regular: 'Sacrament Meeting',
  testimony: 'Fast and Testimony Meeting',
  stake: 'Stake Conference',
  general: 'General Conference',
};

/** Stake and general conference replace the ward's sacrament meeting. */
export function isSacramentMeeting(type: MeetingType): boolean {
  return type === 'regular' || type === 'testimony';
}
