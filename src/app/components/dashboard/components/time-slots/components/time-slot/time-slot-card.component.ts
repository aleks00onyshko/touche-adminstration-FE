import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewEncapsulation,
  forwardRef
} from '@angular/core';
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
  Validator,
  Validators
} from '@angular/forms';

import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { TimePickerComponent } from 'src/app/shared/components/time-picker/time-picker.component';
import { TimeSlot } from 'src/app/core/model/entities/time-slot';
import { ReactiveComponent } from 'src/app/core/classes/reactive';
import { takeUntil } from 'rxjs';
import { timeSlotCardValidator } from './config/validators/time-slot.validator';
import { TimeSlotCardValidationErrors, TimeSlotCardValidationErrorsEnum } from './config/validation.errors';
import { TranslateModule } from '@ngx-translate/core';
import { TableMultipleSelectDropdown } from '../../../../../../shared/components/table-multiple-select-dropdown/table-multiple-select-dropdown';
import { Table } from '../../../../../../core/model/entities/table';

export interface TimeSlotCardControlValue extends Pick<TimeSlot, 'startTime'> {
  tables: Table[] | null;
  lessonName: string | null;
  peopleAmount: number | null;
}
export type TimeSlotCardControlStructure = {
  lessonName: FormControl<string | null>;
  startTime: FormControl<[number, number] | null>;
  tables: FormControl<Table[] | null>;
  peopleAmount: FormControl<number | null>;
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
    MatCardModule,
    ReactiveFormsModule,
    FormsModule,
    TimePickerComponent,
    MatSelectModule,
    MatFormFieldModule,
    TranslateModule,
    TableMultipleSelectDropdown
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
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimeSlotCardComponent extends ReactiveComponent implements OnInit, ControlValueAccessor, Validator {
  @Input({ required: true }) public tables!: Table[];

  public readonly timeSlotForm = new FormGroup<TimeSlotCardControlStructure>(
    {
      lessonName: new FormControl(null, [Validators.required]),
      startTime: new FormControl(null, [Validators.required]),
      tables: new FormControl(null, [Validators.required]),
      peopleAmount: new FormControl(null, [Validators.required])
    },
    { validators: timeSlotCardValidator() }
  );
  public readonly controls: TimeSlotCardControlStructure = {
    lessonName: this.timeSlotForm.controls.lessonName,
    startTime: this.timeSlotForm.controls.startTime,
    tables: this.timeSlotForm.controls.tables,
    peopleAmount: this.timeSlotForm.controls.peopleAmount
  };
  public errorsEnum: typeof TimeSlotCardValidationErrorsEnum = TimeSlotCardValidationErrorsEnum;

  public onChangeFn!: (value: TimeSlotCardControlValue) => void;
  public onTouchFn!: () => void;

  constructor(private cdr: ChangeDetectorRef) {
    super();
  }

  public ngOnInit(): void {
    this.timeSlotForm.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(value => {
      this.onChangeFn({
        lessonName: value.lessonName ?? '',
        startTime: value.startTime ?? [0, 0],
        tables: value.tables ?? [],
        peopleAmount: value.peopleAmount ?? 0
      });
    });
  }

  public writeValue(value: TimeSlotCardControlValue | null): void {
    if (value) {
      this.timeSlotForm.patchValue(value, { emitEvent: false });

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
    disabled ? this.timeSlotForm.disable({ emitEvent: false }) : this.timeSlotForm.enable({ emitEvent: false });
    this.cdr.detectChanges();
  }

  public validate(): TimeSlotCardValidationErrors | null {
    return timeSlotCardValidator()(this.timeSlotForm);
  }
}
