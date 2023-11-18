import { Component } from '@angular/core';
import { DaySelectListComponent } from './day-select-list/day-select-list.component';
import { DateId } from 'src/app/core/model/entities/time-slot';

@Component({
  selector: 'app-time-slots',
  templateUrl: './time-slots.component.html',
  styleUrls: ['./time-slots.component.scss'],
  standalone: true,
  imports: [DaySelectListComponent]
})
export class TimeSlotsComponent {
  public daySelected(day: DateId): void {}
}
