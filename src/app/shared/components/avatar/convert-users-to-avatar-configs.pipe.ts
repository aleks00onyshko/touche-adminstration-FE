import { Pipe, PipeTransform } from '@angular/core';
import { User } from 'src/app/core/model/entities/user';
import { AvatarBuilderService } from './avatar-builder.service';
import { AVATAR_SIZE, AvatarConfiguration } from './avatar.config';

@Pipe({
  name: 'convertUsersToAvatarConfigs',
  standalone: true
})
export class ConvertUsersToAvatarConfigsPipe implements PipeTransform {
  constructor(private avatarBuilderService: AvatarBuilderService) {}

  public transform(users: User[], size: AVATAR_SIZE = AVATAR_SIZE.s): AvatarConfiguration[] {
    return users.map(user => this.avatarBuilderService.createAvatarConfigurationForUser(user, size));
  }
}
