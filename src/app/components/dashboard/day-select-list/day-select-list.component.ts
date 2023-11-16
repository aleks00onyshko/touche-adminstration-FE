import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as moment from 'moment';
import { ScrollingModule } from '@angular/cdk/scrolling';

interface DayLabel {
  dayNumber: number;
  dayName: string;
}

@Component({
  selector: 'app-day-select-list',
  standalone: true,
  imports: [CommonModule, ScrollingModule],
  templateUrl: './day-select-list.component.html',
  styleUrls: ['./day-select-list.component.scss']
})
export class DaySelectListComponent {
  public dayLabelBatches: DayLabel[][] = this.splitDayLabelsIntoBatches(this.generateDaysList());

  private splitDayLabelsIntoBatches(array: DayLabel[], batchSize: number = 7): DayLabel[][] {
    const batches: DayLabel[][] = [];

    for (let i = 0; i < array.length && batches.length < 4; i += batchSize) {
      batches.push(array.slice(i, i + batchSize));
    }

    return batches;
  }

  private generateDaysList(): DayLabel[] {
    const currentDate = moment();
    const days: DayLabel[] = [];
    const addDays = (numberOfDays: number, currentDate: moment.Moment, days: DayLabel[]) => {
      for (let i = 0; i < numberOfDays; i++) {
        const dayName = currentDate.format('ddd');
        const dayNumber = currentDate.date();

        days.push({ dayName, dayNumber });

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
