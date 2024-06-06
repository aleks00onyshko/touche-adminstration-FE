import { HttpErrorResponse } from '@angular/common/http';

import { Action, createReducer, on } from '@ngrx/store';
import { reducer } from 'src/styles/store/projectSettings.reducer';
import { TeacherSettingsAction } from './teacher-settings.actions';
import { state } from '@angular/animations';
import { error } from 'console';
import { Teacher } from 'src/app/core/model/entities/teacher';

export const TEACHERS_SETTINGS_FEATURE_KEY = 'paymentSlots';

export interface TeacherSettingsState {
  loading: boolean;
  teachers: Teacher[] | null;
  error: HttpErrorResponse | null;
}

export const initialState: TeacherSettingsState = {
  loading: false,
  error: null,
  teachers: null
};

export const teacherReducer = createReducer(
  initialState,
  on(TeacherSettingsAction.getTeachersSuccess, (state, { teachers }) => ({
    ...state,
    teachers,
    loading: false
  })),
  on(TeacherSettingsAction.getTeachers, state => ({
    ...state,
    loading: true
  })),
  on(TeacherSettingsAction.getTeachersFailed, (state, { error }) => ({
    ...state,
    error,
    loading: false
  }))
);

export function teachersSettingsReducer(
  state: TeacherSettingsState = initialState,
  action: Action
): TeacherSettingsState {
  return teacherReducer(state, action);
}
