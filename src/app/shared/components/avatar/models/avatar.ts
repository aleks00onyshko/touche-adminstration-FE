import { AvatarConfiguration } from './avatar-configuration';

export abstract class Avatar {
  public configuration!: AvatarConfiguration;

  protected constructor(config: AvatarConfiguration) {
    this.configuration = config;
  }
}

export class ToucheAvatar extends Avatar {
  constructor(config: AvatarConfiguration) {
    super(config);
  }
}
