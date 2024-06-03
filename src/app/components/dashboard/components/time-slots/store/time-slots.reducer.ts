import { Action, createReducer, on } from '@ngrx/store';
import { Teacher } from 'src/app/core/model/entities/teacher';
import { DateId, TimeSlot } from 'src/app/core/model/entities/time-slot';
import { TimeSlotsActions } from './time-slots.actions';
import { HttpErrorResponse } from '@angular/common/http';
import { Location } from 'src/app/core/model/entities/location';
import { User } from 'src/app/core/model/entities/user';
import { FilterTimeSlotCardControlValue } from '../components/time-slots/filter-time-slot/filter-time-slot.component';

export interface TimeSlotsState {
  currentDateId: DateId | null;
  loading: boolean;
  timeSlots: TimeSlot[] | null;
  teachers: Teacher[] | null;
  users: User[] | null;
  locations: Location[] | null;
  currentLocation: Location | null;
  error: HttpErrorResponse | null;
  constraints: FilterTimeSlotCardControlValue | null;
}

export const initialState: TimeSlotsState = {
  currentDateId: null,
  loading: false,
  timeSlots: null,
  teachers: null,
  users: null,
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
    TimeSlotsActions.getTeachers,
    TimeSlotsActions.getUsers,
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
    TimeSlotsActions.getTeachersFailed,
    TimeSlotsActions.getUsersFailed,
    TimeSlotsActions.getLocationsFailed,
    TimeSlotsActions.deleteTimeSlotFailded,
    (state, { error }) => ({
      ...state,
      error,
      loading: false
    })
  ),
  on(TimeSlotsActions.getTeachersSuccess, (state, { teachers }) => ({ ...state, teachers })),
  on(TimeSlotsActions.getUsersSuccess, (state, { users }) => ({ ...state, users })),
  on(TimeSlotsActions.getLocationsSuccess, (state, { locations }) => ({ ...state, locations })),
  on(TimeSlotsActions.deleteTimeSlotSuccess, (state, { id }) => ({
    ...state,
    timeSlots: (state.timeSlots ?? []).filter(timeSlot => timeSlot.id !== id)
  })),
  on(TimeSlotsActions.setCurrentLocation, (state, { location }) => ({
    ...state,
    currentLocation: location,
    timeSlots: []
  }))
);

export function timeSlotsReducer(state: TimeSlotsState = initialState, action: Action): TimeSlotsState {
  return reducer(state, action);
}
