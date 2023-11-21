import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Firestore, collectionData, collection, setDoc, doc } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Observable, delay, firstValueFrom, from, pipe, switchMap, take, tap, withLatestFrom } from 'rxjs';
import { DateId, TimeSlot } from 'src/app/core/model/entities/time-slot';
import {
  CreateTimeSlotDialogComponent,
  CreateTimeSlotDialogResponse
} from './create-time-slot-dialog/create-time-slot-dialog.component';
import { UUIDGeneratorService } from '../../../core/services/id-generator.service';

export interface TimeSlotsState {
  currentDateId: DateId | null;
  loading: boolean;
  timeSlots: TimeSlot[] | null;
}

export const initialState: TimeSlotsState = {
  currentDateId: null,
  loading: false,
  timeSlots: null
};

@Injectable()
export class TimeSlotsStore extends ComponentStore<TimeSlotsState> {
  public readonly currentDateId$ = this.select(state => state.currentDateId);
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
  public readonly setDateId = this.updater((state, dateId: DateId) => ({
    ...state,
    currentDateId: dateId
  }));
  public readonly addTimeSlot = this.updater((state, timeSlot: TimeSlot) => ({
    ...state,
    timeSlots: [timeSlot, ...(state.timeSlots ?? [])]
  }));

  constructor(
    private firestore: Firestore,
    private dialog: MatDialog,
    private UUIDGeneratorService: UUIDGeneratorService
  ) {
    super(initialState);
  }

  public readonly getTimeSlots$ = this.effect((dateId$: Observable<DateId>) =>
    dateId$.pipe(
      tap(dateId => {
        this.setLoading(true);
        this.setDateId(dateId);
      }),
      switchMap(dateId =>
        (collectionData(collection(this.firestore, `dateIds/${dateId}/slots`)) as Observable<TimeSlot[]>).pipe(
          tapResponse(
            timeSlots => {
              this.setTimeSlots(timeSlots);
              this.setLoading(false);
            },
            (err: HttpErrorResponse) => console.error(err.message)
          ),
          take(1) // TODO: check if needed
        )
      )
    )
  );

  public readonly createTimeSlot$ = this.effect((timeSlotData$: Observable<Partial<TimeSlot>>) =>
    timeSlotData$.pipe(
      withLatestFrom(this.currentDateId$),
      switchMap(([timeSlotData, dateId]) => {
        const id = this.UUIDGeneratorService.generateId();
        const optimisticallyGeneratedTimeSlot: TimeSlot = {
          ...timeSlotData,
          id,
          dateId,
          techerId: 'nothing yet'
        } as TimeSlot;

        return from(setDoc(doc(this.firestore, `dateIds/${dateId}/slots/${id}`), optimisticallyGeneratedTimeSlot)).pipe(
          tapResponse(
            () => {
              this.addTimeSlot(optimisticallyGeneratedTimeSlot);
              this.setLoading(false);
            },
            (err: HttpErrorResponse) => console.error(err.message)
          )
        );
      })
    )
  );

  public readonly openCreateTimeSlotDialog$ = this.effect<void>(
    pipe(
      tap(async () => {
        const dialogRef = this.dialog.open(CreateTimeSlotDialogComponent);
        const result: CreateTimeSlotDialogResponse = await firstValueFrom(dialogRef.afterClosed());

        if (result) {
          this.createTimeSlot$(result);
        }
      })
    )
  );
}
