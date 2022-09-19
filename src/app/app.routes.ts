import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: 'authentication',
    loadChildren: () =>
      import('./authentication/authentication.routes').then(
        (m) => m.authenticationRoutes
      ),
  },
  { path: '', redirectTo: '/authentication', pathMatch: 'full' },
];
