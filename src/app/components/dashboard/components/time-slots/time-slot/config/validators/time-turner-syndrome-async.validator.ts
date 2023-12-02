import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, AsyncValidatorFn, FormControl, ValidationErrors } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TimeSlotsState } from '../../../store/time-slots.reducer';
import { Observable, map, take } from 'rxjs';
import { TimeSlotCardControlValue } from '../../time-slot-card.component';
import { timeSlotHasTimeTurnerSyndrome } from '../../../store/time-slots.selectors';
import { TimeSlotCardValidationErrorsEnum } from '../validation.errors';

export function timeSlotHasTimeTurnerSyndromeValidator(store: Store<TimeSlotsState>): AsyncValidatorFn {
  return (
    timeSlotCardControl: AbstractControl<TimeSlotCardControlValue, TimeSlotCardControlValue>
  ): Observable<ValidationErrors | null> => {
    return store.select(timeSlotHasTimeTurnerSyndrome(timeSlotCardControl.value)).pipe(
      take(1),
      map(hasTimeTurnedSyndrome =>
        hasTimeTurnedSyndrome ? { [TimeSlotCardValidationErrorsEnum.HAS_TIME_TURNER_SYNDROME]: true } : null
      )
    );
  };
}
