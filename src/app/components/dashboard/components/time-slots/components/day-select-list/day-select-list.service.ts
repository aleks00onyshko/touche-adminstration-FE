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
      for (let i = 0; i < numberOfDays; i++) {
        days.push(new DayLabel(currentDate));
        currentDate.add(1, 'day');
      }
    };

    // Calculate the number of days until the end of the month
  

    // Add labels for the current month, starting from the current day



    // Adjust the loop for days from the next month
    addDays(30, currentDate, days);

    return days;
  }
}
