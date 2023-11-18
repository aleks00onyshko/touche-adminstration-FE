import { Concat } from '../../utility/concat';
import { Entity } from './entity';

export type DateId = Concat<[string, string, string]>;

export interface TimeSlot extends Entity<DateId> {
  startTime: [number, number];
  endTime: [number, number];
  duration: number;
  techerId: string;
}
