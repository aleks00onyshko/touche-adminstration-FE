import { AbstractControl, FormGroup, ValidatorFn } from '@angular/forms';
import { TimeSlotCardControlStructure } from '../../time-slot-card.component';
import { TimeSlotCardValidationErrors } from '../validation.errors';
import { isEmpty } from 'lodash';

export function timeSlotCardValidator(): ValidatorFn {
  return (timeSlotFormGroup: AbstractControl<any>): TimeSlotCardValidationErrors | null => {
    const {
      controls: { startTime, duration, teacher }
    } = timeSlotFormGroup as FormGroup<TimeSlotCardControlStructure>;
    const errors: TimeSlotCardValidationErrors = {};

    if (!startTime.value || !duration.value) return null;

    if (slotDurationLeaksToNextDay(startTime.value, duration.value)) {
      errors.DURATION_IS_INVALID = true;
    }

    if (teacher.hasError('required')) {
      errors.TEACHER_IS_REQUIRED = true;
    }

    return isEmpty(errors) ? null : errors;
  };
}

function slotDurationLeaksToNextDay(startTime: [number, number], duration: number): boolean {
  const dayInMinutes = 1440;
  const minutes: number = startTime[0] * 60 + startTime[1] + duration;

  return minutes >= dayInMinutes;
}
