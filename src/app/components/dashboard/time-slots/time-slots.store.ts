import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Observable, switchMap, take, tap } from 'rxjs';
import { DateId, TimeSlot } from 'src/app/core/model/entities/time-slot';

export interface TimeSlotsState {
  loading: boolean;
  timeSlots: TimeSlot[];
}

export const initialState: TimeSlotsState = {
  loading: false,
  timeSlots: []
};

@Injectable()
export class TimeSlotsStore extends ComponentStore<TimeSlotsState> {
  public readonly loading$ = this.select(state => state.loading);
  public readonly timeSlots$ = this.select(state => state.timeSlots);

  public readonly setLoading = this.updater((state, loading: boolean) => ({
    ...state,
    loading
  }));
  public readonly setTimeSlots = this.updater((state, timeSlots: TimeSlot[]) => ({
    ...state,
    timeSlots
  }));

  constructor(private firestore: Firestore) {
    super(initialState);
  }

  public readonly getTimeSlots$ = this.effect((dateId$: Observable<DateId>) =>
    dateId$.pipe(
      switchMap(dateId =>
        (collectionData(collection(this.firestore, `dateIds/${dateId}/slots`)) as Observable<TimeSlot[]>).pipe(
          take(1),
          tap(() => this.setLoading(true)),
          tapResponse(
            timeSlots => {
              this.setTimeSlots(timeSlots);
              this.setLoading(false);
            },
            (err: HttpErrorResponse) => console.error(err.message)
          )
        )
      )
    )
  );
}
