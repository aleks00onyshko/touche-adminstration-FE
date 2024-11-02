import { DateId } from '../../../../../../core/model/entities/time-slot';
import { DateManager } from '../../../../../../core/services/date-service/date-manager';

export class DayLabel {
  public readonly id: DateId;
  public readonly year: number;
  public readonly dayName: string;
  public readonly monthNumber: string;
  public readonly dayNumber: number;

  constructor(
    private dateManager: DateManager,
    date: Date
  ) {
    this.dayName = this.dateManager.getDayName(date); // internally uses moment format('ddd')
    this.monthNumber = this.dateManager.getMonthNumber(date); // internally uses moment format('MM')
    this.dayNumber = this.dateManager.getDayNumber(date); // internally uses moment date()
    this.year = this.dateManager.getYear(date); // internally uses moment year()
    this.id = `${this.dayNumber}-${this.monthNumber}-${this.year}` as DateId;
  }
}
