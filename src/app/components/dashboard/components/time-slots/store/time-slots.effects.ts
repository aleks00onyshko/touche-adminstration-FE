import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Firestore, collection, collectionData, deleteDoc, doc, setDoc } from '@angular/fire/firestore';
import { TimeSlotsActions } from './time-slots.actions';
import { Observable, catchError, from, map, of, switchMap, take, withLatestFrom } from 'rxjs';
import { TimeSlotsState } from './time-slots.reducer';
import { selectCurrentDateId, selectTeachers } from './time-slots.selectors';
import { TimeSlot } from 'src/app/core/model/entities/time-slot';
import { HttpErrorResponse } from '@angular/common/http';
import { UUIDGeneratorService } from '../../../../../core/services/id-generator.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateTimeSlotDialogComponent } from '../create-time-slot-dialog/create-time-slot-dialog.component';
import { Teacher } from 'src/app/core/model/entities/teacher';

@Injectable()
export class TimeSlotsEffects {
  //!important: Don't forget that this is a kind of a WS channel, listens to firestore's respective collection
  public readonly getTimeSlots$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TimeSlotsActions.getTimeSlots),
      withLatestFrom(this.store.select(selectCurrentDateId)),
      switchMap(([_, dateId]) =>
        (collectionData(collection(this.firestore, `dateIds/${dateId}/slots`)) as Observable<TimeSlot[]>).pipe(
          map(timeSlots => TimeSlotsActions.getTimeSlotsSuccess({ timeSlots })),
          catchError((error: HttpErrorResponse) => of(TimeSlotsActions.getTimeSlotsFailed({ error })))
        )
      )
    )
  );

  //   //!important: Don't forget that this is a kind of a WS channel, listens to firestore's respective collection
  public readonly getTeachers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TimeSlotsActions.getTeachers),
      switchMap(() =>
        (collectionData(collection(this.firestore, `teachers`)) as Observable<Teacher[]>).pipe(
          map(teachers => TimeSlotsActions.getTeachersSuccess({ teachers })),
          catchError((error: HttpErrorResponse) => of(TimeSlotsActions.getTeachersFailed({ error })))
        )
      )
    )
  );

  public readonly createTimeSlot$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TimeSlotsActions.createTimeSlot),
      withLatestFrom(this.store.select(selectCurrentDateId)),
      switchMap(([{ timeSlotCardControlValue }, currentDateId]) => {
        const id = this.UUIDGeneratorService.generateId();
        const optimisticallyGeneratedTimeSlot: TimeSlot = {
          startTime: timeSlotCardControlValue.startTime,
          duration: timeSlotCardControlValue.duration,
          id,
          dateId: currentDateId!,
          teacherId: timeSlotCardControlValue.teacher!.id
        };

        return from(
          setDoc(doc(this.firestore, `dateIds/${currentDateId}/slots/${id}`), optimisticallyGeneratedTimeSlot)
        ).pipe(
          map(() => TimeSlotsActions.createTimeSlotSuccess({ timeSlot: optimisticallyGeneratedTimeSlot })),
          catchError((error: HttpErrorResponse) => of(TimeSlotsActions.createTimeSlotFailed({ error })))
        );
      })
    )
  );

  public readonly deleteTimeSlot$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TimeSlotsActions.deleteTimeSlot),
      withLatestFrom(this.store.select(selectCurrentDateId)),
      switchMap(([{ id }, currentDateId]) =>
        from(deleteDoc(doc(this.firestore, `dateIds/${currentDateId}/slots/${id}`))).pipe(
          map(() => TimeSlotsActions.deleteTimeSlotSuccess({ id })),
          catchError((error: HttpErrorResponse) => of(TimeSlotsActions.deleteTimeSlotFailded({ error })))
        )
      )
    )
  );

  public openCreateTimeSlotDialog$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(TimeSlotsActions.openCreateTimeSlotDialog),
        withLatestFrom(this.store.select(selectTeachers)),
        switchMap(([_, teachers]) => {
          const dialogRef = this.dialog.open(CreateTimeSlotDialogComponent, { data: { teachers } });

          return dialogRef.afterClosed().pipe(
            map(result => {
              if (result) {
                this.store.dispatch(TimeSlotsActions.createTimeSlot({ timeSlotCardControlValue: result }));
              }
            })
          );
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private store: Store<TimeSlotsState>,
    private UUIDGeneratorService: UUIDGeneratorService,
    private dialog: MatDialog,
    private firestore: Firestore
  ) {}
}
