import { Routes } from '@angular/router';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { TimeSlotsComponent } from '../components/time-slots/components/time-slots/time-slots.component';
import { importProvidersFrom } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { DASHBOARD_FEATURE_KEY, dashboardReducers } from '../store/dashboard.reducer';
import { EffectsModule } from '@ngrx/effects';
import { TimeSlotsEffects } from '../components/time-slots/store/time-slots.effects';

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
        component: TimeSlotsComponent,
        path: 'time-slots'
      }
    ]
  }
];
