import { AbstractControl, FormGroup, ValidatorFn } from '@angular/forms';
import { TimeSlotCardControlStructure } from '../time-slot-card.component';
import { TimeSlotCardValidationErrors } from './validation.errors';
import { DateService } from 'src/app/core/services/date.service';
import { isEmpty } from 'lodash';

export function timeSlotCardValidator(dateService: DateService): ValidatorFn {
  return (timeSlotCardControl: AbstractControl<any>): TimeSlotCardValidationErrors | null => {
    const { startTime, endTime } = (timeSlotCardControl as FormGroup<TimeSlotCardControlStructure>)
      .controls as TimeSlotCardControlStructure;
    const errors: TimeSlotCardValidationErrors = {};
    const difference = dateService.getDifferenceBetweenStartAndEndTime(startTime.value, endTime.value);

    if (!difference) {
      errors.DURATION_IS_INVALID = true;
    }

    return isEmpty(errors) ? null : errors;
  };
}
