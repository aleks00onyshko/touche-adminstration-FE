import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarConfiguration } from './avatar.config';
import { AvatarSizeModifiersPipe } from './avatar-size-modifiers.pipe';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule, AvatarSizeModifiersPipe],
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent {
  @Input() avatarConfiguration!: AvatarConfiguration;
}
