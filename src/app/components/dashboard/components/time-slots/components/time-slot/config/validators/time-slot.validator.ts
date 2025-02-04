import { AbstractControl, FormGroup, ValidatorFn } from '@angular/forms';
import { TimeSlotCardControlStructure } from '../../time-slot-card.component';
import { TimeSlotCardValidationErrors } from '../validation.errors';
import { isEmpty } from 'lodash';

export function timeSlotCardValidator(): ValidatorFn {
  return (timeSlotFormGroup: AbstractControl<any>): TimeSlotCardValidationErrors | null => {
    const {
      controls: { lessonName, startTime, duration, tables }
    } = timeSlotFormGroup as FormGroup<TimeSlotCardControlStructure>;
    const errors: TimeSlotCardValidationErrors = {};

    if (!startTime.value || !duration.value) return null;

    if (!lessonName.value) {
      errors['LESSON_NAME_IS_REQUIRED'] = true;
    }

    if (slotDurationLeaksToNextDay(startTime.value, duration.value)) {
      errors.DURATION_IS_INVALID = true;
    }

    if (tables.hasError('required')) {
      errors.TABLE_IS_REQUIRED = true;
    }

    return isEmpty(errors) ? null : errors;
  };
}

function slotDurationLeaksToNextDay(startTime: [number, number], duration: number): boolean {
  const dayInMinutes = 1440;
  const minutes: number = startTime[0] * 60 + startTime[1] + duration;

  return minutes >= dayInMinutes;
}
