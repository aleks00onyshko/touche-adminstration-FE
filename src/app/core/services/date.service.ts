import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DateService {
  public getDifferenceBetweenStartAndEndTime(
    startTime?: [number, number] | null | undefined,
    endTime?: [number, number] | null | undefined
  ): number | null {
    if (!endTime || !startTime) {
      console.warn(`TimeSlotDurationPipe: endTime ot satrtTime is not defined`);
      return null;
    } else {
      const [startHour, endHour] = [startTime[0], endTime[0]];
      const [startMinute, endMinute] = [startTime[1], endTime[1]];

      if (endHour - startHour > 0) {
        if (endMinute - startMinute <= 0) {
          if (endMinute - startMinute === 0) {
            return (endHour - startHour) * 60;
          }

          return (endHour - startHour) * 60 + (endMinute - startMinute);
        }
      }

      if (endHour - startHour === 0) {
        if (endMinute - startMinute >= 0) {
          return endMinute - startMinute;
        }
      }

      console.warn(`TimeSlotDurationPipe: endTime: ${endTime} should bigger then startTime: ${startTime}`);
      return null;
    }
  }
}
