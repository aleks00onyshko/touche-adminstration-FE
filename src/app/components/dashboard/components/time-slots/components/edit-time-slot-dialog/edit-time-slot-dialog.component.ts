import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeSlotCardComponent, TimeSlotCardControlValue } from '../time-slot/time-slot-card.component';
import { ReactiveFormsModule, FormsModule, FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { Teacher } from 'src/app/core/model/entities/teacher';
import { TimeSlot } from 'src/app/core/model/entities/time-slot';
import { timeSlotHasTimeTurnerSyndromeValidator } from '../time-slot/config/validators/time-turner-syndrome-async.validator';
import { TimeSlotsState } from '../../store/time-slots.reducer';
import { Store } from '@ngrx/store';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TimeSlotCardValidationErrorsEnum } from '../time-slot/config/validation.errors';
import { AvatarFactory } from '../../../../../../shared/components/avatar/models/avatar-factory';
import { Table } from '../../../../../../core/model/entities/table';

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
    new FormControl<TimeSlotCardControlValue>(this.generateTimeSlotControlData(this.dialogData), {
      asyncValidators: [timeSlotHasTimeTurnerSyndromeValidator(this.store, this.dialogData.timeSlot.id)]
    });
  protected timeSlotCardErrors: typeof TimeSlotCardValidationErrorsEnum = TimeSlotCardValidationErrorsEnum;

  constructor(
    private store: Store<TimeSlotsState>,
    private avatarFactory: AvatarFactory,
    private readonly matDialogRef: MatDialogRef<EditTimeSlotDialogComponent, EditTimeSlotDialogResponse>,
    @Inject(MAT_DIALOG_DATA) public dialogData: EditTimeSlotDialogData
  ) {}

  public saveTimeSlot(value: TimeSlotCardControlValue): void {
    this.matDialogRef.close({ initialTimeSlot: this.dialogData.timeSlot, timeSlotCardControlValue: value });
  }

  private generateTimeSlotControlData(dialogData: EditTimeSlotDialogData): TimeSlotCardControlValue {
    const lessonName = dialogData.timeSlot.lessonName;
    const startTime = dialogData.timeSlot.startTime;
    const duration = dialogData.timeSlot.duration;
    const tables = this.dialogData.tables.filter(table => this.dialogData.timeSlot.tableIds.includes(table.id));

    return { lessonName, startTime, duration, tables };
  }
}

export interface EditTimeSlotDialogData {
  timeSlot: TimeSlot;
  tables: Table[];
}

export interface EditTimeSlotDialogResponse {
  timeSlotCardControlValue: TimeSlotCardControlValue;
  initialTimeSlot: TimeSlot;
}
