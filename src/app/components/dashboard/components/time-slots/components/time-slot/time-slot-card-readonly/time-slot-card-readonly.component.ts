import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeSlot } from 'src/app/core/model/entities/time-slot';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { TimeSlotsState } from '../../../store/time-slots.reducer';
import { selectTeacherById, selectUserById } from '../../../store/time-slots.selectors';
import { AvatarComponent } from 'src/app/shared/components/avatar/avatar.component';
import { ConvertUsersToAvatarConfigsPipe } from 'src/app/shared/components/avatar/convert-users-to-avatar-configs.pipe';
import { InterectiveAvatarsComponent } from "../../../../../../../shared/components/interective-avatars/interective-avatars.component";
import { AvatarConfiguration } from 'src/app/shared/components/avatar/avatar.config';
import { Teacher } from 'src/app/core/model/entities/teacher';

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
        InterectiveAvatarsComponent
    ],
    providers: [ConvertUsersToAvatarConfigsPipe]
})
export class TimeSlotCardReadonlyComponent {
  @Input({ required: true }) public timeSlot!: TimeSlot;

  @Output() public slotDeleted = new EventEmitter<string>();

  public avatarConfig: AvatarConfiguration[] = [];
  public teachers: Teacher[] = [];

  public readonly teacherById$ = (id: string) => this.store.select(selectTeacherById(id));
  public readonly userById$ = (id: string) => this.store.select(selectUserById(id));

 

  constructor(private store: Store<TimeSlotsState>) {}
  ngOnInit(): void {

    this.timeSlot.teachersIds.forEach((teacherId: string) => {
      this.store.select(selectTeacherById(teacherId)).subscribe((teacher) => {
        if (teacher) {
          this.teachers.push(teacher);
        }
      });
    });
  }
  public deleteTimeSlot(id: string): void {
    this.slotDeleted.emit(id);
  }
}
