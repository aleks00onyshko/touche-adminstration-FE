import { ChangeDetectionStrategy, Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Store, StoreModule } from '@ngrx/store';
import { map, Observable, tap } from 'rxjs';
import { SystembarComponent } from '../../shared/components/systembar/systembar.component';
import { AuthenticationState } from '../authentication/store/authentication.reducer';
import { selectUser } from '../authentication/store/authentication.selectors';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { ProjectSettingsActions } from 'src/styles/store/projectSettings.action';
import { LocalStorageService } from '../../core/services/local-storage.service';
import { selectTheme } from 'src/styles/store/projectSettings.selectors';
import { CommonModule, DOCUMENT } from '@angular/common';
import { Theme } from 'src/styles/store/projectSettings.reducer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    RouterModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    StoreModule,
    MatSelectModule
],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
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
