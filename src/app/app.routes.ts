import { Routes } from '@angular/router';
import { AuthenticationGuard } from './core/services/authentication.guard';
import { LoginGuard } from './core/services/login.guard';

export const appRoutes: Routes = [
  {
    path: 'authentication',
    canActivate: [LoginGuard],
    loadChildren: () => import('./authentication/authentication.routes').then(m => m.authenticationRoutes)
  },
  {
    path: 'dashboard',
    canActivate: [AuthenticationGuard],
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  { path: '', redirectTo: '/authentication', pathMatch: 'full' }
];
