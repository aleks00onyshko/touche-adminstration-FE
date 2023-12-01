import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';
import { TimeSlotsState, timeSlotsReducer } from '../components/time-slots/store/time-slots.reducer';
import { TIMESLOTS_FEATURE_KEY } from '../components/time-slots/store/time-slots.actions';

export const DASHBOARD_FEATURE_KEY = 'dashboard';
export const selectDashboardState = createFeatureSelector<DashboardState>(DASHBOARD_FEATURE_KEY);

export interface DashboardState {
  [TIMESLOTS_FEATURE_KEY]: TimeSlotsState;
}

export const dashboardReducers: ActionReducerMap<DashboardState> = {
  [TIMESLOTS_FEATURE_KEY]: timeSlotsReducer
};
