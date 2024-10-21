import { ChangeDetectionStrategy, Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
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
import { SystembarComponent } from "../../../../shared/components/systembar/systembar.component";
import { Store } from '@ngrx/store';
import { Observable, map, tap } from 'rxjs';
import { AuthenticationState } from 'src/app/components/authentication/store/authentication.reducer';
import { selectUser } from 'src/app/components/authentication/store/authentication.selectors';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { ProjectSettingsActions } from 'src/styles/store/projectSettings.action';
import { Theme } from 'src/styles/store/projectSettings.reducer';
import { selectTheme } from 'src/styles/store/projectSettings.selectors';

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
    MatIconModule,
    SystembarComponent
],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {


  private readonly themeAnchor = this.document.getElementById('app-theme');

  public isAuthenticated$!: Observable<boolean>;
  public theme$: Observable<Theme> | undefined;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private store: Store<AuthenticationState>,
    protected localStorageService: LocalStorageService
  ) {}

  public ngOnInit(): void {
    this.isAuthenticated$ = this.store.select(selectUser).pipe(map(user => !!user));
    this.theme$ = this.store.select(selectTheme).pipe(
      map(theme => theme || Theme.DARK_THEME),
      tap(theme => this.setupAnchorBasedOnTheme(theme))
    );
  }

  public changeTheme(theme: Theme): void {
    this.store.dispatch(ProjectSettingsActions.setTheme({ theme }));
    this.localStorageService.set('theme', theme);
    this.setupAnchorBasedOnTheme(theme);
  }

  private setupAnchorBasedOnTheme(theme: Theme): void {
    if (theme === Theme.LIGHT_THEME) {
      this.renderer.setAttribute(this.themeAnchor, 'href', '/light-theme.css');
    } else {
      this.renderer.setAttribute(this.themeAnchor, 'href', '/dark-theme.css');
    }
  }
}
