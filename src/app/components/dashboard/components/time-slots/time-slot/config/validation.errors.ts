import { ValidationErrors } from '@angular/forms';

export enum TimeSlotCardValidationErrorsEnum {
  DURATION_IS_INVALID = 'DURATION_IS_INVALID',
  TEACHER_IS_REQUIRED = 'TEACHER_IS_REQUIRED'
}

export type TimeSlotCardValidationErrors = ValidationErrors & {
  [key in TimeSlotCardValidationErrorsEnum]?: boolean;
};
