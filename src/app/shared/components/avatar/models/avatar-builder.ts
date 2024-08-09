import { User } from '../../../../core/model/entities/user';
import { Avatar, ToucheAvatar } from './avatar';
import { AvatarWithFileUpload, ToucheAvatarWithFileUpload } from './avatar-with-upload';
import { AvatarConfigurationBuilder } from './avatar-configuration-builder';
import { AVATAR_SIZE, AvatarConfiguration } from './avatar-configuration';
import { Injectable } from '@angular/core';
import { FileUpload } from '../../../../core/model/file-upload/file-upload.service';
import { FileExtractor } from '../../../../core/model/file-extractor/file-extract.service';

export abstract class AvatarBuilder {
  protected constructor(
    protected avatarConfigurationBuilder: AvatarConfigurationBuilder<AvatarConfiguration>,
    protected fileUpload: FileUpload,
    protected fileExtractor: FileExtractor
  ) {}

  abstract createAvatar(user: User): Avatar;
  abstract createAvatarWithUpload(user: User): AvatarWithFileUpload;
}

@Injectable()
export class ToucheAvatarBuilder extends AvatarBuilder {
  constructor(
    avatarConfigurationBuilder: AvatarConfigurationBuilder<AvatarConfiguration>,
    fileUpload: FileUpload,
    fileExtractor: FileExtractor
  ) {
    super(avatarConfigurationBuilder, fileUpload, fileExtractor);
  }

  public createAvatar(user: User): Avatar {
    console.log('from pipe', user);
    const avatar = new ToucheAvatar(this.getDefaultAvatarConfiguration(user));

    console.log('from pipe', avatar, this.getDefaultAvatarConfiguration(user));

    return avatar;
  }

  public createAvatarWithUpload(user: User): AvatarWithFileUpload {
    return new ToucheAvatarWithFileUpload(
      this.getDefaultAvatarConfiguration(user),
      this.fileUpload,
      this.fileExtractor
    );
  }

  private getDefaultAvatarConfiguration(user: User, size: AVATAR_SIZE = AVATAR_SIZE.s): AvatarConfiguration {
    console.log('from pipe, what user', user);

    return this.avatarConfigurationBuilder
      .withId(user.uid)
      .withUsername(user!.displayName ?? user!.email ?? '')
      .withPlaceholder(user!.displayName ?? user!.email ?? '')
      .withSize(size)
      .withBackgroundImageUrl(user!.backgroundImageUrl)
      .build();
  }
}
