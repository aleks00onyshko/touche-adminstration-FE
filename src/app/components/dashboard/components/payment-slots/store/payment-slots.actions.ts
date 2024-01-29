import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { PaymentSlotCardControlValue } from '../components/payment-slot/payment-slot-card.compomemt';
import { HttpErrorResponse } from '@angular/common/http';
import { PaymentSlot } from 'src/app/core/model/entities/payment-slot';
import { User } from 'src/app/core/model/entities/user';

export const PaymentSlotAction = createActionGroup({
  source: 'Payment Slot',
  events: {
    'Get Payment Slots Failed': props<{ error: HttpErrorResponse }>(),
    'Get Payment Slots Success': props<{ paymentSlots: PaymentSlot[] }>(),
    'Get Payment Slots': emptyProps(),
    'Delete Payment Slot': props<{ id: string }>(),
    'Delete Payment Slot Success': props<{ id: string }>(),
    'Delete Payment Slot Failded': props<{ error: HttpErrorResponse }>(),
    'Open Create Payment Slot Dialog': emptyProps(),
    'Open Edit Payment Slot Dialog': props<{ paymentSlot: PaymentSlot }>(),
    'Edit Payment Slot': props<{ initialPaymentSlot: PaymentSlot; paymentSlotCardControlValue: PaymentSlotCardControlValue }>(),
    'Edit Payment Slot Success': props<{ paymentSlot: PaymentSlot }>(),
    'Edit Payment Slot Failed': props<{ error: HttpErrorResponse }>(),
    'Create Payment Slot': props<{ paymentSlotCardControlValue: PaymentSlotCardControlValue }>(),
    'Create Payment Slot Failed': props<{ error: HttpErrorResponse }>(),
    'Create Payment Slot Success': props<{ timeSlot: PaymentSlot }>()
  }
});
