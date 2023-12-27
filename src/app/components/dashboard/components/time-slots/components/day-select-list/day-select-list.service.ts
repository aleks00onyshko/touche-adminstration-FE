import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { DayLabel } from './day-label';

@Injectable()
export class DaySelectListService {
  public splitDayLabelsIntoBatches(array: DayLabel[], batchSize: number = 7): DayLabel[][] {
    const batches: DayLabel[][] = [];

    for (let i = 0; i < array.length && batches.length < 4; i += batchSize) {
      batches.push(array.slice(i, i + batchSize));
    }

    return batches;
  }

  // generating next 30days
  public generateDaysList(): DayLabel[] {
    const currentDate = moment();
    const days: DayLabel[] = [];

    const addDays = (numberOfDays: number, currentDate: moment.Moment, days: DayLabel[]) => {
      for (let i = 0; i < 30; i++) {
        days.push(new DayLabel(currentDate));
        currentDate.add(1, 'day');
      }
    };

    // Calculate the number of days until the end of the month
    const daysUntilEndOfMonth = moment(currentDate).endOf('month').date() - currentDate.date() + 1;

    // Add labels for the current month, starting from the current day
    addDays(daysUntilEndOfMonth, currentDate, days);

    const remainingDaysFromNextMonth = Math.max(0, daysUntilEndOfMonth - currentDate.date());

    // Adjust the loop for days from the next month
    addDays(remainingDaysFromNextMonth, currentDate, days);

    return days;
  }
}
