import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { TimeSoltsComponent } from './time-solts/time-solts.component';

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
        component: TimeSoltsComponent,
        path: 'time-slots'
      }
    ]
  }
];
