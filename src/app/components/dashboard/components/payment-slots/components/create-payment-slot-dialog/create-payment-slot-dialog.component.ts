import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PaymentSlotCardComponent, PaymentSlotCardControlValue } from '../payment-slot/payment-slot-card.compomemt';
import { PaymentSlotsState } from '../../store/payment-slots.reducer';
import { PaymentSlotCardValidationErrorsEnum } from '../payment-slot/config/validators/validation.errors';
import { paymentSlotsOveralappingValidator } from '../payment-slot/config/validators/payment-slot-async.validator';

@Component({
  selector: 'app-create-payment-slot-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    MatFormFieldModule,
    PaymentSlotCardComponent
  ],
  templateUrl: './create-payment-slot-dialog.component.html',
  styleUrls: ['./create-payment-slot-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreatePaymentSlotDialogComponent {
  public readonly paymentSlotControl: FormControl<PaymentSlotCardControlValue | null> =
    new FormControl<PaymentSlotCardControlValue>(
      {
        numberOfClasses: 1,
        price: 150
      },
      { asyncValidators: [paymentSlotsOveralappingValidator(this.store)] }
    );
  protected paymentSlotCardErrors: typeof PaymentSlotCardValidationErrorsEnum = PaymentSlotCardValidationErrorsEnum;

  constructor(
    private store: Store<PaymentSlotsState>,
    private readonly matDialogRef: MatDialogRef<CreatePaymentSlotDialogComponent, CreatePaymentSlotDialogResponse>
  ) {
  }

  public savePaymentSlot(value: PaymentSlotCardControlValue): void {
    this.matDialogRef.close({ paymentSlotCardControlValue: value });
  }
}

export interface CreatePaymentSlotDialogResponse {
  paymentSlotCardControlValue: PaymentSlotCardControlValue;
}
