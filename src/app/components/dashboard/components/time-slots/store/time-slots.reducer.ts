import { Action, createReducer, on } from '@ngrx/store';
import { Teacher } from 'src/app/core/model/entities/teacher';
import { DateId, TimeSlot } from 'src/app/core/model/entities/time-slot';
import { TimeSlotsActions } from './time-slots.actions';
import { HttpErrorResponse } from '@angular/common/http';

export interface TimeSlotsState {
  currentDateId: DateId | null;
  loading: boolean;
  timeSlots: TimeSlot[] | null;
  teachers: Teacher[] | null;
  error: HttpErrorResponse | null;
}

export const initialState: TimeSlotsState = {
  currentDateId: null,
  loading: false,
  timeSlots: null,
  teachers: null,
  error: null
};

const reducer = createReducer(
  initialState,
  on(TimeSlotsActions.selectDay, (state, { dateId }) => ({ ...state, currentDateId: dateId })),
  on(
    TimeSlotsActions.getTimeSlots,
    TimeSlotsActions.createTimeSlot,
    TimeSlotsActions.getTeachers,
    TimeSlotsActions.deleteTimeSlot,
    state => ({
      ...state,
      loading: true
    })
  ),
  on(TimeSlotsActions.getTimeSlotsSuccess, (state, { timeSlots }) => ({ ...state, timeSlots, loading: false })),
  on(
    TimeSlotsActions.getTimeSlotsFailed,
    TimeSlotsActions.createTimeSlotFailed,
    TimeSlotsActions.getTeachersFailed,
    TimeSlotsActions.deleteTimeSlotFailded,
    (state, { error }) => ({
      ...state,
      error,
      loading: false
    })
  ),
  on(TimeSlotsActions.createTimeSlotSuccess, (state, { timeSlot }) => ({
    ...state,
    timeSlots: [timeSlot, ...(state.timeSlots ?? [])],
    loading: false
  })),
  on(TimeSlotsActions.getTeachersSuccess, (state, { teachers }) => ({ ...state, teachers })),
  on(TimeSlotsActions.deleteTimeSlotSuccess, (state, { id }) => ({
    ...state,
    timeSlots: (state.timeSlots ?? []).filter(timeSlot => timeSlot.id === id)
  }))
);

export function timeSlotsReducer(state: TimeSlotsState = initialState, action: Action): TimeSlotsState {
  return reducer(state, action);
}
