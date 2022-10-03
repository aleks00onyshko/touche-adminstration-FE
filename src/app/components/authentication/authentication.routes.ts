import { Routes } from '@angular/router';

// TODO: implement redirecting to login by default
export const authenticationRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./authentication.component').then(
        (m) => m.AuthenticationComponent
      ),
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./login/login.component').then((m) => m.LoginComponent),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./register/register.component').then(
            (m) => m.RegisterComponent
          ),
      },
    ],
  },
];
