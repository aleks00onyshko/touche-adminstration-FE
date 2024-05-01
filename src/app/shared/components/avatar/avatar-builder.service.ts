import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, map, Observable } from 'rxjs';
import { AvatarConfigBuilder, AvatarConfiguration, AVATAR_SIZE } from './avatar.config';
import { User } from 'src/app/core/model/entities/user';
import { AuthenticationState } from 'src/app/components/authentication/store/authentication.reducer';
import { selectUser } from 'src/app/components/authentication/store/authentication.selectors';

@Injectable({ providedIn: 'root' })
export class AvatarBuilderService {
  constructor(private store: Store<AuthenticationState>) {}

  public createAvatarConfigurationFurCurrentUser$(size?: AVATAR_SIZE): Observable<AvatarConfiguration> {
    return (this.store.select(selectUser) as Observable<User | null>).pipe(
      filter(Boolean),
      map(user => this.createAvatarConfigurationForUser(user, size))
    );
  }

  public createAvatarConfigurationForUser(user: User, size: AVATAR_SIZE = AVATAR_SIZE.m): AvatarConfiguration {
    return this.getConfiguredAvatarBuilder(user, size).build();
  }

  private getConfiguredAvatarBuilder(user: User, size: AVATAR_SIZE): AvatarConfigBuilder<AvatarConfiguration> {
    return new AvatarConfigBuilder()
      .withId(user.uid)
      .withUsername(user!.displayName ?? user!.email ?? '')
      .withSize(size)
      .withBackgroundColor('#666666');
  }
}
