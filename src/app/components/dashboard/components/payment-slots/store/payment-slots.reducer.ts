import { HttpErrorResponse } from '@angular/common/http';
import { Action, createReducer, on } from '@ngrx/store';
import { PaymentSlot } from 'src/app/core/model/entities/payment-slot';
import { PaymentSlotAction } from './payment-slots.actions';
import { User } from '@angular/fire/auth';

export const PAYMENT_SLOTS_FEATURE_KEY = 'paymentSlots';

export interface PaymentSlotsState {
  loading: boolean;
  users: User[] | null;
  error: HttpErrorResponse | null;
  paymentSlots: PaymentSlot[] | null;
}

export const initialState: PaymentSlotsState = {
  loading: false,
  error: null,
  users: null,
  paymentSlots: null
};

export const reducer = createReducer(
  initialState,
  on(PaymentSlotAction.getPaymentSlotsSuccess, (state, { paymentSlots }) => ({
    ...state,
    paymentSlots,
    loading: false
  })),
  on(
    PaymentSlotAction.getPaymentSlots,
    PaymentSlotAction.createPaymentSlot,
    PaymentSlotAction.editPaymentSlot,

    state => ({
      ...state,
      loading: true
    })
  ),
  on(PaymentSlotAction.createPaymentSlotFailed, (state, { error }) => ({
    ...state,
    error,
    loading: false
  }))
);

export function paymentSlotsReducer(state: PaymentSlotsState = initialState, action: Action): PaymentSlotsState {
  return reducer(state, action);
}
