import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: 'authentication',
    loadChildren: () => import('./authentication/authentication.routes').then(m => m.authenticationRoutes)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  { path: '', redirectTo: '/authentication', pathMatch: 'full' }
];
