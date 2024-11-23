import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../../../../core/model/entities/user';
import { AvatarConfiguration } from '../models/avatar-configuration';
import { AvatarFactory } from '../models/avatar-factory';
import { Avatar } from '../models/avatar';
import { AvatarWithFileUpload } from '../models/avatar-with-upload';

@Pipe({
  name: 'convertUsersToAvatars',
  standalone: true
})
export class ConvertUsersToAvatarsPipe implements PipeTransform {
  constructor(private avatarBuilder: AvatarFactory) {}

  public transform(
    users: User[],
    params?: Partial<AvatarConfiguration>,
    withUpload: boolean = false
  ): (Avatar | AvatarWithFileUpload)[] {
    return users.map(user =>
      withUpload
        ? this.avatarBuilder.createAvatarWithUpload(user, params)
        : this.avatarBuilder.createAvatar(user, params)
    );
  }
}
