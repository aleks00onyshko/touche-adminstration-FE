import { ValidationErrors } from '@angular/forms';

export enum TimeSlotCardValidationErrorsEnum {
  DURATION_IS_INVALID = 'DURATION_IS_INVALID',
  TABLE_IS_REQUIRED = 'TABLE_IS_REQUIRED',
  HAS_TIME_TURNER_SYNDROME = 'HAS_TIME_TURNER_SYNDROME'
}

export type TimeSlotCardValidationErrors = ValidationErrors & {
  [key in TimeSlotCardValidationErrorsEnum]?: boolean;
};
