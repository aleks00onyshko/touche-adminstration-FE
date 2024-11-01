import { DateId } from '../../model/entities/time-slot';

export abstract class DateManager {
  abstract getCurrentDate(): Date;
  abstract getCurrentDateId(): DateId;
  abstract getDayName(date: Date): string;
  abstract getMonthNumber(date: Date): string;
  abstract getDayNumber(date: Date): number;
  abstract getYear(date: Date): number;
  abstract addDaysToDate(date: Date, days: number): Date;
}
