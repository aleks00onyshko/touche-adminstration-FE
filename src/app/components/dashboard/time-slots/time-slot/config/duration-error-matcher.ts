import { FormControl, FormGroup } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { TimeSlotCardValidationErrorsEnum } from './validation.errors';

export class DurationErrorStateMatcher implements ErrorStateMatcher {
  constructor(private startTimeControl: FormControl<[number, number]>) {}

  public isErrorState(durationControl: FormControl<number>): boolean {
    if (!this.startTimeControl.value || !durationControl.value) return false;

    const dayInMinutes = 1440;
    const minutes: number =
      this.startTimeControl.value[0] * 60 + this.startTimeControl.value[1] + durationControl.value;
    const isValid = minutes >= dayInMinutes;

    if (!isValid) {
      durationControl.setErrors({ [TimeSlotCardValidationErrorsEnum.DURATION_IS_INVALID]: true });
    }

    return isValid;
  }
}
