import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeSlot } from 'src/app/core/model/entities/time-slot';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { AvatarComponent } from 'src/app/shared/components/avatar/avatar.component';
import { ConvertUsersToAvatarConfigsPipe } from 'src/app/shared/components/avatar/convert-users-to-avatar-configs.pipe';
import { User } from 'src/app/core/model/entities/user';

import { Teacher } from 'src/app/core/model/entities/teacher';
import { InteractiveAvatarsComponent } from '../../../../../../../shared/components/interective-avatars/interactive-avatars.component';

@Component({
  selector: 'app-time-slot-card-readonly',
  standalone: true,
  templateUrl: './time-slot-card-readonly.component.html',
  styleUrls: ['./time-slot-card-readonly.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    TranslateModule,
    AvatarComponent,
    ConvertUsersToAvatarConfigsPipe,
    InteractiveAvatarsComponent
  ],
  providers: [ConvertUsersToAvatarConfigsPipe]
})
export class TimeSlotCardReadonlyComponent {
  @Input({ required: true }) public timeSlot!: TimeSlot;
  @Input({ required: true }) public teachers!: Teacher[];
  @Input() public attendee?: User | undefined;

  @Output() public slotDeleted = new EventEmitter<string>();

  public deleteTimeSlot(id: string): void {
    this.slotDeleted.emit(id);
  }
  public getTeachersAssignedToSlot(): Teacher[] {
    return this.teachers.filter(teacher => this.timeSlot.teachersIds.includes(teacher.id));
  }
}
