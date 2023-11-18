import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Observable, pipe, switchMap, take, tap } from 'rxjs';
import { DateId, TimeSlot } from 'src/app/core/model/entities/time-slot.entity';

export interface TimeSlotsState {
  loading: boolean;
  timeSlots: TimeSlot[];
}

export const initialState: TimeSlotsState = {
  loading: false,
  timeSlots: []
};

@Injectable()
export class TimeSoltsComponentStore extends ComponentStore<TimeSlotsState> {
  public readonly timeSlots$ = this.select(state => state.timeSlots);

  private readonly setLoading = this.updater((state, loading: boolean) => ({ ...state, loading }));
  private readonly addTimeSlots = this.updater((state, timeSlots: TimeSlot[]) => ({
    ...state,
    timeSlots
  }));

  constructor(private firestore: Firestore) {
    super(initialState);
  }

  public readonly getTimeSlots$ = this.effect((dateId$: Observable<DateId>) =>
    dateId$.pipe(
      switchMap((dateId: DateId) =>
        (collectionData(collection(this.firestore, `dateIds/${dateId}/slots`)) as Observable<TimeSlot[]>).pipe(
          take(1),
          tap(() => this.setLoading(true)),
          tapResponse(
            timeSlots => {
              this.addTimeSlots(timeSlots);
              this.setLoading(false);
            },
            (err: HttpErrorResponse) => console.error(err.message)
          )
        )
      )
    )
  );
}
