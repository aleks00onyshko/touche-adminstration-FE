import { Action, createReducer, on } from '@ngrx/store';
import { ProjectSettingsActions } from './projectSettings.action';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';

export const PROJECT_SETTINGS_FEATURE_NAME = 'projectSettings';

export enum Theme {
  DARK_THEME = 'DARK_THEME',
  LIGHT_THEME = 'LIGHT_THEME'
}

export enum Language {
  EN = 'en',
  UK = 'uk'
}

export interface ProjectSettingsState {
  theme: Theme | null;
  language: Language | null;
}
export const initialState: ProjectSettingsState = {
  theme: localStorage.getItem(`${LocalStorageService.TOUCHE_LOCALSTORAGE_KEY}-theme`) as Theme,
  language: localStorage.getItem(`${LocalStorageService.TOUCHE_LOCALSTORAGE_KEY}-language`) as Language
};

export const reducer = createReducer(
  initialState,
  on(ProjectSettingsActions.setTheme, (state, { theme }) => ({ ...state, theme })),
  on(ProjectSettingsActions.setLanguage, (state, { language }) => ({ ...state, language }))
);

export function projectSettingsReducer(
  state: ProjectSettingsState = initialState,
  action: Action
): ProjectSettingsState {
  return reducer(state, action);
}
