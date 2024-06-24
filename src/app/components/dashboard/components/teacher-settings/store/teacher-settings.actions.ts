import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';
import { Teacher } from 'src/app/core/model/entities/teacher';


export const TEACHERS_SETTINGS_FEATURE_KEY = 'teachers';

export const TeacherSettingsAction = createActionGroup({
  source: 'Teacher Settings',
  events: {
    'Get Teachers': emptyProps(),
    'Get Teachers Failed': props<{ error: HttpErrorResponse }>(),
    'Get Teachers Success': props<{ teachers: Teacher[] }>(),
    'Select Teacher': props<{ teacherId: string }>(),
    'Update Teacher': props<{ teacher: Teacher }>(),
    'Update Teacher Success': props<{ teacher: Teacher }>(),
    'Update Teacher Failed': props<{ error: HttpErrorResponse }>(),
  }
});
