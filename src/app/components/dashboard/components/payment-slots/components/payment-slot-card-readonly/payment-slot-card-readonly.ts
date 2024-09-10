import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { PaymentSlot } from 'src/app/core/model/entities/payment-slot';

@Component({
  selector: 'app-payment-slot-card-readonly',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, TranslateModule],
  templateUrl: './payment-slot-card-readonly.html',
  styleUrls: ['./payment-slot-card-readonly.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentSlotCardReadonlyComponent {
  @Input({ required: true }) public paymentSlot!: PaymentSlot;
  @Output() public slotDeleted = new EventEmitter<string>();

  public deletePaymentSlot(e: MouseEvent): void {
    e.stopImmediatePropagation();

    this.slotDeleted.emit(this.paymentSlot.id);
  }
}
