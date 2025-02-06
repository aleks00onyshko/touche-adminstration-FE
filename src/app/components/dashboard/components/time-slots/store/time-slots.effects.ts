import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  CollectionReference,
  Firestore,
  Query,
  collection,
  collectionData,
  deleteDoc,
  doc,
  query,
  setDoc,
  where
} from '@angular/fire/firestore';
import { TimeSlotsActions } from './time-slots.actions';
import { EMPTY, Observable, catchError, from, map, of, switchMap, withLatestFrom } from 'rxjs';
import { selectCurrentDateId, selectCurrentLocation, selectTables } from './time-slots.selectors';
import { TimeSlot } from 'src/app/core/model/entities/time-slot';
import { HttpErrorResponse } from '@angular/common/http';
import { UUIDGeneratorService } from '../../../../../core/services/id-generator.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {
  CreateTimeSlotDialogComponent,
  CreateTimeSlotDialogResponse
} from '../components/create-time-slot-dialog/create-time-slot-dialog.component';
import { Location } from 'src/app/core/model/entities/location';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import {
  EditTimeSlotDialogComponent,
  EditTimeSlotDialogResponse
} from '../components/edit-time-slot-dialog/edit-time-slot-dialog.component';
import { FilterTimeSlotCardControlValue } from 'src/app/components/dashboard/components/time-slots/components/time-slots/filter-time-slot/filter-time-slot.component';
import { QueryFieldFilterConstraint } from '@firebase/firestore';
import { concatLatestFrom } from '@ngrx/operators';
import { Table } from '../../../../../core/model/entities/table';

//!important: Don't forget that this is a kind of a WS channel, listens to firestore's respective collection
export const getTimeSlots$ = createEffect(
  (actions$ = inject(Actions), store = inject(Store), firestore = inject(Firestore)) =>
    actions$.pipe(
      ofType(TimeSlotsActions.getTimeSlots),
      withLatestFrom(store.select(selectCurrentDateId)),
      switchMap(([{ constraints }, currentDateId]) => {
        const timeSlotsCollectionReference: CollectionReference = collection(
          firestore,
          `dateIds/${currentDateId}/timeSlots`
        );
        const timeSlotsQuery: Query = !!constraints
          ? query(timeSlotsCollectionReference, ...constraints)
          : timeSlotsCollectionReference;

        return (collectionData(timeSlotsQuery) as Observable<TimeSlot[]>).pipe(
          map(timeSlots => TimeSlotsActions.getTimeSlotsSuccess({ timeSlots })),
          catchError((error: HttpErrorResponse) => of(TimeSlotsActions.getTimeSlotsFailed({ error })))
        );
      })
    ),
  { functional: true }
);

export const filterTimeSlots$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(TimeSlotsActions.filterTimeSlots),
      map(({ filter }) => TimeSlotsActions.getTimeSlots({ constraints: generateQueryFieldFilterConstraints(filter) }))
    ),
  { functional: true }
);

export const resetTimeSlotsFilter$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(TimeSlotsActions.resetFilter),
      map(() => TimeSlotsActions.getTimeSlots({}))
    ),
  { functional: true }
);

// !important: Don't forget that this is a kind of a WS channel, listens to firestore's respective collection
export const getTables$ = createEffect(
  (actions$ = inject(Actions), firestore = inject(Firestore)) =>
    actions$.pipe(
      ofType(TimeSlotsActions.getTables),
      switchMap(() =>
        (collectionData(collection(firestore, `tables`)) as Observable<Table[]>).pipe(
          map(tables => {
            return tables.sort((a, b) => {
              // Extract the numeric portion from labels like "Table 10"
              const numA = parseInt(a.name.replace(/\D/g, ''), 10);
              const numB = parseInt(b.name.replace(/\D/g, ''), 10);
              return numA - numB; // ascending order
            });
          }),
          map(tables => TimeSlotsActions.getTablesSuccess({ tables })),
          catchError((error: HttpErrorResponse) => of(TimeSlotsActions.getTablesFailed({ error })))
        )
      )
    ),
  { functional: true }
);

// !important: Don't forget that this is a kind of a WS channel, listens to firestore's respective collection
export const getLocations$ = createEffect(
  (actions$ = inject(Actions), firestore = inject(Firestore)) =>
    actions$.pipe(
      ofType(TimeSlotsActions.getLocations),
      switchMap(() =>
        (collectionData(collection(firestore, `locations`)) as Observable<Location[]>).pipe(
          map(locations => TimeSlotsActions.getLocationsSuccess({ locations })),
          catchError((error: HttpErrorResponse) => of(TimeSlotsActions.getLocationsFailed({ error })))
        )
      )
    ),
  { functional: true }
);

export const createTimeSlot$ = createEffect(
  (
    actions$ = inject(Actions),
    store = inject(Store),
    uuidGeneratorService = inject(UUIDGeneratorService),
    firestore = inject(Firestore)
  ) =>
    actions$.pipe(
      ofType(TimeSlotsActions.createTimeSlot),
      withLatestFrom(store.select(selectCurrentDateId), store.select(selectCurrentLocation)),
      switchMap(([{ timeSlotCardControlValue }, currentDateId, currentLocation]) => {
        const id = uuidGeneratorService.generateId();
        const optimisticallyGeneratedTimeSlot: TimeSlot = {
          lessonName: timeSlotCardControlValue.lessonName!,
          startTime: timeSlotCardControlValue.startTime,
          locationId: currentLocation!.id,
          id,
          dateId: currentDateId!,
          teachersIds: [],
          booked: false,
          attendeeId: '',
          tableIds: (timeSlotCardControlValue.tables ?? []).map(table => table.id),
          peopleAmount: timeSlotCardControlValue.peopleAmount!
        };

        return from(
          setDoc(doc(firestore, `dateIds/${currentDateId}/timeSlots/${id}`), optimisticallyGeneratedTimeSlot)
        ).pipe(
          //! we are listening to firestore changes anyway, so no need to insert created slot into state
          switchMap(() => EMPTY),
          catchError((error: HttpErrorResponse) => of(TimeSlotsActions.createTimeSlotFailed({ error })))
        );
      })
    ),
  { functional: true }
);

export const editTimeSlot$ = createEffect(
  (actions$ = inject(Actions), store = inject(Store), firestore = inject(Firestore)) =>
    actions$.pipe(
      ofType(TimeSlotsActions.editTimeSlot),
      withLatestFrom(store.select(selectCurrentDateId), store.select(selectCurrentLocation)),
      switchMap(([{ initialTimeSlot, timeSlotCardControlValue }, currentDateId, currentLocation]) => {
        const optimisticallyGeneratedTimeSlot: TimeSlot = {
          lessonName: timeSlotCardControlValue.lessonName!,
          startTime: timeSlotCardControlValue.startTime,
          locationId: currentLocation!.id,
          id: initialTimeSlot.id,
          dateId: currentDateId!,
          teachersIds: [],
          booked: initialTimeSlot.booked,
          attendeeId: initialTimeSlot.attendeeId,
          tableIds: (timeSlotCardControlValue.tables ?? []).map(table => table.id),
          peopleAmount: timeSlotCardControlValue.peopleAmount!
        };

        return from(
          setDoc(
            doc(firestore, `dateIds/${currentDateId}/timeSlots/${initialTimeSlot.id}`),
            optimisticallyGeneratedTimeSlot
          )
        ).pipe(
          //! we are listening to firestore changes anyway, so no need to insert created slot into state
          switchMap(() => EMPTY),
          catchError((error: HttpErrorResponse) => of(TimeSlotsActions.editTimeSlotFailed({ error })))
        );
      })
    ),
  { functional: true }
);

export const deleteTimeSlot$ = createEffect(
  (actions$ = inject(Actions), store = inject(Store), firestore = inject(Firestore)) =>
    actions$.pipe(
      ofType(TimeSlotsActions.deleteTimeSlot),
      withLatestFrom(store.select(selectCurrentDateId), store.select(selectCurrentLocation)),
      switchMap(([{ id }, currentDateId]) =>
        from(deleteDoc(doc(firestore, `dateIds/${currentDateId}/timeSlots/${id}`))).pipe(
          map(() => TimeSlotsActions.deleteTimeSlotSuccess({ id })),
          catchError((error: HttpErrorResponse) => of(TimeSlotsActions.deleteTimeSlotFailded({ error })))
        )
      )
    ),
  { functional: true }
);

export const openCreateTimeSlotDialog$ = createEffect(
  (actions$ = inject(Actions), store = inject(Store), dialog = inject(MatDialog)) =>
    actions$.pipe(
      ofType(TimeSlotsActions.openCreateTimeSlotDialog),
      withLatestFrom(store.select(selectTables)),
      switchMap(([_, tables]) => {
        const dialogRef: MatDialogRef<CreateTimeSlotDialogComponent, CreateTimeSlotDialogResponse> = dialog.open(
          CreateTimeSlotDialogComponent,
          { data: { tables }, width: '100% - 4rem' }
        );

        return dialogRef.afterClosed().pipe(
          map(result => {
            if (result) {
              store.dispatch(
                TimeSlotsActions.createTimeSlot({ timeSlotCardControlValue: result.timeSlotCardControlValue })
              );
            }
          })
        );
      })
    ),
  { functional: true, dispatch: false }
);

export const openEditTimeSlotDialog$ = createEffect(
  (actions$ = inject(Actions), store = inject(Store), dialog = inject(MatDialog)) =>
    actions$.pipe(
      ofType(TimeSlotsActions.openEditTimeSlotDialog),
      concatLatestFrom(() => store.select(selectTables)),
      switchMap(([{ timeSlot }, tables]) => {
        const dialogRef: MatDialogRef<EditTimeSlotDialogComponent, EditTimeSlotDialogResponse> = dialog.open(
          EditTimeSlotDialogComponent,
          { data: { timeSlot, tables }, width: '100% - 4rem' }
        );

        return dialogRef.afterClosed().pipe(
          map(result => {
            if (result) {
              store.dispatch(
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
  { functional: true, dispatch: false }
);

export const setCurrentLocation$ = createEffect(
  (actions$ = inject(Actions), localstorageService = inject(LocalStorageService)) =>
    actions$.pipe(
      ofType(TimeSlotsActions.setCurrentLocation),
      map(({ location }) => localstorageService.set('location', JSON.stringify(location)))
    ),
  { dispatch: false, functional: true }
);

function generateQueryFieldFilterConstraints(filter: FilterTimeSlotCardControlValue): QueryFieldFilterConstraint[] {
  const constrainsts: QueryFieldFilterConstraint[] = [];

  if (filter.booked !== null) {
    constrainsts.push(where('booked', '==', filter.booked));
  }

  if ((filter.tables ?? []).length > 0) {
    constrainsts.push(
      where(
        'tableIds',
        'array-contains-any',
        filter.tables!.map(table => table.id)
      )
    );
  }
  return constrainsts;
}
