import moment from 'moment';
import { DateId } from 'src/app/core/model/entities/time-slot';

export class DayLabel {
  public readonly id: DateId;
  public readonly year: number;
  public readonly dayName: string;
  public readonly monthNumber: string;
  public readonly dayNumber: number;

  constructor(date: moment.Moment) {
    this.dayName = date.format('ddd');
    this.monthNumber = date.format('MM');
    this.dayNumber = date.date();
    this.year = date.year();
    this.id = `${this.dayNumber}-${this.monthNumber}-${this.year}`;
  }
}
