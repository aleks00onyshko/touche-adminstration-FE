import { Routes } from '@angular/router';
import { AuthenticationGuard } from './../core/services/guards/authentication.guard';
import { LoginGuard } from './../core/services/guards/login.guard';

export const appRoutes: Routes = [
  {
    path: 'authentication',
    canActivate: [LoginGuard],
    loadChildren: () => import('./authentication/authentication.routes').then(m => m.authenticationRoutes)
  },
  {
    path: 'dashboard',
    canActivate: [AuthenticationGuard],
    loadChildren: () => import('./dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES)
  },
  { path: '', redirectTo: '/authentication', pathMatch: 'full' }
];
