import { AbstractControl, FormGroup, ValidatorFn } from '@angular/forms';
import { TimeSlotCardControlStructure } from '../time-slot-card.component';
import { TimeSlotCardValidationErrors } from './validation.errors';
import { isEmpty } from 'lodash';

export function timeSlotCardValidator(): ValidatorFn {
  return (timeSlotFormGroup: AbstractControl<any>): TimeSlotCardValidationErrors | null => {
    const {
      controls: { startTime, duration }
    } = timeSlotFormGroup as FormGroup<TimeSlotCardControlStructure>;
    const errors: TimeSlotCardValidationErrors = {};

    if (!startTime.value || !duration.value) return null;

    const dayInMinutes = 1440;
    const minutes: number = startTime.value[0] * 60 + startTime.value[1] + duration.value;

    if (minutes >= dayInMinutes) {
      errors.DURATION_IS_INVALID = true;
    }

    return isEmpty(errors) ? null : errors;
  };
}
