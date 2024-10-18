import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { DaySelectListComponent } from '../time-slots/components/day-select-list/day-select-list.component';
import { SpinnerComponent } from 'src/app/shared/components/spinner/spinner.component';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SidenavToggleButtonComponent } from '../../sidenav-toggle-button/sidenav-toggle-button.component'

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatToolbarModule,
    MatSelectModule,
    MatSidenavModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    SpinnerComponent,
    RouterModule,
    TranslateModule,
    DaySelectListComponent,
    MatIconModule,
    SidenavToggleButtonComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {}
