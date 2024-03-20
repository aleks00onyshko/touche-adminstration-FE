import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeSlotCardComponent, TimeSlotCardControlValue } from '../time-slot/time-slot-card.component';
import { ReactiveFormsModule, FormsModule, FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { Teacher } from 'src/app/core/model/entities/teacher';
import { TimeSlot } from 'src/app/core/model/entities/time-slot';
import { AvatarBuilderService } from 'src/app/shared/components/avatar/avatar-builder.service';
import { User } from 'src/app/core/model/entities/user';
import { timeSlotHasTimeTurnerSyndromeValidator } from '../time-slot/config/validators/time-turner-syndrome-async.validator';
import { TimeSlotsState } from '../../store/time-slots.reducer';
import { Store } from '@ngrx/store';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TimeSlotCardValidationErrorsEnum } from '../time-slot/config/validation.errors';

@Component({
  selector: 'app-edit-time-slot-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    TimeSlotCardComponent,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    MatFormFieldModule
  ],
  templateUrl: './edit-time-slot-dialog.component.html',
  styleUrls: ['./edit-time-slot-dialog.component.scss']
})
export class EditTimeSlotDialogComponent {
  public readonly timeSlotControl: FormControl<TimeSlotCardControlValue | null> =
    new FormControl<TimeSlotCardControlValue>(
      {
        startTime: this.dialogData.timeSlot.startTime,
        duration: this.dialogData.timeSlot.duration,
        teacher: this.avatarBuilderService.createAvatarCofigurationForUser(
          this.dialogData.teachers.find(teacher => teacher.id === this.dialogData.timeSlot.teacherId) as User
        )
      },
      { asyncValidators: [timeSlotHasTimeTurnerSyndromeValidator(this.store, this.dialogData.timeSlot.id)] }
    );
  protected timeSlotCardErrors: typeof TimeSlotCardValidationErrorsEnum = TimeSlotCardValidationErrorsEnum;

  constructor(
    private store: Store<TimeSlotsState>,
    private avatarBuilderService: AvatarBuilderService,
    private readonly matDialogRef: MatDialogRef<EditTimeSlotDialogComponent, EditTimeSlotDialogResponse>,
    @Inject(MAT_DIALOG_DATA) public dialogData: EditTimeSlotDialogData
  ) {}

  public saveTimeSlot(value: TimeSlotCardControlValue): void {
    this.matDialogRef.close({ initialTimeSlot: this.dialogData.timeSlot, timeSlotCardControlValue: value });
  }
}

export interface EditTimeSlotDialogData {
  timeSlot: TimeSlot;
  teachers: Teacher[];
}

export interface EditTimeSlotDialogResponse {
  timeSlotCardControlValue: TimeSlotCardControlValue;
  initialTimeSlot: TimeSlot;
}
 