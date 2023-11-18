import { Concat } from '../../utility/concat';
import { Entity } from './entity';

export interface TimeSlot extends Entity {
  dateId: DateId;
  startTime: [string, string];
  endTime: [string, string];
  teacherId: string;
  duration: number;
}

export type DateId = Concat<[string, string, string]>;
