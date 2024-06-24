import { createSelector } from '@ngrx/store';
import { DashboardState, selectDashboardState } from '../../../store/dashboard.reducer';

export const selectTeacherSettingsState = createSelector(
  selectDashboardState,
  (state: DashboardState) => state.teachers
);

export const selectLoading = createSelector(
  selectTeacherSettingsState,
  state => state.loading
);

export const selectTeachers = createSelector(
  selectTeacherSettingsState,
  state => state.teachers
);


export const selectSelectedTeacherId = createSelector(
  selectTeacherSettingsState,
  state => state.selectedTeacherId
);

