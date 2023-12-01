import { createSelector } from '@ngrx/store';
import { selectDashboardState } from '../../../store/dashboard.selectors';
import { DashboardState } from '../../../store/dashboard.reducer';

export const selectTimeSlotsState = createSelector(selectDashboardState, (state: DashboardState) => state.timeSlots);

export const selectCurrentDateId = createSelector(selectTimeSlotsState, state => state.currentDateId);
export const selectLoading = createSelector(selectTimeSlotsState, state => state.loading);
export const selectTimeSlots = createSelector(selectTimeSlotsState, state => state.timeSlots);
export const selectTeachers = createSelector(selectTimeSlotsState, state => state.teachers);
