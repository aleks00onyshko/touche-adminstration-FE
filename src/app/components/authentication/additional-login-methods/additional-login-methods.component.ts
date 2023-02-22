import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { AuthenticationState } from '../../../store/authentication/authentication.reducer';
import { AuthenticationActions } from '../../../store/authentication/authentication.action';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-additional-login-methods',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './additional-login-methods.component.html',
  styleUrls: ['./additional-login-methods.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AdditionalLoginMethodsComponent {
  constructor(private store: Store<AuthenticationState>) {}

  public googleLogin(): void {
    this.store.dispatch(AuthenticationActions.googleLogin());
  }
}
