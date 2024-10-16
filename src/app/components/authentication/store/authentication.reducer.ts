import { User } from '@angular/fire/auth';
import { createReducer, on } from '@ngrx/store';
import { AuthenticationActions } from './authentication.action';

export const AUTHENTICATION_FEATURE_NAME = 'authentication';

export interface AuthenticationState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export const initialState: AuthenticationState = {
  user: null,
  loading: false,
  error: null
};

export const authenticationReducer = createReducer(
  initialState,
  on(AuthenticationActions.getUser, state => ({ ...state, loading: true })),
  on(AuthenticationActions.authenticated, (state, { user }) => ({ ...state, user })),
  on(AuthenticationActions.emailLogin, state => ({ ...state, loading: true })),
  on(AuthenticationActions.emailRegister, state => ({ ...state, loading: true })),
  on(AuthenticationActions.notAuthenticated, state => ({ ...state, loading: false })),
  on(AuthenticationActions.googleLogin, AuthenticationActions.emailLogin, state => ({ ...state, loading: true })),
  on(AuthenticationActions.error, (state, { error }) => ({ ...state, error, loading: false })),
  on(AuthenticationActions.logout, state => ({ ...state, user: null, loading: false }))
);
