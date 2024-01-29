import { ValidationErrors } from '@angular/forms';


export enum PaymentSlotCardValidationErrorsEnum {
NUMBER_OF_CLASSES_IS_INVALID=' NUMBER_OF_CLASsES_IS_INVALID',
PRICE_IS_REQUIRED='PRICE_IS_REQUIRED',
HAS_OVERLAPPING='HAS_OVERLAPPING',
HAS_PAYMENT_TURNER_SYNDROME="HAS_PAYMENT_TURNER_SYNDROME"
}

export type PaymentSlotCardValidationErrors = ValidationErrors & {
  [key in PaymentSlotCardValidationErrorsEnum]?: boolean;
};
