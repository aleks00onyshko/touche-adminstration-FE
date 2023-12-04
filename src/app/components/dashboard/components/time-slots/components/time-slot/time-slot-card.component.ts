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
import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { TimePickerComponent } from 'src/app/shared/components/time-picker/time-picker.component';
import { TimeSlot } from 'src/app/core/model/entities/time-slot';
import { ReactiveComponent } from 'src/app/core/classes/reactive';
import { takeUntil } from 'rxjs';
import { timeSlotCardValidator } from './config/validators/time-slot.validator';
import { TimeSlotCardValidationErrors, TimeSlotCardValidationErrorsEnum } from './config/validation.errors';
import { AvatarsDropdownComponent } from 'src/app/shared/components/avatars-dropddown/avatars-dropdown.component';
import { AvatarConfiguration } from 'src/app/shared/components/avatar/avatar.config';
import { Teacher } from 'src/app/core/model/entities/teacher';
import { AvatarBuilderService } from 'src/app/shared/components/avatar/avatar-builder.service';
import { ConvertUsersToAvatarConfigsPipe } from 'src/app/shared/components/avatar/convert-users-to-avatar-configs.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { TimeSlotsState } from '../../store/time-slots.reducer';
import { timeSlotHasTimeTurnerSyndromeValidator } from './config/validators/time-turner-syndrome-async.validator';

export interface TimeSlotCardControlValue extends Pick<TimeSlot, 'startTime' | 'duration'> {
  teacher: AvatarConfiguration | null;
}
export type TimeSlotCardControlStructure = {
  startTime: FormControl<[number, number] | null>;
  duration: FormControl<number | null>;
  teacher: FormControl<AvatarConfiguration | null>;
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
    MatFormFieldModule,
    AvatarsDropdownComponent,
    ConvertUsersToAvatarConfigsPipe,
    TranslateModule
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
  @Input({ required: true }) public teachers!: Teacher[];

  public readonly timeSlotForm = new FormGroup<TimeSlotCardControlStructure>(
    {
      startTime: new FormControl(null, [Validators.required]),
      duration: new FormControl(null, [Validators.required]),
      teacher: new FormControl(null, [Validators.required])
    },
    { validators: timeSlotCardValidator(), asyncValidators: [timeSlotHasTimeTurnerSyndromeValidator(this.store)] }
  );
  public readonly controls: TimeSlotCardControlStructure = {
    startTime: this.timeSlotForm.controls.startTime,
    duration: this.timeSlotForm.controls.duration,
    teacher: this.timeSlotForm.controls.teacher
  };
  public durationOptions: number[] = [15, 30, 45, 60, 75, 90, 105, 120];
  public errorsEnum: typeof TimeSlotCardValidationErrorsEnum = TimeSlotCardValidationErrorsEnum;

  public onChangeFn!: (value: TimeSlotCardControlValue) => void;
  public onTouchFn!: () => void;

  constructor(private cdr: ChangeDetectorRef, private store: Store<TimeSlotsState>) {
    super();
  }

  public ngOnInit(): void {
    this.timeSlotForm.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(value =>
      this.onChangeFn({
        startTime: value.startTime ?? [0, 0],
        duration: value.duration ?? this.durationOptions[0],
        teacher: value.teacher ?? new AvatarConfiguration()
      })
    );
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
