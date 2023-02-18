import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store, StoreModule } from '@ngrx/store';

import { AuthenticationState } from '../../../store/authentication/authentication.reducer';
import { AuthenticationActions } from '../../../store/authentication/authentication.action';
import { AvatarComponent } from '../avatar/avatar.component';
import { AvatarBuilderService } from '../avatar/avatar-builder.service';

@Component({
  selector: 'app-systembar',
  standalone: true,
  imports: [CommonModule, StoreModule, AvatarComponent],
  templateUrl: './systembar.component.html',
  styleUrls: ['./systembar.component.scss']
})
export class SystembarComponent {
  constructor(private store: Store<AuthenticationState>, protected avatarBuilderService: AvatarBuilderService) {}

  public logout(): void {
    this.store.dispatch(AuthenticationActions.logout());
  }
}
