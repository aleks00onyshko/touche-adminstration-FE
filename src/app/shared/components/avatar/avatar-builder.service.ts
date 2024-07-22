import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, map, Observable } from 'rxjs';
import { AvatarConfigBuilder, AvatarConfiguration, AVATAR_SIZE } from './avatar.config';
import { User } from 'src/app/core/model/entities/user';
import { AuthenticationState } from 'src/app/components/authentication/store/authentication.reducer';
import { selectUser } from 'src/app/components/authentication/store/authentication.selectors';
import { FileExtractor } from '../../../core/model/file-extractor/file-extract.service';
import { FileUpload } from '../../../core/model/file-upload/file-upload.service';

@Injectable({ providedIn: 'root' })
export class AvatarBuilderService {
  constructor(
    private store: Store<AuthenticationState>,
    private fileExtractor: FileExtractor,
    private fileUpload: FileUpload
  ) {}

  public createAvatarConfigurationFurCurrentUser$(size?: AVATAR_SIZE): Observable<AvatarConfiguration> {
    return (this.store.select(selectUser) as Observable<User | null>).pipe(
      filter(Boolean),
      map(user => this.createAvatarConfigurationForUser(user, size))
    );
  }

  public createAvatarConfigurationForUser(
    user: User,
    size: AVATAR_SIZE = AVATAR_SIZE.m,
    withFileExtractor: boolean = false
  ): AvatarConfiguration {
    return this.getConfiguredAvatarBuilder(user, size, withFileExtractor).build();
  }

  private getConfiguredAvatarBuilder(
    user: User,
    size: AVATAR_SIZE,
    withFileExtractor: boolean = false
  ): AvatarConfigBuilder<AvatarConfiguration> {
    const builder = new AvatarConfigBuilder()
      .withId(user.uid)
      .withUsername(user!.displayName ?? user!.email ?? '')
      .withSize(size)
      .withBackgroundImageUrl(user!.backgroundImageUrl);

    // builder.withFileUploadImplementation(this.fileUpload)

    return withFileExtractor ? builder.withFileExtractorImplementation(this.fileExtractor) : builder;
  }
}

// 1) Convert this to object with interface AvatarBuilderConfig
//
// export interface AvatarBuilderConfig {
//   user: User;
//   size: AVATAR_SIZE;
//   withFileExtractor: boolean;
//   withFileUpload: boolean;
//
// }

// 2) Add fileUpload to avatar, use builder.withFileUploadImplementation
