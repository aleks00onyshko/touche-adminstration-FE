import { Injectable } from '@angular/core';
import { DateId } from '../../model/entities/time-slot';
import moment from 'moment';
import { DateManager } from './date-manager';

@Injectable()
export class DateService implements DateManager {
  public getCurrentDate(): Date {
    return moment().toDate();
  }

  public getCurrentDateId(): DateId {
    const today = this.getCurrentDate();
    const dayNumber = this.getDayNumber(today);
    const monthNumber = this.getMonthNumber(today); // already returns padded month like '01'
    const year = this.getYear(today);

    return `${dayNumber}-${monthNumber}-${year}` as DateId;
  }

  public addDaysToDate(date: Date, days: number): Date {
    return moment(date).add(days, 'days').toDate();
  }

  public getDayName(date: Date): string {
    return moment(date).format('ddd');
  }

  public getMonthNumber(date: Date): string {
    return moment(date).format('MM');
  }

  public getDayNumber(date: Date): number {
    return moment(date).date();
  }

  public getYear(date: Date): number {
    return moment(date).year();
  }
}
