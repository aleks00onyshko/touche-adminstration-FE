import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';
import { TimeSlotsState, timeSlotsReducer } from '../components/time-slots/store/time-slots.reducer';
import { TIMESLOTS_FEATURE_KEY } from '../components/time-slots/store/time-slots.actions';
import {
  PAYMENT_SLOTS_FEATURE_KEY,
  PaymentSlotsState,
  paymentSlotsReducer
} from '../components/payment-slots/store/payment-slots.reducer';
import { TEACHERS_SETTINGS_FEATURE_KEY } from '../components/teacher-settings/store/teacher-settings.actions';
import { TeacherSettingsState, teachersSettingsReducer } from '../components/teacher-settings/store/teacher-settings.reducer';

export const DASHBOARD_FEATURE_KEY = 'dashboard';
export const selectDashboardState = createFeatureSelector<DashboardState>(DASHBOARD_FEATURE_KEY);

export interface DashboardState {
  [TIMESLOTS_FEATURE_KEY]: TimeSlotsState;
  [PAYMENT_SLOTS_FEATURE_KEY]: PaymentSlotsState;
  [TEACHERS_SETTINGS_FEATURE_KEY]: TeacherSettingsState;
}

export const dashboardReducers: ActionReducerMap<DashboardState> = {
  [TIMESLOTS_FEATURE_KEY]: timeSlotsReducer,
  [PAYMENT_SLOTS_FEATURE_KEY]: paymentSlotsReducer,
  [TEACHERS_SETTINGS_FEATURE_KEY]: teachersSettingsReducer
};
