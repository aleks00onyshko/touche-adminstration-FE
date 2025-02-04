import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { DaySelectListComponent } from '../day-select-list/day-select-list.component';
import { DateId, TimeSlot } from 'src/app/core/model/entities/time-slot';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { TimeSlotCardReadonlyComponent } from '../time-slot/time-slot-card-readonly/time-slot-card-readonly.component';
import { SpinnerComponent } from 'src/app/shared/components/spinner/spinner.component';
import { Store } from '@ngrx/store';
import { TimeSlotsState } from '../../store/time-slots.reducer';
import { TimeSlotsActions } from '../../store/time-slots.actions';
import {
  selectCurrentDateId,
  selectCurrentLocation,
  selectLoading,
  selectLocations,
  selectSortedTimeSlots,
  selectTables
} from '../../store/time-slots.selectors';
import { TranslateModule } from '@ngx-translate/core';
import { MatSelectModule } from '@angular/material/select';
import { Location } from 'src/app/core/model/entities/location';
import {
  FilterTimeSlotCardControlValue,
  FilterTimeSlotsComponent
} from './filter-time-slot/filter-time-slot.component';

@Component({
  selector: 'app-time-slots',
  templateUrl: './time-slots.component.html',
  styleUrls: ['./time-slots.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    DaySelectListComponent,
    MatIconModule,
    MatButtonModule,
    TimeSlotCardReadonlyComponent,
    SpinnerComponent,
    MatSelectModule,
    MatSelectModule,
    TranslateModule,
    FilterTimeSlotsComponent
  ]
})
export class TimeSlotsComponent {
  protected readonly timeSlots$ = this.store.select(selectSortedTimeSlots);
  protected readonly loading$ = this.store.select(selectLoading);
  protected readonly locations$ = this.store.select(selectLocations);
  protected readonly tables$ = this.store.select(selectTables);
  protected readonly currentLocation$ = this.store.select(selectCurrentLocation);
  protected readonly currentDateId$ = this.store.select(selectCurrentDateId);

  constructor(private store: Store<TimeSlotsState>) {}

  protected filterChange(filter: FilterTimeSlotCardControlValue): void {
    this.store.dispatch(TimeSlotsActions.filterTimeSlots({ filter }));
  }

  protected resetFilter(): void {
    this.store.dispatch(TimeSlotsActions.resetFilter());
  }

  protected daySelected(dateId: DateId): void {
    this.store.dispatch(TimeSlotsActions.selectDay({ dateId }));
    this.store.dispatch(TimeSlotsActions.getTimeSlots({}));
  }

  protected locationSelected(location: Location): void {
    this.store.dispatch(TimeSlotsActions.setCurrentLocation({ location }));
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
}
