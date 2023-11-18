import { Component } from '@angular/core';
import { DaySelectListComponent } from './day-select-list/day-select-list.component';
import { DateId } from 'src/app/core/model/entities/time-slot.entity';
import { TimeSoltsComponentStore } from './time-slots.store';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-time-slots',
  templateUrl: './time-slots.component.html',
  styleUrls: ['./time-slots.component.scss'],
  standalone: true,
  imports: [CommonModule, DaySelectListComponent],
  providers: [TimeSoltsComponentStore]
})
export class TimeSlotsComponent {
  constructor(public timeSlotsComponentStore: TimeSoltsComponentStore) {}

  public daySelected(dateId: DateId): void {
    this.timeSlotsComponentStore.getTimeSlots$(dateId);
  }
}
