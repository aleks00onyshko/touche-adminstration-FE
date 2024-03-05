import { Store } from '@ngrx/store';
import { PaymentSlotsState } from '../../../../store/payment-slots.reducer';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { PaymentSlotCardControlValue } from '../../payment-slot-card.compomemt';
import { Observable, map, take } from 'rxjs';
import { paymentSlotsOverlappingByPriceAndClasses } from '../../../../store/payment-slots.selector';
import { PaymentSlotCardValidationErrorsEnum } from './validation.errors';

export function paymentSlotsOveralappingValidator(
  store: Store<PaymentSlotsState>,
  editedPaymentSlotId: string = ''
): AsyncValidatorFn {
  return (
    timeSlotCardControl: AbstractControl<PaymentSlotCardControlValue, PaymentSlotCardControlValue>
  ): Observable<ValidationErrors | null> => {
    return store.select(paymentSlotsOverlappingByPriceAndClasses(timeSlotCardControl.value, editedPaymentSlotId)).pipe(
      take(1),
      map(overlapping => (overlapping ? { [PaymentSlotCardValidationErrorsEnum.OVERLAPS_WITH_OTHER]: true } : null))
    );
  };
}
