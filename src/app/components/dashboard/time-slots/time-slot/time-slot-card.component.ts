import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation, forwardRef } from '@angular/core';
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

import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { TimePickerComponent } from 'src/app/shared/components/time-picker/time-picker.component';
import { TimeSlot } from 'src/app/core/model/entities/time-slot';
import { ReactiveComponent } from 'src/app/core/classes/reactive';
import { filter, takeUntil } from 'rxjs';
import { timeSlotCardValidator } from './config/time-slot.validator';
import { TimeSlotCardValidationErrors } from './config/validation.errors';

export interface TimeSlotCardControlValue extends Pick<TimeSlot, 'startTime' | 'duration'> {}
export type TimeSlotCardControlStructure = {
  startTime: FormControl<[number, number] | null>;
  duration: FormControl<number | null>;
};
@Component({
  selector: 'app-time-slot-card',
  standalone: true,
  imports: [
    MatInputModule,
    FormsModule,
    CommonModule,
    NgxMatTimepickerModule,
    MatInputModule,
    MatButtonModule,
    NgxMatMomentModule,
    MatCardModule,
    ReactiveFormsModule,
    FormsModule,
    TimePickerComponent,
    MatSelectModule,
    MatFormFieldModule
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
      duration: new FormControl(null)
    },
    { validators: timeSlotCardValidator() }
  );
  public readonly controls: TimeSlotCardControlStructure = {
    startTime: this.timeSlotForm.controls.startTime,
    duration: this.timeSlotForm.controls.duration
  };
  public durationOptions: number[] = [15, 30, 45, 60, 75, 90, 105, 120];

  public onChangeFn!: (value: TimeSlotCardControlValue) => void;
  public onTouchFn!: () => void;

  constructor(private cdr: ChangeDetectorRef) {
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
          duration: value.duration
        } as TimeSlotCardControlValue)
      );
  }

  public writeValue(value: TimeSlotCardControlValue | null): void {
    if (value) {
      this.timeSlotForm.patchValue(value);
      this.cdr.detectChanges();
    }
  }

  public registerOnChange(fn: (value: TimeSlotCardControlValue) => void): void {
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
    return timeSlotCardValidator()(this.timeSlotForm);
  }
}
