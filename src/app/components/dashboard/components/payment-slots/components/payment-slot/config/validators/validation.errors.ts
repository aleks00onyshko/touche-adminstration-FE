import { ValidationErrors } from '@angular/forms';

export enum PaymentSlotCardValidationErrorsEnum {
  OVERLAPS_WITH_OTHER = 'OVERLAPS_WITH_OTHER'
}

export type PaymentSlotCardValidationErrors = ValidationErrors & {
  [key in PaymentSlotCardValidationErrorsEnum]?: boolean;
};
