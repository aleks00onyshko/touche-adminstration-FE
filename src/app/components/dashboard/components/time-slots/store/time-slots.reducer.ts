import { Action, createReducer, on } from '@ngrx/store';
import { Teacher } from 'src/app/core/model/entities/teacher';
import { DateId, TimeSlot } from 'src/app/core/model/entities/time-slot';
import { TimeSlotsActions } from './time-slots.actions';
import { HttpErrorResponse } from '@angular/common/http';
import { Location } from 'src/app/core/model/entities/location';
import { FilterTimeSlotCardControlValue } from '../components/time-slots/filter-time-slot/filter-time-slot.component';
import { Table } from '../../../../../core/model/entities/table';

export interface TimeSlotsState {
  currentDateId: DateId | null;
  loading: boolean;
  timeSlots: TimeSlot[] | null;
  tables: Table[] | null;
  locations: Location[] | null;
  currentLocation: Location | null;
  error: HttpErrorResponse | null;
  constraints: FilterTimeSlotCardControlValue | null;
}

export const initialState: TimeSlotsState = {
  currentDateId: null,
  loading: false,
  timeSlots: null,
  tables: null,
  locations: null,
  currentLocation: null,
  error: null,
  constraints: null
};

const reducer = createReducer(
  initialState,
  on(TimeSlotsActions.selectDay, (state, { dateId }) => ({ ...state, currentDateId: dateId })),
  on(
    TimeSlotsActions.getTimeSlots,
    TimeSlotsActions.createTimeSlot,
    TimeSlotsActions.getTables,
    TimeSlotsActions.getLocations,
    TimeSlotsActions.deleteTimeSlot,
    TimeSlotsActions.editTimeSlot,
    state => ({
      ...state,
      loading: true
    })
  ),
  on(TimeSlotsActions.getTimeSlotsSuccess, (state, { timeSlots }) => ({ ...state, timeSlots, loading: false })),
  on(
    TimeSlotsActions.getTimeSlotsFailed,
    TimeSlotsActions.createTimeSlotFailed,
    TimeSlotsActions.editTimeSlotFailed,
    TimeSlotsActions.getTablesFailed,
    TimeSlotsActions.getLocationsFailed,
    TimeSlotsActions.deleteTimeSlotFailded,
    (state, { error }) => ({
      ...state,
      error,
      loading: false
    })
  ),
  on(TimeSlotsActions.getTablesSuccess, (state, { tables }) => ({ ...state, tables })),
  on(TimeSlotsActions.getLocationsSuccess, (state, { locations }) => ({ ...state, locations })),
  on(TimeSlotsActions.deleteTimeSlotSuccess, (state, { id }) => ({
    ...state,
    timeSlots: (state.timeSlots ?? []).filter(timeSlot => timeSlot.id !== id)
  })),
  on(TimeSlotsActions.setCurrentLocation, (state, { location }) => ({
    ...state,
    currentLocation: location
  }))
);

export function timeSlotsReducer(state: TimeSlotsState = initialState, action: Action): TimeSlotsState {
  return reducer(state, action);
}
