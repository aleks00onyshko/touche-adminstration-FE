import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { DaySelectListComponent } from '../time-slots/components/day-select-list/day-select-list.component';
import { SpinnerComponent } from 'src/app/shared/components/spinner/spinner.component';
import { AuthenticationActions } from 'src/app/components/authentication/store/authentication.action';
import { AuthenticationState } from 'src/app/components/authentication/store/authentication.reducer';

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
