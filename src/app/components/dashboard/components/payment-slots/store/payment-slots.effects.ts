import { inject } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { PaymentSlotAction } from './payment-slots.actions';
import { Firestore, collection, collectionData, deleteDoc, doc, setDoc } from '@angular/fire/firestore';
import { EMPTY, Observable, catchError, from, map, of, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';
import { UUIDGeneratorService } from '../../../../../core/services/id-generator.service';
import { PaymentSlot } from 'src/app/core/model/entities/payment-slot';
import { HttpErrorResponse } from '@angular/common/http';
import {
  CreatePaymentSlotDialogComponent,
  CreatePaymentSlotDialogResponse
} from '../components/create-payment-slot-dialog/create-payment-slot-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {
  EditPaymentSlotDialogComponent,
  EditPaymentSlotDialogResponse
} from '../components/edit-payment-slot-dialog/edit-payment-slot-dialog';

export const getPaymentSlots$ = createEffect(
  (actions$ = inject(Actions), firestore = inject(Firestore)) =>
    actions$.pipe(
      ofType(PaymentSlotAction.getPaymentSlots),
      switchMap(() =>
        (collectionData(collection(firestore, `payment-slots`)) as Observable<PaymentSlot[]>).pipe(
          map(paymentSlots => PaymentSlotAction.getPaymentSlotsSuccess({ paymentSlots })),
          catchError((error: HttpErrorResponse) => of(PaymentSlotAction.getPaymentSlotsFailed({ error })))
        )
      )
    ),
  { functional: true }
);

export const createPaymentSlot$ = createEffect(
  (actions$ = inject(Actions), uuidGeneratorService = inject(UUIDGeneratorService), firestore = inject(Firestore)) =>
    actions$.pipe(
      ofType(PaymentSlotAction.createPaymentSlot),
      switchMap(({ paymentSlotCardControlValue }) => {
        const id = uuidGeneratorService.generateId();
        const optimisticallyGeneratedPaymentSlot: PaymentSlot = {
          numberOfClasses: paymentSlotCardControlValue.numberOfClasses,
          price: paymentSlotCardControlValue.price,
          id: id
        };

        return from(setDoc(doc(firestore, `payment-slots/${id}`), optimisticallyGeneratedPaymentSlot)).pipe(
          //! we are listening to firestore changes anyway, so no need to insert created slot into state
          switchMap(() => EMPTY),
          catchError((error: HttpErrorResponse) => of(PaymentSlotAction.createPaymentSlotFailed({ error })))
        );
      })
    ),
  { functional: true }
);

export const deletePaymentSlot$ = createEffect(
  (actions$ = inject(Actions), firestore = inject(Firestore)) =>
    actions$.pipe(
      ofType(PaymentSlotAction.deletePaymentSlot),
      switchMap(({ id }) =>
        from(deleteDoc(doc(firestore, `payment-slots/${id}`))).pipe(
          map(() => PaymentSlotAction.deletePaymentSlotSuccess({ id })),
          catchError((error: HttpErrorResponse) => of(PaymentSlotAction.deletePaymentSlotFailded({ error })))
        )
      )
    ),
  { functional: true }
);

export const openCreatePaymentSlotDialog$ = createEffect(
  (actions$ = inject(Actions), store = inject(Store), dialog = inject(MatDialog)) =>
    actions$.pipe(
      ofType(PaymentSlotAction.openCreatePaymentSlotDialog),
      switchMap(() => {
        const dialogRef: MatDialogRef<CreatePaymentSlotDialogComponent, CreatePaymentSlotDialogResponse> = dialog.open(
          CreatePaymentSlotDialogComponent
        );

        return dialogRef.afterClosed().pipe(
          map(result => {
            if (result) {
              store.dispatch(
                PaymentSlotAction.createPaymentSlot({
                  paymentSlotCardControlValue: result.paymentSlotCardControlValue
                })
              );
            }
          })
        );
      })
    ),
  { dispatch: false, functional: true }
);

export const editPaymentSlot$ = createEffect(
  (actions$ = inject(Actions), firestore = inject(Firestore)) =>
    actions$.pipe(
      ofType(PaymentSlotAction.editPaymentSlot),
      switchMap(({ initialPaymentSlot, paymentSlotCardControlValue }) => {
        const optimisticallyGeneratedPaymentSlot: PaymentSlot = {
          numberOfClasses: paymentSlotCardControlValue.numberOfClasses,
          price: paymentSlotCardControlValue.price,
          id: initialPaymentSlot.id
        };

        return from(
          setDoc(doc(firestore, `payment-slots/${initialPaymentSlot.id}`), optimisticallyGeneratedPaymentSlot)
        ).pipe(
          //! we are listening to firestore changes anyway, so no need to insert created slot into state
          switchMap(() => EMPTY),
          catchError((error: HttpErrorResponse) => of(PaymentSlotAction.editPaymentSlotFailed({ error })))
        );
      })
    ),
  { functional: true }
);

export const openEditPaymentSlotDialog$ = createEffect(
  (actions$ = inject(Actions), store = inject(Store), firestore = inject(Firestore), dialog = inject(MatDialog)) =>
    actions$.pipe(
      ofType(PaymentSlotAction.openEditPaymentSlotDialog),
      switchMap(({ paymentSlot }) => {
        const dialogRef: MatDialogRef<EditPaymentSlotDialogComponent, EditPaymentSlotDialogResponse> = dialog.open(
          EditPaymentSlotDialogComponent,
          { data: { paymentSlot } }
        );

        return dialogRef.afterClosed().pipe(
          map(result => {
            if (result) {
              store.dispatch(
                PaymentSlotAction.editPaymentSlot({
                  initialPaymentSlot: result.initialPaymentSlot,
                  paymentSlotCardControlValue: result.paymentSlotCardControlValue
                })
              );
            }
          })
        );
      })
    ),
  { dispatch: false, functional: true }
);
