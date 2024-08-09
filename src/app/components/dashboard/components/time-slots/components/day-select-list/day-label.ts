import * as moment from 'moment';
import { DateId } from 'src/app/core/model/entities/time-slot';

export class DayLabel {
  public readonly id: DateId;
  public readonly year: number;
  public readonly dayName: string;
  public readonly monthNumber: number;
  public readonly dayNumber: number;

  constructor(date: moment.Moment) {
    this.dayName = date.format('ddd');
    this.dayNumber = date.date();
    this.monthNumber = date.month() + 1;
    this.year = date.year();
    this.id = `${this.dayName}-${this.dayNumber}-${this.monthNumber}-${this.year}`;

  }

  public isToday(): boolean {
    const currentDate = moment();
    const currentDayName = currentDate.format('ddd');
    const currentDayNumber = currentDate.date();
    const year = currentDate.year();
    const month = currentDate.month() + 1



    return this.dayName === currentDayName && this.dayNumber === currentDayNumber && this.year === year  && this.monthNumber  === month ;
  }
}
