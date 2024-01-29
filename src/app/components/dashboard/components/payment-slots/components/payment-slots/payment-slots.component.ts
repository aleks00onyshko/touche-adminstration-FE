import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Store } from '@ngrx/store';
import { PaymentSlotAction } from '../../store/payment-slots.actions';
import { PaymentSlotsState } from '../../store/payment-slots.reducer';
import { selectLoading, selectPaymentSlots } from '../../store/payment-slots.selector';
import { CommonModule } from '@angular/common';
import { PaymentSlotCardReadonlyComponent } from '../payment-slot-card-readonly/payment-slot-card-readonly';
import { DaySelectListComponent } from '../../../time-slots/components/day-select-list/day-select-list.component';
import { SpinnerComponent } from '../../../../../../shared/components/spinner/spinner.component';
import { PaymentSlot } from 'src/app/core/model/entities/payment-slot';
@Component({
  selector: 'app-payment-slots',
  standalone: true,
  templateUrl: './payment-slots.component.html',
  styleUrls: ['./payment-slots.component.scss'],
  imports: [
    MatButtonModule,
    MatIconModule,
    PaymentSlotCardReadonlyComponent,
    CommonModule,
    DaySelectListComponent,
    SpinnerComponent
  ]
})
export class PaymentSlotsComponent {
  protected readonly paymentSlots$ = this.store.select(selectPaymentSlots);
  protected readonly loading$ = this.store.select(selectLoading);
  constructor(private store: Store<PaymentSlotsState>) {}

  protected openCreatePaymentSlotDialog(): void {
    this.store.dispatch(PaymentSlotAction.openCreatePaymentSlotDialog());
  }
  protected openEditPaymentSlotDialog(paymentSlot: PaymentSlot): void {
    this.store.dispatch(PaymentSlotAction.openEditPaymentSlotDialog({ paymentSlot }));
  }

  protected deletePaymentSlot(id: string): void {
    this.store.dispatch(PaymentSlotAction.deletePaymentSlot({ id }));
  }
}
