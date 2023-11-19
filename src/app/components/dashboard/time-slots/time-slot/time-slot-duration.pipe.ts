import { Pipe, PipeTransform } from '@angular/core';
import { TimeSlotCardControlIncomeValue } from './time-slot-card.component';
import { DateService } from 'src/app/core/services/date.service';

@Pipe({
  name: 'timeSlotDuration',
  standalone: true
})
export class TimeSlotDurationPipe implements PipeTransform {
  constructor(private dateService: DateService) {}

  public transform({ startTime, endTime }: TimeSlotCardControlIncomeValue): number | null {
    return this.dateService.getDifferenceBetweenStartAndEndTime(startTime, endTime);
  }
}
