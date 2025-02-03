import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';
import { TimeSlotsState, timeSlotsReducer } from '../components/time-slots/store/time-slots.reducer';
import { TIMESLOTS_FEATURE_KEY } from '../components/time-slots/store/time-slots.actions';
import {
  TEACHERS_SETTINGS_FEATURE_KEY,
  TeacherSettingsState,
  teachersSettingsReducer
} from '../components/teacher-settings/store/teacher-settings.reducer';

export const DASHBOARD_FEATURE_KEY = 'dashboard';
export const selectDashboardState = createFeatureSelector<DashboardState>(DASHBOARD_FEATURE_KEY);

export interface DashboardState {
  [TIMESLOTS_FEATURE_KEY]: TimeSlotsState;
  [TEACHERS_SETTINGS_FEATURE_KEY]: TeacherSettingsState;
}

export const dashboardReducers: ActionReducerMap<DashboardState> = {
  [TIMESLOTS_FEATURE_KEY]: timeSlotsReducer,
  [TEACHERS_SETTINGS_FEATURE_KEY]: teachersSettingsReducer
};
