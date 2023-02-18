import { Injectable } from '@angular/core';
import { User } from '@angular/fire/auth';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';
import { AuthenticationState } from '../../../store/authentication/authentication.reducer';
import { selectUser } from '../../../store/authentication/authentication.selectors';
import { AvatarConfigBuilder, AvatarConfiguration, AVATAR_SIZE } from './avatar.config';

@Injectable({ providedIn: 'root' })
export class AvatarBuilderService {
  constructor(private store: Store<AuthenticationState>) {}

  public createAvatarConfigurationFurCurrentUser$(): Observable<AvatarConfiguration> {
    return this.getAvatarBuilder(this.store.select(selectUser), AVATAR_SIZE.m).pipe(map(builder => builder.build()));
  }

  private getAvatarBuilder(
    user$: Observable<User | null>,
    size: AVATAR_SIZE
  ): Observable<AvatarConfigBuilder<AvatarConfiguration>> {
    return user$.pipe(
      map(user =>
        new AvatarConfigBuilder()
          .withUsername(user!.displayName ?? user!.email ?? '')
          .withSize(size)
          .withBackgroundColor('#666666')
      )
    );
  }
}
