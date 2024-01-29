import { AbstractControl, FormGroup, ValidatorFn } from '@angular/forms';
import { isEmpty } from 'lodash';
import { PaymentSlotCardControlStructure } from '../../payment-slot-card.compomemt';
import { PaymentSlotCardValidationErrors } from './validation.errors';

export function paymentSlotCardValidator(): ValidatorFn {
  return (paymentSlotFormGroup: AbstractControl<any>): PaymentSlotCardValidationErrors | null => {
    const {
      controls: { numberOfClasses, price }
    } = paymentSlotFormGroup as FormGroup<PaymentSlotCardControlStructure>;
    const errors: PaymentSlotCardValidationErrors = {};

    if (!numberOfClasses.value || !price.value) return null;

    return isEmpty(errors) ? null : errors;
  };
}
