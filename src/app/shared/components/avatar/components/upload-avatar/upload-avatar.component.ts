import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarWithFileUpload } from '../../models/avatar-with-upload';
import { AvatarComponent } from '../avatar/avatar.component';
import { MatIconModule } from '@angular/material/icon';
import { BehaviorSubject } from 'rxjs';
import { SimpleChangesGeneric } from '../../../../../core/model/simple-changes-generic.model';

@Component({
  selector: 'app-upload-avatar',
  standalone: true,
  imports: [CommonModule, AvatarComponent, MatIconModule],
  templateUrl: './upload-avatar.component.html',
  styleUrls: ['./upload-avatar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UploadAvatarComponent implements OnChanges {
  @Input({ required: true }) public uploadAvatar!: AvatarWithFileUpload;

  @Output() public onUploadNewImage = new EventEmitter<string>();

  protected avatar$ = new BehaviorSubject<AvatarWithFileUpload>(this.uploadAvatar);

  public ngOnChanges({ uploadAvatar }: SimpleChangesGeneric<UploadAvatarComponent>): void {
    this.avatar$.next(uploadAvatar.currentValue);
  }

  protected async upload(): Promise<void> {
    const downloadUrl = await this.avatar$.getValue().uploadFn();

    // backgroundImageUrl is changed in avatar, just letting UI know, that it was updated
    this.avatar$.next({ ...this.avatar$.getValue() });
    this.onUploadNewImage.emit(downloadUrl);
  }
}
