import { Routes } from '@angular/router';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { TimeSlotsComponent } from '../components/time-slots/components/time-slots/time-slots.component';
import { importProvidersFrom } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { DASHBOARD_FEATURE_KEY, dashboardReducers } from '../store/dashboard.reducer';
import { EffectsModule } from '@ngrx/effects';
import { TimeSlotsEffects } from '../components/time-slots/store/time-slots.effects';
import { PaymentSlotsComponent } from '../components/payment-slots/components/payment-slots/payment-slots.component';
import { timeSlotsResolver } from './resolvers/time-slots.resolver';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    component: DashboardComponent,
    providers: [
      importProvidersFrom(
        StoreModule.forFeature(DASHBOARD_FEATURE_KEY, dashboardReducers),
        EffectsModule.forFeature([TimeSlotsEffects])
      )
    ],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'time-slots'
      },
      {
        component: PaymentSlotsComponent,
        path: 'payment-slots'
      },
      {
        component: TimeSlotsComponent,
        path: 'time-slots',
        resolve: [timeSlotsResolver]
      }
    ]
  }
];
