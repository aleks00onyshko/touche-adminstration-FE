import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PROJECT_SETTINGS_FEATURE_NAME, ProjectSettingsState } from './projectSettings.reducer';

export const selectProjectSettingsState = createFeatureSelector<ProjectSettingsState>(PROJECT_SETTINGS_FEATURE_NAME);

export const selectTheme = createSelector(selectProjectSettingsState, state => state.theme);
export const selectLanguage = createSelector(selectProjectSettingsState, state => state.language);
