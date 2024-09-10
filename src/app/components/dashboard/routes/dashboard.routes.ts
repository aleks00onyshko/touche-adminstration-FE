import { Routes } from '@angular/router';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { TimeSlotsComponent } from '../components/time-slots/components/time-slots/time-slots.component';
import { provideState } from '@ngrx/store';
import { DASHBOARD_FEATURE_KEY, dashboardReducers } from '../store/dashboard.reducer';
import { provideEffects } from '@ngrx/effects';

import { PaymentSlotsComponent } from '../components/payment-slots/components/payment-slots/payment-slots.component';
import { timeSlotsResolver } from './resolvers/time-slots.resolver';
import { paymentSlotsResolver } from './resolvers/payment-slots.resolver';
import { TeachersSettingsComponent } from '../components/teacher-settings/teachers-settings.component';
import { teachersSettingsResolver } from './resolvers/teachers-settings.resolver';

import * as timeSlotsEffects from '../components/time-slots/store/time-slots.effects';
import * as teacherSettingsEffects from '../components/teacher-settings/store/teacher-settings.effects';
import * as paymentSlotsEffects from '../components/payment-slots/store/payment-slots.effects';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    component: DashboardComponent,
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
        component: PaymentSlotsComponent,
        path: 'payment-slots',
        resolve: [paymentSlotsResolver]
      },
      {
        component: TimeSlotsComponent,
        path: 'time-slots',
        resolve: [timeSlotsResolver]
      },
      {
        component: TeachersSettingsComponent,
        path: 'teachers-settings',
        resolve: [teachersSettingsResolver]
      }
    ]
  }
];
