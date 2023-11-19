import { ValidationErrors } from '@angular/forms';

export enum TimeSlotCardValidationErrorsEnum {
  DURATION_IS_INVALID = 'DURATION_IS_INVALID'
}

export type TimeSlotCardValidationErrors = ValidationErrors & {
  [key in TimeSlotCardValidationErrorsEnum]?: boolean;
};
