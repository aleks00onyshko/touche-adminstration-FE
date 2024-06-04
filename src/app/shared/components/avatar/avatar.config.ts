export enum AVATAR_SIZE {
  s = 20,
  m = 30,
  l = 40,
  xl = 60,
  xxl = 80,
  xxxl = 160
}

export enum TEXT_SIZE {
  s = 8,
  m = 12,
  l = 16,
  xl = 30,
  xxxl = 60
}

export class AvatarConfiguration {
  public static INACTIVE_BG_COLOR = 'rgba(0,0,0,0.3)';
  public backgroundColor: string = '#666666';
  public image: string = '';
  public size: number | AVATAR_SIZE = AVATAR_SIZE.m;
  public fontSize: number | TEXT_SIZE = TEXT_SIZE.m;
  public cssClass: string = '';
  public email: string = '';
  public username: string = '';
  public placeholder: string = '';
  public id: string = '';
}

export class AvatarConfigBuilder<T extends AvatarConfiguration> {
  protected config: T;

  constructor() {
    this.config = this.createConfig();
  }

  public withId(id: string): AvatarConfigBuilder<T> {
    this.config.id = id;
    return this;
  }

  public withUsername(username: string): AvatarConfigBuilder<T> {
    this.config.username = username;
    this.config.placeholder = this.createPlaceholder(username);
    return this;
  }

  public withSize(size: number | AVATAR_SIZE): AvatarConfigBuilder<T> {
    this.config.size = +size;
    return this;
  }

  public withFontSize(fontSize: number): AvatarConfigBuilder<T> {
    this.config.fontSize = +fontSize;
    return this;
  }

  public withBackgroundColor(bgColor: string): AvatarConfigBuilder<T> {
    this.config.backgroundColor = bgColor;
    return this;
  }

  public withClass(cssClass: string): AvatarConfigBuilder<T> {
    this.config.cssClass = cssClass;
    return this;
  }

  public withImage(image: string): AvatarConfigBuilder<T> {
    this.config.image = image;
    return this;
  }

  public small(image: string): AvatarConfigBuilder<T> {
    this.withImage(image).withSize(AVATAR_SIZE.s);
    return this;
  }

  public medium(image: string): AvatarConfigBuilder<T> {
    this.withImage(image).withSize(AVATAR_SIZE.m);
    return this;
  }

  public large(image: string): AvatarConfigBuilder<T> {
    this.withImage(image).withSize(AVATAR_SIZE.l);
    return this;
  }

  public xxxLarge(image: string): AvatarConfigBuilder<T> {
    this.withImage(image).withSize(AVATAR_SIZE.xxxl);
    return this;
  }

  public build(): T {
    return this.config;
  }

  protected createConfig(): T {
    return new AvatarConfiguration() as T;
  }

  private createPlaceholder(username: string): string {
    const nameAndSurname = username.split(' ');

    return nameAndSurname.length > 1
      ? `${nameAndSurname[0][0]}${nameAndSurname[1][0]}`.toUpperCase()
      : nameAndSurname[0].slice(0, 2);
  }
}
