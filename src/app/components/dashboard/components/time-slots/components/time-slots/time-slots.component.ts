import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { DaySelectListComponent } from '../day-select-list/day-select-list.component';
import { DateId, TimeSlot } from 'src/app/core/model/entities/time-slot';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TimeSlotCardComponent } from '../time-slot/time-slot-card.component';
import { CommonModule } from '@angular/common';
import { TimeSlotCardReadonlyComponent } from '../time-slot/time-slot-card-readonly/time-slot-card-readonly.component';
import { SpinnerComponent } from 'src/app/shared/components/spinner/spinner.component';
import { Store } from '@ngrx/store';
import { TimeSlotsState } from '../../store/time-slots.reducer';
import { TimeSlotsActions } from '../../store/time-slots.actions';
import { CalendarComponent } from '../../../../../../shared/components/calendar/calendar.component';
import {
  selectCurrentLocation,
  selectLoading,
  selectLocations,
  selectTimeSlots,
  showCalendar
} from '../../store/time-slots.selectors';
import { TranslateModule } from '@ngx-translate/core';
import { MatSelectModule } from '@angular/material/select';
import { Location } from 'src/app/core/model/entities/location';
import { DashboardComponent } from '../../../dashboard/dashboard.component';
import { Observable, take } from 'rxjs';

@Component({
  selector: 'app-time-slots',
  templateUrl: './time-slots.component.html',
  styleUrls: ['./time-slots.component.scss'],
  standalone: true,
  imports: [
    CalendarComponent,
    CommonModule,
    DaySelectListComponent,
    MatIconModule,
    MatButtonModule,
    TimeSlotCardComponent,
    TimeSlotCardReadonlyComponent,
    SpinnerComponent,
    MatSelectModule,
    MatSelectModule,
    DashboardComponent,
    TranslateModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class TimeSlotsComponent {
  protected readonly timeSlots$ = this.store.select(selectTimeSlots);
  protected readonly loading$ = this.store.select(selectLoading);
  protected readonly locations$ = this.store.select(selectLocations);
  protected readonly currentLocation$ = this.store.select(selectCurrentLocation);
  protected readonly showCalendar$ = this.store.select(showCalendar);

  constructor(private store: Store<TimeSlotsState>) {}

  protected daySelected(dateId: DateId): void {
    this.store.dispatch(TimeSlotsActions.selectDay({ dateId }));
    this.store.dispatch(TimeSlotsActions.getTimeSlots());
  }

  protected locationSelected(location: Location): void {
    this.store.dispatch(TimeSlotsActions.setCurrentLocation({ location }));
    this.store.dispatch(TimeSlotsActions.getTimeSlots());
  }

  protected openEditTimeSlotDialog(timeSlot: TimeSlot): void {
    this.store.dispatch(TimeSlotsActions.openEditTimeSlotDialog({ timeSlot }));
  }

  protected openCreateTimeSlotDialog(): void {
    this.store.dispatch(TimeSlotsActions.openCreateTimeSlotDialog());
  }

  protected deleteTimeSlot(id: string): void {
    this.store.dispatch(TimeSlotsActions.deleteTimeSlot({ id }));
  }

  protected compareLocations(l1: Location, l2: Location): boolean {
    return l1.id === l2.id;
  }

  protected sortTimeSlots(timeSlots: TimeSlot[]): TimeSlot[] {
    return timeSlots.slice().sort((a, b) => {
      const startTimeA = a.startTime[0];
      const startTimeB = b.startTime[0];
      const durationA = a.startTime[1];
      const durationB = b.startTime[1];

      const endTimeA = startTimeA + durationA;
      const endTimeB = startTimeB + durationB;

      return endTimeA - endTimeB;
    });
  }
  protected trackByLocationId(index: number, location: Location): string {
    return location.id;
  }

  public toggleView(showCalendarData: boolean | null): void {
    console.log(showCalendarData);
    this.store.dispatch(TimeSlotsActions.toggleCalendar({ showCalendar: !(showCalendarData ?? false) }));
  }

  public trackByTimeSlotId(index: number, timeSlot: TimeSlot): string {
    return timeSlot.id;
  }
}
