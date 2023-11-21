import { AbstractControl, FormGroup, ValidatorFn } from '@angular/forms';
import { TimeSlotCardControlStructure } from '../time-slot-card.component';
import { TimeSlotCardValidationErrors } from './validation.errors';
import { isEmpty } from 'lodash';

export function timeSlotCardValidator(): ValidatorFn {
  return (timeSlotCardControl: AbstractControl<any>): TimeSlotCardValidationErrors | null => {
    const { startTime, duration } = (timeSlotCardControl as FormGroup<TimeSlotCardControlStructure>)
      .controls as TimeSlotCardControlStructure;
    const errors: TimeSlotCardValidationErrors = {};

    // TODO: add validation

    return isEmpty(errors) ? null : errors;
  };
}
