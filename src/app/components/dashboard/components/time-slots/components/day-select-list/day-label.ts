import { DateId } from 'src/app/core/model/entities/time-slot';
import { DateService } from 'src/app/core/services/date-service/date.service';

export class DayLabel {
  public readonly id: DateId;
  public readonly year: number;
  public readonly dayName: string;
  public readonly dayNumber: number;

  constructor(date: moment.Moment, private dateService: DateService) {
    this.dayName = this.dateService.formatDate(date, 'ddd');
    this.dayNumber = this.dateService.getDayNumber(date);
    this.year = this.dateService.getYear(date);
    this.id = this.dateService.createDateId(this.dayName, this.dayNumber, this.year);
  }

  public isToday(): boolean {
    return this.dateService.isToday(this.dateService.getCurrentMoment());
  }
}
