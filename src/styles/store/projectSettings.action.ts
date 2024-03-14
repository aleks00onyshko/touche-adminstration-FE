import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Language, Theme } from './projectSettings.reducer';

export const ProjectSettingsActions = createActionGroup({
  source: 'Project Settings',
  events: {
    'Set Theme': props<{theme: Theme}>(),
    'Set Language': props<{language: Language}>(),
    Logout: emptyProps(),
    Error: props<{ error: string }>()
  }
})