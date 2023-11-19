import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import {
  TimeSlotCardControlOutcomeValue,
  TimeSlotCardComponent,
  TimeSlotCardControlIncomeValue
} from '../time-slot/time-slot-card.component';
import * as moment from 'moment';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-time-slot-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, TimeSlotCardComponent, ReactiveFormsModule, FormsModule],
  templateUrl: './create-time-slot-dialog.component.html',
  styleUrls: ['./create-time-slot-dialog.component.scss']
})
export class CreateTimeSlotDialogComponent {
  public readonly defaultTimes: [number, number] = [moment().hour(), moment().minute()];

  public readonly timeSlotControl: FormControl<TimeSlotCardControlIncomeValue | null> =
    new FormControl<TimeSlotCardControlIncomeValue>({
      startTime: this.defaultTimes,
      endTime: this.defaultTimes
    });

  constructor(private readonly matDialogRef: MatDialogRef<CreateTimeSlotDialogComponent>) {}

  public saveTimeSlot(value: TimeSlotCardControlOutcomeValue): void {
    this.matDialogRef.close(value);
  }
}

export interface CreateTimeSlotDialogResponse extends TimeSlotCardControlOutcomeValue {}
