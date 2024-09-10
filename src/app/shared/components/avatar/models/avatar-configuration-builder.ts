import { AVATAR_SIZE, AvatarConfiguration } from './avatar-configuration';
import { Injectable } from '@angular/core';

export abstract class AvatarConfigurationBuilderFactory {
  abstract getBuilder(): AvatarConfigurationBuilder;
}

@Injectable()
export class ToucheAvatarConfigurationBuilderFactory implements AvatarConfigurationBuilderFactory {
  public getBuilder(): AvatarConfigurationBuilder {
    return new ToucheAvatarConfigurationBuilder();
  }
}

export abstract class AvatarConfigurationBuilder<T extends AvatarConfiguration = AvatarConfiguration> {
  public abstract config: T;
  abstract withId(id: string): AvatarConfigurationBuilder<T>;
  abstract withUsername(username: string): AvatarConfigurationBuilder<T>;
  abstract withPlaceholder(username: string): AvatarConfigurationBuilder<T>;
  abstract withBackgroundImageUrl(imageUrl: string): AvatarConfigurationBuilder<T>;
  abstract withSize(size: number | AVATAR_SIZE): AvatarConfigurationBuilder<T>;
  abstract withFontSize(fontSize: number): AvatarConfigurationBuilder<T>;
  abstract withBackgroundColor(bgColor: string): AvatarConfigurationBuilder<T>;
  abstract withClass(cssClass: string): AvatarConfigurationBuilder<T>;
  abstract build(): T;
  abstract createConfig(): T;
}

export class ToucheAvatarConfigurationBuilder<T extends AvatarConfiguration> implements AvatarConfigurationBuilder<T> {
  public config: T;

  constructor() {
    this.config = this.createConfig();
  }

  public withId(id: string): AvatarConfigurationBuilder<T> {
    this.config.id = id;
    return this;
  }

  public withUsername(username: string): AvatarConfigurationBuilder<T> {
    this.config.username = username;
    return this;
  }

  public withPlaceholder(username: string): AvatarConfigurationBuilder<T> {
    this.config.placeholder = this.createPlaceholder(username);
    return this;
  }

  public withBackgroundImageUrl(imageUrl: string): AvatarConfigurationBuilder<T> {
    this.config.backgroundImageUrl = imageUrl;
    return this;
  }

  public withSize(size: number | AVATAR_SIZE): AvatarConfigurationBuilder<T> {
    this.config.size = +size;
    return this;
  }

  public withFontSize(fontSize: number): AvatarConfigurationBuilder<T> {
    this.config.fontSize = +fontSize;
    return this;
  }

  public withBackgroundColor(bgColor: string): AvatarConfigurationBuilder<T> {
    this.config.backgroundColor = bgColor;
    return this;
  }

  public withClass(cssClass: string): AvatarConfigurationBuilder<T> {
    this.config.cssClass = cssClass;
    return this;
  }

  public build(): T {
    return this.config;
  }

  public createConfig(): T {
    return new AvatarConfiguration() as T;
  }

  private createPlaceholder(username: string): string {
    const nameAndSurname = username.split(' ');

    return nameAndSurname.length > 1
      ? `${nameAndSurname[0][0]}${nameAndSurname[1][0]}`.toUpperCase()
      : nameAndSurname[0].slice(0, 2);
  }
}
