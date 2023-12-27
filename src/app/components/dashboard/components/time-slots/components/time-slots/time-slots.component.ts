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
import {
  selectCurrentLocation,
  selectLoading,
  selectLocations,
  selectTimeSlots
} from '../../store/time-slots.selectors';
import { MatSelectModule } from '@angular/material/select';
import { Location } from 'src/app/core/model/entities/location';
import { DashboardComponent } from '../../../dashboard/dashboard.component';

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
    SpinnerComponent,
    MatSelectModule,
    MatSelectModule,
    DashboardComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class TimeSlotsComponent {
  public readonly timeSlots$ = this.store.select(selectTimeSlots);
  public readonly loading$ = this.store.select(selectLoading);
  public readonly locations$ = this.store.select(selectLocations);
  public readonly currentLocation$ = this.store.select(selectCurrentLocation);

  constructor(private store: Store<TimeSlotsState>) {}

  public daySelected(dateId: DateId): void {
    this.store.dispatch(TimeSlotsActions.selectDay({ dateId }));
    this.store.dispatch(TimeSlotsActions.getTimeSlots());
  }

  public locationSelected(location: Location): void {
    this.store.dispatch(TimeSlotsActions.setCurrentLocation({ location }));
    this.store.dispatch(TimeSlotsActions.getTimeSlots());
  }

  public openEditTimeSlotDialog(timeSlot: TimeSlot): void {
    this.store.dispatch(TimeSlotsActions.openEditTimeSlotDialog({ timeSlot }));
  }

  public openCreateTimeSlotDialog(): void {
    this.store.dispatch(TimeSlotsActions.openCreateTimeSlotDialog());
  }

  public deleteTimeSlot(id: string): void {
    this.store.dispatch(TimeSlotsActions.deleteTimeSlot({ id }));
  }
}