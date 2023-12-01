import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { AuthenticationActions } from '../store/authentication.action';
import { MatButtonModule } from '@angular/material/button';
import { AuthenticationState } from '../store/authentication.reducer';

@Component({
  selector: 'app-additional-login-methods',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './additional-login-methods.component.html',
  styleUrls: ['./additional-login-methods.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdditionalLoginMethodsComponent {
  constructor(private store: Store<AuthenticationState>) {}

  public googleLogin(): void {
    this.store.dispatch(AuthenticationActions.googleLogin());
  }
}
