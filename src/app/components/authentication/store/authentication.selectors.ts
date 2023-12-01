import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthenticationState, AUTHENTICATION_FEATURE_NAME } from './authentication.reducer';

export const selectAuthenticationState = createFeatureSelector<AuthenticationState>(AUTHENTICATION_FEATURE_NAME);

export const selectUser = createSelector(selectAuthenticationState, state => state.user);
export const selectLoading = createSelector(selectAuthenticationState, state => state.loading);
