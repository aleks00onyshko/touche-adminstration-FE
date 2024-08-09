import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../../../../core/model/entities/user';
import { AVATAR_SIZE } from '../models/avatar-configuration';
import { AvatarBuilder } from '../models/avatar-builder';
import { Avatar } from '../models/avatar';

// TODO: rename to avatar
@Pipe({
  name: 'convertUsersToAvatarConfigs',
  standalone: true
})
export class ConvertUsersToAvatarConfigsPipe implements PipeTransform {
  constructor(private avatarBuilder: AvatarBuilder) {}

  public transform(users: User[], size: AVATAR_SIZE = AVATAR_SIZE.s, withUpload: boolean = false): Avatar[] {
    console.log('from pipe', users);

    // const a = users.map(user =>
    //   withUpload ? this.avatarBuilder.createAvatarWithUpload(user) : this.avatarBuilder.createAvatar(user)
    // );

    const a = users.map(user => {
      const avatar = this.avatarBuilder.createAvatar(user);

      console.log('from pipe generated user', user, avatar);

      return avatar;
    });

    console.log('from pipe', a);

    return a;
  }
}
