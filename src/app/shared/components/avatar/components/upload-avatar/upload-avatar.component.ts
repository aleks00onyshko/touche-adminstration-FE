import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarWithFileUpload } from '../../models/avatar-with-upload';
import { AvatarComponent } from '../avatar/avatar.component';
import { MatIconModule } from '@angular/material/icon';
import { TeacherSettingsState } from '../../../../../components/dashboard/components/teacher-settings/store/teacher-settings.reducer';
import { Store } from '@ngrx/store';
import { TeacherSettingsAction } from '../../../../../components/dashboard/components/teacher-settings/store/teacher-settings.actions';

@Component({
  selector: 'app-upload-avatar',
  standalone: true,
  imports: [CommonModule, AvatarComponent, MatIconModule],
  templateUrl: './upload-avatar.component.html',
  styleUrls: ['./upload-avatar.component.scss']
})
export class UploadAvatarComponent {
  @Input({ required: true }) public uploadAvatar!: AvatarWithFileUpload;

  @Output() public onUploadNewImage = new EventEmitter<string>();

  constructor(private store: Store<TeacherSettingsState>) {}

  protected async upload(): Promise<void> {
    this.onUploadNewImage.emit(await this.uploadAvatar.uploadFn());
  }
}
