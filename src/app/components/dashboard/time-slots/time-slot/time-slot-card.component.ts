import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation, forwardRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatInputModule } from '@angular/material/input';
import {
  ControlValueAccessor,
  FormControl,
  FormGroup,
  FormsModule,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  Validator
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { TimePickerComponent } from 'src/app/shared/components/time-picker/time-picker.component';
import { TimeSlot } from 'src/app/core/model/entities/time-slot';
import { ReactiveComponent } from 'src/app/core/classes/reactive';
import { filter, takeUntil } from 'rxjs';
import { TimeSlotDurationPipe } from './time-slot-duration.pipe';
import { timeSlotCardValidator } from './config/time-slot.validator';
import { DateService } from 'src/app/core/services/date.service';
import { TimeSlotCardValidationErrors } from './config/validation.errors';

export interface TimeSlotCardControlIncomeValue extends Pick<TimeSlot, 'startTime' | 'endTime'> {}
export interface TimeSlotCardControlOutcomeValue extends Pick<TimeSlot, 'startTime' | 'endTime' | 'duration'> {}
export type TimeSlotCardControlStructure = {
  startTime: FormControl<[number, number] | null>;
  endTime: FormControl<[number, number] | null>;
};

@Component({
  selector: 'app-time-slot-card',
  standalone: true,
  imports: [
    CommonModule,
    NgxMatTimepickerModule,
    MatInputModule,
    MatButtonModule,
    NgxMatMomentModule,
    MatCardModule,
    ReactiveFormsModule,
    FormsModule,
    TimePickerComponent,
    TimeSlotDurationPipe
  ],
  templateUrl: './time-slot-card.component.html',
  styleUrls: ['./time-slot-card.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TimeSlotCardComponent), // tslint:disable-line
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => TimeSlotCardComponent), // tslint:disable-line
      multi: true
    }
  ],
  encapsulation: ViewEncapsulation.None
})
export class TimeSlotCardComponent extends ReactiveComponent implements OnInit, ControlValueAccessor, Validator {
  public readonly timeSlotForm = new FormGroup<TimeSlotCardControlStructure>(
    {
      startTime: new FormControl(null),
      endTime: new FormControl(null)
    },
    { validators: timeSlotCardValidator(this.dateService) }
  );
  public readonly controls: TimeSlotCardControlStructure = {
    startTime: this.timeSlotForm.controls.startTime,
    endTime: this.timeSlotForm.controls.endTime
  };

  public onChangeFn!: (value: TimeSlotCardControlOutcomeValue) => void;
  public onTouchFn!: () => void;

  constructor(private cdr: ChangeDetectorRef, private dateService: DateService) {
    super();
  }

  public ngOnInit(): void {
    this.timeSlotForm.valueChanges
      .pipe(
        takeUntil(this.unsubscribe$),
        filter(() => !!this.onChangeFn)
      )
      .subscribe(value =>
        this.onChangeFn({
          startTime: value.startTime,
          endTime: value.endTime,
          duration: this.dateService.getDifferenceBetweenStartAndEndTime(value.startTime, value.endTime)
        } as TimeSlotCardControlOutcomeValue)
      );
  }

  public writeValue(value: TimeSlotCardControlIncomeValue | null): void {
    if (value) {
      this.timeSlotForm.patchValue(value);
    }
  }

  public registerOnChange(fn: (value: TimeSlotCardControlIncomeValue) => void): void {
    this.onChangeFn = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouchFn = fn;
  }

  public setDisabledState(disabled: boolean): void {
    disabled ? this.timeSlotForm.disable() : this.timeSlotForm.enable();
    this.cdr.detectChanges();
  }

  public validate(): TimeSlotCardValidationErrors | null {
    return timeSlotCardValidator(this.dateService)(this.timeSlotForm);
  }
}
