import { ChangeDetectionStrategy, Component, Inject, Renderer2 } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
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
import { MatSelectModule } from '@angular/material/select';
import { MatSelectChange } from '@angular/material/select';

import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
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
    MatIconModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  protected opened: boolean = false;
  readonly themeAnchor = this.document.getElementById('app-theme');
  constructor(
    private store: Store<AuthenticationState>,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2
  ) {}

  public logout(): void {
    this.store.dispatch(AuthenticationActions.logout());
  }
  setTheme({ source }: MatSelectChange) {
    if (source.value === 'light') {
      this.renderer.setAttribute(this.themeAnchor, 'href', '/light-theme.css');
    } else {
      this.renderer.setAttribute(this.themeAnchor, 'href', '/dark-theme.css');
    }
  }
}
