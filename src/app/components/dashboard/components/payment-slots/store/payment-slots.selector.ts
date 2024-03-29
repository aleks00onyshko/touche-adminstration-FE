import { createSelector } from '@ngrx/store';
import { selectDashboardState } from '../../../store/dashboard.selectors';
import { DashboardState } from '../../../store/dashboard.reducer';
import { PaymentSlotCardControlValue } from '../components/payment-slot/payment-slot-card.compomemt';

export const selectPaymentSlotsState = createSelector(
  selectDashboardState,
  (state: DashboardState) => state.paymentSlots
);

export const selectLoading = createSelector(selectPaymentSlotsState, state => state.loading);
export const selectPaymentSlots = createSelector(selectPaymentSlotsState, state => state.paymentSlots);

export const paymentSlotsOverlappingByPriceAndClasses = (
  paymentSlotControlValue: PaymentSlotCardControlValue,
  editedPaymentSlotId: string = ''
) =>
  createSelector(selectPaymentSlots, paymentSlotsItems => {
    const filteredItems = editedPaymentSlotId
      ? (paymentSlotsItems ?? []).filter(el => el.id !== editedPaymentSlotId)
      : paymentSlotsItems ?? [];

    return filteredItems.some(
      el => el.price === paymentSlotControlValue.price || el.numberOfClasses === paymentSlotControlValue.numberOfClasses
    );
  });
