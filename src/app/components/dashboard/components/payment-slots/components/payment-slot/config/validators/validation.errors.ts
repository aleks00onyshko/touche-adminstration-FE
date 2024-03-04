import { ValidationErrors } from '@angular/forms';


export enum PaymentSlotCardValidationErrorsEnum {
HAS_PAYMENT_TURNER_SYNDROME="HAS_PAYMENT_TURNER_SYNDROME"
}

export type PaymentSlotCardValidationErrors = ValidationErrors & {
  [key in PaymentSlotCardValidationErrorsEnum]?: boolean;
};
