import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { TimeSlotsComponent } from './time-slots/time-slots.component';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    component: DashboardComponent,
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
