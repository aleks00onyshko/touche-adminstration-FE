import { Injectable } from '@angular/core';
import { DayLabel } from './day-label';
import { DateService } from 'src/app/core/services/date-service/date.service';

@Injectable()
export class DaySelectListService {
  constructor(private dateService: DateService) {}

  public splitDayLabelsIntoBatches(array: DayLabel[], batchSize: number = 7): DayLabel[][] {
    const batches: DayLabel[][] = [];

    for (let i = 0; i < array.length && batches.length < 4; i += batchSize) {
      batches.push(array.slice(i, i + batchSize));
    }

    return batches;
  }

  public generateDaysList(): DayLabel[] {
    const currentDate = this.dateService.addDaysToDate(this.dateService.getCurrentMoment(), 0);
    const days: DayLabel[] = [];

    const addDays = (numberOfDays: number, currentDate: moment.Moment, days: DayLabel[]) => {
      for (let i = 0; i < numberOfDays; i++) {
        days.push(new DayLabel(currentDate));
        currentDate.add(1, 'day');
      }
    };

    addDays(31, currentDate, days);

    return days;
  }
}
