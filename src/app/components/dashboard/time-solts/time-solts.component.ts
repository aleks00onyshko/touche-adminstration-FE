import { Component } from '@angular/core';
import { DaySelectListComponent } from './day-select-list/day-select-list.component';
import { DayLabel } from './day-select-list/day-label';
import { DateId } from 'src/app/core/model/entities/time-slot';

@Component({
  selector: 'app-time-solts',
  templateUrl: './time-solts.component.html',
  styleUrls: ['./time-solts.component.scss'],
  standalone: true,
  imports: [DaySelectListComponent]
})
export class TimeSoltsComponent {
  public daySelected(day: DateId): void {}
}
