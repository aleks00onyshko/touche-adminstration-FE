import { ValidationErrors } from '@angular/forms';

export enum PaymentSlotCardValidationErrorsEnum {
  OVERLAPS_WITH_OTHER = 'OVERLAPS_WITH_OTHER',
  HAS_PAYMENT_TURNER_SYNDROME = 'HAS_PAYMENT_TURNER_SYNDROME'
}

export type PaymentSlotCardValidationErrors = ValidationErrors & {
  [key in PaymentSlotCardValidationErrorsEnum]?: boolean;
};
