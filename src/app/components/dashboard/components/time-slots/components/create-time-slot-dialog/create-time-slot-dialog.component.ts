import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TimeSlotCardControlValue, TimeSlotCardComponent } from '../time-slot/time-slot-card.component';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Teacher } from 'src/app/core/model/entities/teacher';
import { TranslateModule } from '@ngx-translate/core';
import { timeSlotHasTimeTurnerSyndromeValidator } from '../time-slot/config/validators/time-turner-syndrome-async.validator';
import { TimeSlotsState } from '../../store/time-slots.reducer';
import { Store } from '@ngrx/store';
import { TimeSlotCardValidationErrorsEnum } from '../time-slot/config/validation.errors';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DateManager } from 'src/app/core/services/date-service/date-manager';

@Component({
  selector: 'app-create-time-slot-dialog',
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
  templateUrl: './create-time-slot-dialog.component.html',
  styleUrls: ['./create-time-slot-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateTimeSlotDialogComponent {
  public readonly timeSlotControl: FormControl<TimeSlotCardControlValue | null> =
    new FormControl<TimeSlotCardControlValue>(
      {
        startTime: this.dateManager.getCurrentStartTimeTuple(),
        duration: 15,
        teachers: null
      },
      { asyncValidators: [timeSlotHasTimeTurnerSyndromeValidator(this.store)] }
    );
  protected timeSlotCardErrors: typeof TimeSlotCardValidationErrorsEnum = TimeSlotCardValidationErrorsEnum;

  constructor(
    private store: Store<TimeSlotsState>,
    private dateManager: DateManager,
    private readonly matDialogRef: MatDialogRef<CreateTimeSlotDialogComponent, CreateTimeSlotDialogResponse>,
    @Inject(MAT_DIALOG_DATA) public dialogData: CreateTimeSlotDialogData
  ) { }

  public saveTimeSlot(value: TimeSlotCardControlValue): void {
    this.matDialogRef.close({ timeSlotCardControlValue: value });
  }
}

export interface CreateTimeSlotDialogData {
  teachers: Teacher[];
}

export interface CreateTimeSlotDialogResponse {
  timeSlotCardControlValue: TimeSlotCardControlValue;
}
