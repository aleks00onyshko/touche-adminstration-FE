import { User } from '../../../../core/model/entities/user';
import { Avatar, ToucheAvatar } from './avatar';
import { AvatarWithFileUpload, ToucheAvatarWithFileUpload } from './avatar-with-upload';
import { AvatarConfigurationBuilderFactory } from './avatar-configuration-builder';
import { AVATAR_SIZE, AvatarConfiguration } from './avatar-configuration';
import { Injectable } from '@angular/core';
import { FileUpload } from '../../../../core/model/file-upload/file-upload.service';
import { FileExtractor } from '../../../../core/model/file-extractor/file-extract.service';

export abstract class AvatarFactory {
  abstract createAvatar(user: User, params?: Partial<AvatarConfiguration>): Avatar;
  abstract createAvatarWithUpload(user: User, params?: Partial<AvatarConfiguration>): AvatarWithFileUpload;
}

@Injectable()
export class ToucheAvatarFactory extends AvatarFactory {
  constructor(
    private avatarConfigurationBuilderFactory: AvatarConfigurationBuilderFactory,
    private fileUpload: FileUpload,
    private fileExtractor: FileExtractor
  ) {
    super();
  }

  public createAvatar(user: User, params?: Partial<AvatarConfiguration>): Avatar {
    return new ToucheAvatar(this.getDefaultAvatarConfiguration(user, params));
  }

  public createAvatarWithUpload(user: User, params?: Partial<AvatarConfiguration>): AvatarWithFileUpload {
    return new ToucheAvatarWithFileUpload(
      this.getDefaultAvatarConfiguration(user, params),
      this.fileUpload,
      this.fileExtractor
    );
  }

  private getDefaultAvatarConfiguration(user: User, params?: Partial<AvatarConfiguration>): AvatarConfiguration {
    return this.avatarConfigurationBuilderFactory
      .getBuilder()
      .withId(user.uid)
      .withUsername(user!.displayName ?? user!.email ?? '')
      .withPlaceholder(user!.displayName ?? user!.email ?? '')
      .withSize(params?.size ?? AVATAR_SIZE.s)
      .withBackgroundImageUrl(user!.backgroundImageUrl)
      .build();
  }
}
