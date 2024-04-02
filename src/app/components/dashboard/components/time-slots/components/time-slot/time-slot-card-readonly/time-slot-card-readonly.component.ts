import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
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

@Component({
  selector: 'app-time-slot-card-readonly',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    TranslateModule,
    AvatarComponent,
    ConvertUsersToAvatarConfigsPipe
  ],
  templateUrl: './time-slot-card-readonly.component.html',
  styleUrls: ['./time-slot-card-readonly.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimeSlotCardReadonlyComponent {
  @Input({ required: true }) public timeSlot!: TimeSlot;

  @Output() public slotDeleted = new EventEmitter<string>();

  public readonly teacherById$ = (id: string) => this.store.select(selectTeacherById(id));
  public readonly userById$ = (id: string) => this.store.select(selectUserById(id));

  constructor(private store: Store<TimeSlotsState>) {

  }

  public deleteTimeSlot(id: string): void {
    this.slotDeleted.emit(id);
  }
}
