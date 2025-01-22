import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
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
import { ReactiveComponent } from 'src/app/core/classes/reactive';
import { takeUntil } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { paymentSlotCardValidator } from './config/validators/payment-slot.validator';
import {
  PaymentSlotCardValidationErrors,
  PaymentSlotCardValidationErrorsEnum
} from './config/validators/validation.errors';
import { PaymentSlot } from 'src/app/core/model/entities/payment-slot';

export interface PaymentSlotCardControlValue extends Pick<PaymentSlot, 'numberOfClasses' | 'price'> {}
export type PaymentSlotCardControlStructure = {
  numberOfClasses: FormControl<number | null>;
  price: FormControl<number | null>;
};
@Component({
  selector: 'app-payment-slot-card',
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
    MatSelectModule,
    MatFormFieldModule,
    TranslateModule
  ],
  templateUrl: './payment-slot-card.compomemt.html',
  styleUrls: ['./payment-slot-card.compomemt.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PaymentSlotCardComponent), // tslint:disable-line
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => PaymentSlotCardComponent), // tslint:disable-line
      multi: true
    }
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentSlotCardComponent extends ReactiveComponent implements OnInit, ControlValueAccessor, Validator {
  public readonly paymentSlotForm = new FormGroup<PaymentSlotCardControlStructure>(
    {
      numberOfClasses: new FormControl(null, [Validators.required]),
      price: new FormControl(null, [Validators.required])
    },
    { validators: paymentSlotCardValidator() }
  );
  public readonly controls: PaymentSlotCardControlStructure = {
    numberOfClasses: this.paymentSlotForm.controls.numberOfClasses,
    price: this.paymentSlotForm.controls.price
  };
  public numberOfClassesOptions: number[] = [1, 2, 3, 4, 5, 10, 15];
  public priceOptions: number[] = [150, 300, 450, 600, 750, 900, 1000, 1200];
  public errorsEnum: typeof PaymentSlotCardValidationErrorsEnum = PaymentSlotCardValidationErrorsEnum;

  public onChangeFn!: (value: PaymentSlotCardControlValue) => void;
  public onTouchFn!: () => void;

  constructor(private cdr: ChangeDetectorRef) {
    super();
  }

  public ngOnInit(): void {
    this.paymentSlotForm.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(value =>
      this.onChangeFn({
        numberOfClasses: value.numberOfClasses ?? this.numberOfClassesOptions[1],
        price: value.price ?? this.priceOptions[0]
      })
    );
  }

  public writeValue(value: PaymentSlotCardControlValue | null): void {
    if (value) {
      this.paymentSlotForm.patchValue(value, { emitEvent: false });
      this.cdr.detectChanges();
    }
  }

  public registerOnChange(fn: (value: PaymentSlotCardControlValue) => void): void {
    this.onChangeFn = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouchFn = fn;
  }

  public setDisabledState(disabled: boolean): void {
    disabled ? this.paymentSlotForm.disable({ emitEvent: false }) : this.paymentSlotForm.enable({ emitEvent: false });
    this.cdr.detectChanges();
  }

  public validate(): PaymentSlotCardValidationErrors | null {
    return paymentSlotCardValidator()(this.paymentSlotForm);
  }
}
