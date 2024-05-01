import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Firestore, collection, collectionData, deleteDoc, doc, setDoc } from '@angular/fire/firestore';
import { TimeSlotsActions } from './time-slots.actions';
import { EMPTY, Observable, catchError, concatMap, from, map, of, switchMap, take, withLatestFrom } from 'rxjs';
import { TimeSlotsState } from './time-slots.reducer';
import { selectCurrentDateId, selectCurrentLocation, selectTeachers } from './time-slots.selectors';
import { TimeSlot } from 'src/app/core/model/entities/time-slot';
import { HttpErrorResponse } from '@angular/common/http';
import { UUIDGeneratorService } from '../../../../../core/services/id-generator.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {
  CreateTimeSlotDialogComponent,
  CreateTimeSlotDialogResponse
} from '../components/create-time-slot-dialog/create-time-slot-dialog.component';
import { Teacher } from 'src/app/core/model/entities/teacher';
import { Location } from 'src/app/core/model/entities/location';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import {
  EditTimeSlotDialogComponent,
  EditTimeSlotDialogResponse
} from '../components/edit-time-slot-dialog/edit-time-slot-dialog.component';
import { User } from 'src/app/core/model/entities/user';

@Injectable()
export class TimeSlotsEffects {
  //!important: Don't forget that this is a kind of a WS channel, listens to firestore's respective collection
  public readonly getTimeSlots$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TimeSlotsActions.getTimeSlots),
      withLatestFrom(this.store.select(selectCurrentDateId), this.store.select(selectCurrentLocation)),
      switchMap(([_, currentDateId, currentLocation]) =>
        (
          collectionData(
            collection(this.firestore, `dateIds/${currentDateId}/${currentLocation!.id}-slots`)
          ) as Observable<TimeSlot[]>
        ).pipe(
          map(timeSlots => TimeSlotsActions.getTimeSlotsSuccess({ timeSlots })),
          catchError((error: HttpErrorResponse) => of(TimeSlotsActions.getTimeSlotsFailed({ error })))
        )
      )
    )
  );

  // !important: Don't forget that this is a kind of a WS channel, listens to firestore's respective collection
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

  // !important: Don't forget that this is a kind of a WS channel, listens to firestore's respective collection
  public readonly getUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TimeSlotsActions.getUsers),
      switchMap(() =>
        (collectionData(collection(this.firestore, `users`)) as Observable<User[]>).pipe(
          map(users => TimeSlotsActions.getUsersSuccess({ users })),
          catchError((error: HttpErrorResponse) => of(TimeSlotsActions.getUsersFailed({ error })))
        )
      )
    )
  );

  // !important: Don't forget that this is a kind of a WS channel, listens to firestore's respective collection
  public readonly getLocations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TimeSlotsActions.getLocations),
      switchMap(() =>
        (collectionData(collection(this.firestore, `locations`)) as Observable<Location[]>).pipe(
          map(locations => TimeSlotsActions.getLocationsSuccess({ locations })),
          catchError((error: HttpErrorResponse) => of(TimeSlotsActions.getLocationsFailed({ error })))
        )
      )
    )
  );

  public readonly createTimeSlot$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TimeSlotsActions.createTimeSlot),
      withLatestFrom(this.store.select(selectCurrentDateId), this.store.select(selectCurrentLocation)),
      switchMap(([{ timeSlotCardControlValue }, currentDateId, currentLocation]) => {
        const id = this.UUIDGeneratorService.generateId();
        const optimisticallyGeneratedTimeSlot: TimeSlot = {
          startTime: timeSlotCardControlValue.startTime,
          duration: timeSlotCardControlValue.duration,
          locationId: currentLocation!.id,
          id,
          dateId: currentDateId!,
          teachersIds: (timeSlotCardControlValue.teachers ?? []).map(teacher => teacher.id),
          booked: false,
          attendeeId: ''
        };

        return from(
          setDoc(
            doc(this.firestore, `dateIds/${currentDateId}/${currentLocation!.id}-slots/${id}`),
            optimisticallyGeneratedTimeSlot
          )
        ).pipe(
          //! we are listening to firestore changes anyway, so no need to insert created slot into state
          switchMap(() => EMPTY),
          catchError((error: HttpErrorResponse) => of(TimeSlotsActions.createTimeSlotFailed({ error })))
        );
      })
    )
  );

  public readonly editTimeSlot$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TimeSlotsActions.editTimeSlot),
      withLatestFrom(this.store.select(selectCurrentDateId), this.store.select(selectCurrentLocation)),
      switchMap(([{ initialTimeSlot, timeSlotCardControlValue }, currentDateId, currentLocation]) => {
        const optimisticallyGeneratedTimeSlot: TimeSlot = {
          startTime: timeSlotCardControlValue.startTime,
          duration: timeSlotCardControlValue.duration,
          locationId: currentLocation!.id,
          id: initialTimeSlot.id,
          dateId: currentDateId!,
          teachersIds: (timeSlotCardControlValue.teachers ?? []).map(teacher => teacher.id),
          booked: initialTimeSlot.booked,
          attendeeId: initialTimeSlot.attendeeId
        };

        return from(
          setDoc(
            doc(this.firestore, `dateIds/${currentDateId}/${currentLocation!.id}-slots/${initialTimeSlot.id}`),
            optimisticallyGeneratedTimeSlot
          )
        ).pipe(
          //! we are listening to firestore changes anyway, so no need to insert created slot into state
          switchMap(() => EMPTY),
          catchError((error: HttpErrorResponse) => of(TimeSlotsActions.editTimeSlotFailed({ error })))
        );
      })
    )
  );

  public readonly deleteTimeSlot$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TimeSlotsActions.deleteTimeSlot),
      withLatestFrom(this.store.select(selectCurrentDateId), this.store.select(selectCurrentLocation)),
      switchMap(([{ id }, currentDateId, currentLocation]) =>
        from(deleteDoc(doc(this.firestore, `dateIds/${currentDateId}/${currentLocation!.id}-slots/${id}`))).pipe(
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
          const dialogRef: MatDialogRef<CreateTimeSlotDialogComponent, CreateTimeSlotDialogResponse> = this.dialog.open(
            CreateTimeSlotDialogComponent,
            { data: { teachers } }
          );

          return dialogRef.afterClosed().pipe(
            map(result => {
              if (result) {
                this.store.dispatch(
                  TimeSlotsActions.createTimeSlot({ timeSlotCardControlValue: result.timeSlotCardControlValue })
                );
              }
            })
          );
        })
      ),
    { dispatch: false }
  );

  public openEditTimeSlotDialog$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(TimeSlotsActions.openEditTimeSlotDialog),
        withLatestFrom(this.store.select(selectTeachers)),
        switchMap(([{ timeSlot }, teachers]) => {
          const dialogRef: MatDialogRef<EditTimeSlotDialogComponent, EditTimeSlotDialogResponse> = this.dialog.open(
            EditTimeSlotDialogComponent,
            { data: { timeSlot, teachers } }
          );

          return dialogRef.afterClosed().pipe(
            map(result => {
              if (result) {
                this.store.dispatch(
                  TimeSlotsActions.editTimeSlot({
                    initialTimeSlot: result.initialTimeSlot,
                    timeSlotCardControlValue: result.timeSlotCardControlValue
                  })
                );
              }
            })
          );
        })
      ),
    { dispatch: false }
  );

  public setCurrentLocation$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(TimeSlotsActions.setCurrentLocation),
        map(({ location }) => this.localstorageService.set('location', JSON.stringify(location)))
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private store: Store<TimeSlotsState>,
    private UUIDGeneratorService: UUIDGeneratorService,
    private dialog: MatDialog,
    private firestore: Firestore,
    private localstorageService: LocalStorageService
  ) {}
}
