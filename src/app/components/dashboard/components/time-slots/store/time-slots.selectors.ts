import { createSelector } from '@ngrx/store';
import { selectDashboardState } from '../../../store/dashboard.selectors';
import { DashboardState } from '../../../store/dashboard.reducer';
import { TimeSlotCardControlValue } from '../components/time-slot/time-slot-card.component';
import { getTimeSlotRangeInMinutes, inRange, timeSlotsOverlap, timeToMinutes } from '../utils/time-slots-sort';
import { TimeSlot } from 'src/app/core/model/entities/time-slot';

export const selectTimeSlotsState = createSelector(selectDashboardState, (state: DashboardState) => state.timeSlots);

export const selectCurrentDateId = createSelector(selectTimeSlotsState, state => state.currentDateId);
export const selectLoading = createSelector(selectTimeSlotsState, state => state.loading);
export const selectTimeSlots = createSelector(selectTimeSlotsState, state => state.timeSlots);
export const selectTeachers = createSelector(selectTimeSlotsState, state => state.teachers);
export const selectLocations = createSelector(selectTimeSlotsState, state => state.locations);
export const selectCurrentLocation = createSelector(selectTimeSlotsState, state => state.currentLocation);

export const selectTeacherById = (teacherId: string) =>
  createSelector(selectTimeSlotsState, state => state.teachers?.find(teacher => teacher.id === teacherId));

export const selectUserById = (userId: string) =>
  createSelector(selectTimeSlotsState, state => state.users?.find(user => user.id === userId));

export const timeSlotHasTimeTurnerSyndrome = (
  timeSlotCardValue: TimeSlotCardControlValue,
  editedTimeSlotId: string = ''
) =>
  createSelector(selectTimeSlots, timeSlotsItems => {
    const timeSlots = editedTimeSlotId
      ? (timeSlotsItems ?? []).filter(timeSlot => timeSlot.id !== editedTimeSlotId)
      : timeSlotsItems ?? [];

    return timeSlots.some(timeSLot => {
      return timeSlotsOverlap(timeSLot, timeSlotCardValue as any as TimeSlot);
    });
  });
