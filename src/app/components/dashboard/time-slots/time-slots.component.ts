import { Component } from '@angular/core';
import { DaySelectListComponent } from './day-select-list/day-select-list.component';
import { DateId } from 'src/app/core/model/entities/time-slot';
import { TimeSlotsStore } from './time-slots.store';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TimeSlotCardComponent } from './time-slot/time-slot-card.component';
import { CommonModule } from '@angular/common';
import { TimeSlotCardReadonlyComponent } from './time-slot/time-slot-card-readonly/time-slot-card-readonly.component';
import { SpinnerComponent } from 'src/app/shared/components/spinner/spinner.component';

@Component({
  selector: 'app-time-slots',
  templateUrl: './time-slots.component.html',
  styleUrls: ['./time-slots.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    DaySelectListComponent,
    MatIconModule,
    MatButtonModule,
    TimeSlotCardComponent,
    TimeSlotCardReadonlyComponent,
    SpinnerComponent
  ],
  providers: [TimeSlotsStore]
})
export class TimeSlotsComponent {
  public readonly timeSlots$ = this.timeSlotsStore.timeSlots$;
  public readonly loading$ = this.timeSlotsStore.loading$;

  constructor(private timeSlotsStore: TimeSlotsStore) {}

  public daySelected(dateId: DateId): void {
    this.timeSlotsStore.getTimeSlots$(dateId);
  }

  public openCreateTimeSlotDialog(): void {
    this.timeSlotsStore.openCreateTimeSlotDialog$();
  }

  public deleteTimeSlot(id: string): void {
    this.timeSlotsStore.delateTimeSlot$(id);
  }
}
