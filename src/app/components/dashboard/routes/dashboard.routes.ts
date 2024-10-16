import { Routes } from '@angular/router';
import { provideState } from '@ngrx/store';
import { DASHBOARD_FEATURE_KEY, dashboardReducers } from '../store/dashboard.reducer';
import { provideEffects } from '@ngrx/effects';

import { timeSlotsResolver } from './resolvers/time-slots.resolver';

import * as timeSlotsEffects from '../components/time-slots/store/time-slots.effects';
import * as teacherSettingsEffects from '../components/teacher-settings/store/teacher-settings.effects';
import * as paymentSlotsEffects from '../components/payment-slots/store/payment-slots.effects';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./../components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    providers: [
      provideState(DASHBOARD_FEATURE_KEY, dashboardReducers),
      provideEffects(timeSlotsEffects, teacherSettingsEffects, paymentSlotsEffects)
    ],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'time-slots'
      },
      {
        loadComponent: () =>
          import('./../components/payment-slots/components/payment-slots/payment-slots.component').then(
            m => m.PaymentSlotsComponent
          ),
        path: 'payment-slots'
      },
      {
        loadComponent: () =>
          import('./../components/time-slots/components/time-slots/time-slots.component').then(
            m => m.TimeSlotsComponent
          ),
        path: 'time-slots',
        resolve: [timeSlotsResolver]
      },
      {
        loadComponent: () =>
          import('./../components/teacher-settings/teachers-settings.component').then(m => m.TeachersSettingsComponent),
        path: 'teachers-settings'
      }
    ]
  }
];
