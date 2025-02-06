import { createSelector } from '@ngrx/store';
import { selectDashboardState } from '../../../store/dashboard.selectors';
import { DashboardState } from '../../../store/dashboard.reducer';

export const selectTimeSlotsState = createSelector(selectDashboardState, (state: DashboardState) => state.timeSlots);

export const selectCurrentDateId = createSelector(selectTimeSlotsState, state => state.currentDateId);
export const selectLoading = createSelector(selectTimeSlotsState, state => state.loading);
export const selectTimeSlots = createSelector(selectTimeSlotsState, state => state.timeSlots);
export const selectCurrentLocation = createSelector(selectTimeSlotsState, state => state.currentLocation);

export const selectCurrentLocationTimeSlots = createSelector(
  selectCurrentLocation,
  selectTimeSlots,
  (location, timeSlots) => (timeSlots ?? []).filter(timeSlot => timeSlot.locationId === location?.id)
);
export const selectTables = createSelector(selectTimeSlotsState, state => state.tables);
export const selectLocations = createSelector(selectTimeSlotsState, state => state.locations);

export const selectSortedTimeSlots = createSelector(selectCurrentLocationTimeSlots, timeSlots => {
  return (
    !!timeSlots &&
    timeSlots.slice().sort((a, b) => {
      const [aHour, aMinute] = a.startTime;
      const [bHour, bMinute] = b.startTime;

      if (aHour !== bHour) {
        return aHour - bHour;
      }

      return aMinute - bMinute;
    })
  );
});
