import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { DaySelectListComponent } from './day-select-list/day-select-list.component';
import { DateId } from 'src/app/core/model/entities/time-slot';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TimeSlotCardComponent } from './time-slot/time-slot-card.component';
import { CommonModule } from '@angular/common';
import { TimeSlotCardReadonlyComponent } from './time-slot/time-slot-card-readonly/time-slot-card-readonly.component';
import { SpinnerComponent } from 'src/app/shared/components/spinner/spinner.component';
import { Store } from '@ngrx/store';
import { TimeSlotsState } from './store/time-slots.reducer';
import { TimeSlotsActions } from './store/time-slots.actions';
import { selectLoading, selectTeacherById, selectTimeSlots } from './store/time-slots.selectors';

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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimeSlotsComponent implements OnInit {
  public readonly timeSlots$ = this.store.select(selectTimeSlots);
  public readonly loading$ = this.store.select(selectLoading);

  constructor(private store: Store<TimeSlotsState>) {}

  public ngOnInit(): void {
    this.store.dispatch(TimeSlotsActions.getTeachers());
  }

  public daySelected(dateId: DateId): void {
    this.store.dispatch(TimeSlotsActions.selectDay({ dateId }));
    this.store.dispatch(TimeSlotsActions.getTimeSlots({ currentDateId: dateId }));
  }

  public openCreateTimeSlotDialog(): void {
    this.store.dispatch(TimeSlotsActions.openCreateTimeSlotDialog());
  }

  public deleteTimeSlot(id: string): void {
    this.store.dispatch(TimeSlotsActions.deleteTimeSlot({ id }));
  }
}
