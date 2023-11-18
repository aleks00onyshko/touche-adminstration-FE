import { Component } from '@angular/core';
import { DaySelectListComponent } from './day-select-list/day-select-list.component';
import { DateId } from 'src/app/core/model/entities/time-slot';
import { TimeSlotsStore } from './time-slots.store';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-time-slots',
  templateUrl: './time-slots.component.html',
  styleUrls: ['./time-slots.component.scss'],
  standalone: true,
  imports: [DaySelectListComponent, MatIconModule, MatButtonModule],
  providers: [TimeSlotsStore]
})
export class TimeSlotsComponent {
  constructor(private timeSlotsStore: TimeSlotsStore) {}

  public daySelected(dateId: DateId): void {
    this.timeSlotsStore.getTimeSlots$(dateId);
  }
}
