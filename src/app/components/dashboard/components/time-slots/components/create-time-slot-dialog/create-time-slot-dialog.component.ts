import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TimeSlotCardControlValue, TimeSlotCardComponent } from '../time-slot/time-slot-card.component';
import * as moment from 'moment';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Teacher } from 'src/app/core/model/entities/teacher';
import { TranslateModule } from '@ngx-translate/core';

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
    TranslateModule
  ],
  templateUrl: './create-time-slot-dialog.component.html',
  styleUrls: ['./create-time-slot-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateTimeSlotDialogComponent {
  public readonly defaultTimes: [number, number] = [moment().hour(), moment().minute()];

  public readonly timeSlotControl: FormControl<TimeSlotCardControlValue | null> =
    new FormControl<TimeSlotCardControlValue>({
      startTime: this.defaultTimes,
      duration: 15,
      teacher: null
    });

  constructor(
    private readonly matDialogRef: MatDialogRef<CreateTimeSlotDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: CreateTimeSlotDialogData
  ) {}

  public saveTimeSlot(value: TimeSlotCardControlValue): void {
    this.matDialogRef.close(value);
  }
}

export interface CreateTimeSlotDialogResponse extends TimeSlotCardControlValue {}

export interface CreateTimeSlotDialogData {
  teachers: Teacher[];
}
