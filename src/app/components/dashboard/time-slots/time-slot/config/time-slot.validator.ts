import { AbstractControl, FormGroup, ValidatorFn } from '@angular/forms';
import { TimeSlotCardControlStructure } from '../time-slot-card.component';
import { TimeSlotCardValidationErrors } from './validation.errors';
import { isEmpty } from 'lodash';

export function timeSlotCardValidator(): ValidatorFn {
  return (timeSlotFormGroup: AbstractControl<any>): TimeSlotCardValidationErrors | null => {
    const {
      controls: { startTime, duration }
    } = timeSlotFormGroup as FormGroup<TimeSlotCardControlStructure>;

    if (!startTime.value || !duration.value) return null;

    const errors: TimeSlotCardValidationErrors = { ...duration.errors };

    return isEmpty(errors) ? null : errors;
  };
}
