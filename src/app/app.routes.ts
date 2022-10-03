import { Routes } from '@angular/router';
import { AuthenticationGuard } from './core/services/guards/authentication.guard';
import { LoginGuard } from './core/services/guards/login.guard';

export const appRoutes: Routes = [
  {
    path: 'authentication',
    canActivate: [LoginGuard],
    loadChildren: () => import('./components/authentication/authentication.routes').then(m => m.authenticationRoutes)
  },
  {
    path: 'dashboard',
    canActivate: [AuthenticationGuard],
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'shop/:id',
    canActivate: [AuthenticationGuard],
    loadComponent: () => import('./components/shop/shop.component').then(m => m.ShopComponent)
  },
  { path: '', redirectTo: '/authentication', pathMatch: 'full' }
];
