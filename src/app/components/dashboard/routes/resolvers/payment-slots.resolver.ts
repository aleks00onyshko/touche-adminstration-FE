import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, filter, switchMap, take, tap } from 'rxjs';
import { PaymentSlotAction } from '../../components/payment-slots/store/payment-slots.actions';
import { PaymentSlotsState } from '../../components/payment-slots/store/payment-slots.reducer';
import { selectPaymentSlots } from '../../components/payment-slots/store/payment-slots.selector';
import { PaymentSlot } from 'src/app/core/model/entities/payment-slot';

export const paymentSlotsResolver: ResolveFn<Observable<PaymentSlot[] | null>> = () => {
  const store = inject(Store<PaymentSlotsState>);
  store.dispatch(PaymentSlotAction.getPaymentSlots());

  return store.select(selectPaymentSlots).pipe(
    filter(paymentSlots => !!paymentSlots),
    tap(() => {
      if (store) {
        store.dispatch(PaymentSlotAction.getPaymentSlots());
      }
    }),
    take(1)
  );
};
