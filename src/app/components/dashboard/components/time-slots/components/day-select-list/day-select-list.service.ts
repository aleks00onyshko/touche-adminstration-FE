import { Injectable } from '@angular/core';
import { DayLabel } from './day-label';
import { DateManager } from '../../../../../../core/services/date-service/date-manager';

@Injectable()
export class DaySelectListService {
  constructor(private dateManager: DateManager) {}

  public splitDayLabelsIntoBatches(array: DayLabel[], batchSize: number = 7): DayLabel[][] {
    const batches: DayLabel[][] = [];

    for (let i = 0; i < array.length && batches.length < 4; i += batchSize) {
      batches.push(array.slice(i, i + batchSize));
    }

    return batches;
  }

  public generateDaysList(): DayLabel[] {
    const currentDate = this.dateManager.getCurrentDate();
    const days: DayLabel[] = [];

    const addDays = (numberOfDays: number, startDate: Date, days: DayLabel[]) => {
      for (let i = 0; i < numberOfDays; i++) {
        const date = this.dateManager.addDaysToDate(startDate, i);
        days.push(new DayLabel(this.dateManager, date));
      }
    };

    addDays(31, currentDate, days);

    return days;
  }
}
