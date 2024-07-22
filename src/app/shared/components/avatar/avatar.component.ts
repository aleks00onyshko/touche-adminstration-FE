import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarConfiguration } from './avatar.config';
import { AvatarSizeModifiersPipe } from './avatar-size-modifiers.pipe';
import { MatIconModule } from '@angular/material/icon';
import { map } from 'rxjs';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule, AvatarSizeModifiersPipe, MatIconModule],
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AvatarComponent {
  @Input() avatarConfiguration!: AvatarConfiguration;

  protected uploadClicked() {
    this.avatarConfiguration
      .fileExtractorImplementation!.getFiles()
      .pipe(map(files => console.log(files)))
      .subscribe();
  }
}
