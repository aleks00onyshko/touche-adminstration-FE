import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store, StoreModule } from '@ngrx/store';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { TranslateService } from '@ngx-translate/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { AuthenticationActions } from '../../../components/authentication/store/authentication.action';
import { AvatarComponent } from '../avatar/avatar.component';
import { AvatarBuilderService } from '../avatar/avatar-builder.service';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { AuthenticationState } from 'src/app/components/authentication/store/authentication.reducer';

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
  public languageControl = new FormControl(
    this.localStorageService.get('shopLanguage') ?? this.translateService.defaultLang
  );

  constructor(
    protected avatarBuilderService: AvatarBuilderService,
    protected translateService: TranslateService,
    private store: Store<AuthenticationState>,
    private localStorageService: LocalStorageService,
    private router: Router
  ) {}

  public navigateToTheDashboard(): void {
    this.router.navigate(['dashboard']);
  }

  public changeLanguage(language: string): void {
    this.translateService.use(language);
    this.localStorageService.set('shopLanguage', language);
  }

  public logout(): void {
    this.store.dispatch(AuthenticationActions.logout());
  }
}
