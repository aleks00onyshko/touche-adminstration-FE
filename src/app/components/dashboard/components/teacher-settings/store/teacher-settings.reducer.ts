import { HttpErrorResponse } from '@angular/common/http';

import { Action, createReducer, on } from '@ngrx/store';
import { TeacherSettingsAction } from './teacher-settings.actions';
import { Teacher } from 'src/app/core/model/entities/teacher';

export const TEACHERS_SETTINGS_FEATURE_KEY = 'teachers';

export interface TeacherSettingsState {
  loading: boolean;
  teachers: Teacher[] | null;
  selectedTeacherId: string | null;
  error: HttpErrorResponse | null;
}

export const initialState: TeacherSettingsState = {
  loading: false,
  error: null,
  teachers: null,
  selectedTeacherId: null
};

export const teacherReducer = createReducer(
  initialState,
  on(TeacherSettingsAction.getTeachersSuccess, (state, { teachers }) => ({
    ...state,
    teachers,
    loading: false,
    selectedTeacherId: state.selectedTeacherId ?? teachers[0].id
  })),
  on(TeacherSettingsAction.getTeachers, state => ({
    ...state,
    loading: true
  })),
  on(TeacherSettingsAction.getTeachersFailed, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
  on(TeacherSettingsAction.selectTeacher, (state, { teacherId }) => ({
    ...state,
    selectedTeacherId: teacherId
  })),
  on(TeacherSettingsAction.updateTeacherSuccess, (state, { teacher }) => ({
    ...state,
    teachers: state.teachers ? state.teachers.map(t => (t.id === teacher.id ? teacher : t)) : null
  })),
  on(TeacherSettingsAction.updateTeacherFailed, (state, { error }) => ({
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
