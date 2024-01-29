import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PaymentSlotCardControlValue } from '../payment-slot/payment-slot-card.compomemt';
import { paymentSlotsOveralappingValidator } from '../payment-slot/config/validators/payment-slot-async.validator';
import { PaymentSlotsState } from '../../store/payment-slots.reducer';
import { PaymentSlot } from 'src/app/core/model/entities/payment-slot';
import { PaymentSlotCardValidationErrorsEnum } from '../payment-slot/config/validators/validation.errors';
import { PaymentSlotCardComponent,  } from '../payment-slot/payment-slot-card.compomemt';

@Component({
  selector: 'app-edit-payment-slot-dialog',
  standalone: true,
  imports: [
    PaymentSlotCardComponent,
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    MatFormFieldModule
  ],
  templateUrl: './edit-payment-slot-dialog.html',
  styleUrls: ['./edit-payment-slot-dialog.scss']
})
export class EditPaymentSlotDialogComponent {
  public readonly paymentSlotControl: FormControl<PaymentSlotCardControlValue | null> =
    new FormControl<PaymentSlotCardControlValue>(
      {
        price: this.dialogData.paymentSlot.price,
        numberOfClasses: this.dialogData.paymentSlot.numberOfClasses
      },
      { asyncValidators: [paymentSlotsOveralappingValidator(this.store, this.dialogData.paymentSlot.id)] }
    );
  protected paymentSlotCardErrors: typeof PaymentSlotCardValidationErrorsEnum = PaymentSlotCardValidationErrorsEnum;

  constructor(
    private store: Store<PaymentSlotsState>,
    private readonly matDialogRef: MatDialogRef<EditPaymentSlotDialogComponent, EditPaymentSlotDialogResponse>,
    @Inject(MAT_DIALOG_DATA) public dialogData: EditPaymentSlotDialogData
  ) {}

  public savePaymentSlot(value: PaymentSlotCardControlValue): void {
    this.matDialogRef.close({ initialPaymentSlot: this.dialogData.paymentSlot, paymentSlotCardControlValue: value });
  }
}

export interface EditPaymentSlotDialogData {
  paymentSlot: PaymentSlot;
}

export interface EditPaymentSlotDialogResponse {
  paymentSlotCardControlValue: PaymentSlotCardControlValue;
  initialPaymentSlot: PaymentSlot;
}
