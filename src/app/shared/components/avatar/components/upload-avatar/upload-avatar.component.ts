import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarWithFileUpload } from '../../models/avatar-with-upload';
import { AvatarComponent } from '../avatar/avatar.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-upload-avatar',
  standalone: true,
  imports: [CommonModule, AvatarComponent, MatIconModule],
  templateUrl: './upload-avatar.component.html',
  styleUrls: ['./upload-avatar.component.scss']
})
export class UploadAvatarComponent {
  @Input({ required: true }) public uploadAvatar!: AvatarWithFileUpload;
}
