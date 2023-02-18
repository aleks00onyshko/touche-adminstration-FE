import { Pipe, PipeTransform } from '@angular/core';
import { AVATAR_SIZE } from './avatar.config';

@Pipe({
  name: 'avatarSizeModifiers',
  standalone: true
})
export class AvatarSizeModifiersPipe implements PipeTransform {
  public transform(size: AVATAR_SIZE | string): string {
    switch (size) {
      case AVATAR_SIZE.s:
        return 'small';
      case AVATAR_SIZE.m:
        return 'medium';
      case AVATAR_SIZE.l:
        return 'large';
      default:
        return 'custom';
    }
  }
}
