import { Concat } from '../../utility/concat';
import { Entity } from './entity';

export type DateId = Concat<[string, string, string]>;

export interface TimeSlot extends Entity<string> {
  lessonName: string;
  startTime: [number, number];
  teachersIds: string[];
  locationId: string;
  dateId: DateId;
  booked: boolean;
  attendeeId: string;
  tableIds: string[];
  peopleAmount: number;
}
