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
  public backgroundColor: string = '#666666';
  public backgroundImageUrl: string | null = null;
  public size: number | AVATAR_SIZE = AVATAR_SIZE.m;
  public fontSize: number | TEXT_SIZE = TEXT_SIZE.m;
  public cssClass: string = '';
  public email: string = '';
  public username: string = '';
  public placeholder: string = '';
  public id: string = '';
}
