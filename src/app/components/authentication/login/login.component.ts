import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AdditionalLoginMethodsComponent } from '../additional-login-methods/additional-login-methods.component';
import { AuthenticationState } from '../../../store/authentication/authentication.reducer';
import { Store } from '@ngrx/store';
import { AuthenticationActions } from '../../../store/authentication/authentication.action';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    AdditionalLoginMethodsComponent,
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  public loginForm = new FormGroup({
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    password: new FormControl<string>('', [Validators.required])
  });

  constructor(private store: Store<AuthenticationState>) {}

  public login(): void {
    const { email, password } = this.loginForm.value;

    this.store.dispatch(AuthenticationActions.emailLogin({ email: email as string, password: password as string }));
  }
}
