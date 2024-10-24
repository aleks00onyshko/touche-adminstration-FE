import { Injectable } from '@angular/core';
import { DateId } from '../../model/entities/time-slot';
import moment from 'moment';

@Injectable({ providedIn: 'root' })
export class DateService {

  getCurrentMoment(): moment.Moment {
    return moment(); 
  }

  getCurrentDateId(): DateId {
    const currentDate = new Date();
    const year = currentDate.getFullYear().toString();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}` as DateId;
  }

  getCurrentTime(): [number, number] {
    const currentDate = new Date();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    
    return [hours, minutes];
  }

  getCurrentDate(): DateId {
    const currentDate = moment();
    const year = currentDate.format('YYYY');
    const month = currentDate.format('MM');
    const day = currentDate.format('DD');

    return `${year}-${month}-${day}` as DateId;
  }

  addDaysToDate(date: moment.Moment, daysToAdd: number): moment.Moment {
    return date.clone().add(daysToAdd, 'days');
  }

  createDateId(dayName: string, dayNumber: number, year: number): DateId {
    return `${dayName}-${dayNumber}-${year}` as DateId;
  }

  formatDate(date: moment.Moment, format: string): string {
    return date.format(format);
  }


  getDayNumber(date: moment.Moment): number {
    return date.date();
  }


  getYear(date: moment.Moment): number {
    return date.year();
  }


  isToday(date: moment.Moment): boolean {
    const currentDate = this.getCurrentMoment();
    return currentDate.isSame(date, 'day'); 
  }

}
