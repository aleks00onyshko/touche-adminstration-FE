import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { AuthenticationState } from '../../store/authentication/authentication.reducer';
import { AuthenticationActions } from '../../store/authentication/authentication.action';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { DaySelectListComponent } from './time-slots/day-select-list/day-select-list.component';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    SpinnerComponent,
    RouterModule,
    TranslateModule,
    DaySelectListComponent,
    MatIconModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  constructor(private store: Store<AuthenticationState>) {}

  public logout(): void {
    this.store.dispatch(AuthenticationActions.logout());
  }
}
