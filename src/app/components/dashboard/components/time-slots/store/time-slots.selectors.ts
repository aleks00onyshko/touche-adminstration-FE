import { createSelector } from '@ngrx/store';
import { selectDashboardState } from '../../../store/dashboard.selectors';
import { DashboardState } from '../../../store/dashboard.reducer';
import { TimeSlotCardControlValue } from '../components/time-slot/time-slot-card.component';

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

    const startTimeToMinutes = (startTime: [number, number]) => startTime[0] * 60 + startTime[1];
    const endTimeToMinutes = (startTime: [number, number], duration: number) =>
      startTimeToMinutes(startTime) + duration;
    const inRange = (timeInMinutes: number, [startTime, endTime]: [number, number]) => {
      return timeInMinutes >= startTime && timeInMinutes <= endTime;
    };

    return timeSlots.some(timeSLot => {
      const timeSlotRange: [number, number] = [
        startTimeToMinutes(timeSLot.startTime),
        endTimeToMinutes(timeSLot.startTime, timeSLot.duration)
      ];
      const comparedTimeSlotRange = [
        startTimeToMinutes(timeSlotCardValue.startTime),
        endTimeToMinutes(timeSlotCardValue.startTime, timeSlotCardValue.duration)
      ];
      const timeSlotOverlaps =
        inRange(comparedTimeSlotRange[0], timeSlotRange) ||
        inRange(comparedTimeSlotRange[1], timeSlotRange) ||
        (comparedTimeSlotRange[0] < timeSlotRange[0] && comparedTimeSlotRange[1] > timeSlotRange[1]);

      return timeSLot.teacherId === timeSlotCardValue.teacher?.id && timeSlotOverlaps;
    });
  });
