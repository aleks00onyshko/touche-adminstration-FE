import { ValidationErrors } from '@angular/forms';

export enum PaymentSlotCardValidationErrorsEnum {
<<<<<<< HEAD
  OVERLAPS_WITH_OTHER = 'OVERLAPS_WITH_OTHER'
=======
HAS_PAYMENT_TURNER_SYNDROME="HAS_PAYMENT_TURNER_SYNDROME"
>>>>>>> 5bc00b1 (new change)
}

export type PaymentSlotCardValidationErrors = ValidationErrors & {
  [key in PaymentSlotCardValidationErrorsEnum]?: boolean;
};
