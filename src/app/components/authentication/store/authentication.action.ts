import { User } from '@angular/fire/auth';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const AuthenticationActions = createActionGroup({
  source: 'Authentication',
  events: {
    'Get User': emptyProps(),
    Authenticated: props<{ user: User }>(),
    // 'Onboard Teacher': props<{ user: User }>(),
    'Not Authenticated': emptyProps(),
    'Email Register': props<{ email: string; password: string }>(),
    'Email Login': props<{ email: string; password: string }>(),
    'Google Login': emptyProps(),
    Logout: emptyProps(),
    Error: props<{ error: string }>()
  }
});
