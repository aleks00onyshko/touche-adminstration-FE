import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store, StoreModule } from '@ngrx/store';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { TranslateService } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { AuthenticationActions } from '../../../components/authentication/store/authentication.action';
import { AvatarComponent } from '../avatar/avatar.component';
import { AvatarBuilderService } from '../avatar/avatar-builder.service';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { AuthenticationState } from 'src/app/components/authentication/store/authentication.reducer';
import { Theme } from 'src/styles/store/projectSettings.reducer';
import { selectTheme } from 'src/styles/store/projectSettings.selectors';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-systembar',
  standalone: true,
  imports: [
    CommonModule,
    StoreModule,
    AvatarComponent,
    MatMenuModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatButtonModule,
    TranslateModule,
    MatIconModule,
    RouterModule
  ],
  templateUrl: './systembar.component.html',
  styleUrls: ['./systembar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SystembarComponent {
  @Input() public theme: Theme | null = null;
  @Output() public themeChange: EventEmitter<Theme> = new EventEmitter<Theme>();

  public Theme: typeof Theme = Theme;
  public theme$: Observable<Theme | null> = this.store.select(selectTheme);

  constructor(
    protected avatarBuilderService: AvatarBuilderService,
    protected translateService: TranslateService,
    protected store: Store<AuthenticationState>,
    protected localStorageService: LocalStorageService
  ) {}

  public changeLanguage(language: string): void {
    this.translateService.use(language);
    this.localStorageService.set('language', language);
  }

  public changeTheme({ value }: MatSelectChange): void {
    this.themeChange.emit(value);
  }

  public logout(): void {
    this.store.dispatch(AuthenticationActions.logout());
  }
}
