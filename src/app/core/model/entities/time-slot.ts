import { Concat } from '../../utility/concat';
import { Entity } from './entity';

export type DateId = Concat<[string, string, string]>;

export interface TimeSlot extends Entity<string> {
  startTime: [number, number];
  duration: number;
  selectedTeacherId?: string | null;
  teachersIds: string[];
  locationId: string;
  dateId: DateId;
  booked: boolean;
  attendeeId: string;
}
