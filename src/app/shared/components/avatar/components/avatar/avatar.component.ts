import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarSizeModifiersPipe } from '../../pipes/avatar-size-modifiers.pipe';
import { MatIconModule } from '@angular/material/icon';
import { Avatar } from '../../models/avatar';
import { AVATAR_SIZE } from '../../models/avatar-configuration';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule, AvatarSizeModifiersPipe, MatIconModule],
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AvatarComponent {
  @Input({ required: true }) avatar!: Avatar;

  protected readonly AVATAR_SIZE = AVATAR_SIZE;
}
