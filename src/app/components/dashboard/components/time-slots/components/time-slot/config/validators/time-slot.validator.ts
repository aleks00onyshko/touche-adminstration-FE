import { AbstractControl, FormGroup, ValidatorFn } from '@angular/forms';
import { TimeSlotCardControlStructure } from '../../time-slot-card.component';
import { TimeSlotCardValidationErrors } from '../validation.errors';
import { isEmpty } from 'lodash';

export function timeSlotCardValidator(): ValidatorFn {
  return (timeSlotFormGroup: AbstractControl<any>): TimeSlotCardValidationErrors | null => {
    const {
      controls: { lessonName, tables }
    } = timeSlotFormGroup as FormGroup<TimeSlotCardControlStructure>;
    const errors: TimeSlotCardValidationErrors = {};

    if (!lessonName.value) {
      errors['LESSON_NAME_IS_REQUIRED'] = true;
    }

    if (tables.hasError('required')) {
      errors.TABLE_IS_REQUIRED = true;
    }

    return isEmpty(errors) ? null : errors;
  };
}
