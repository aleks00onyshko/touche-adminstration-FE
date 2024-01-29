import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { PaymentSlotAction } from './payment-slots.actions';
import { Firestore, collection, collectionData, deleteDoc, doc, setDoc } from '@angular/fire/firestore';
import { EMPTY, Observable, catchError, from, map, of, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';
import { UUIDGeneratorService } from '../../../../../core/services/id-generator.service';
import { PaymentSlotsState } from './payment-slots.reducer';
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

@Injectable()
export class PaymentSlotsEffects {
  public readonly getPaymentSlots$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PaymentSlotAction.getPaymentSlots),
      switchMap(() =>
        (collectionData(collection(this.firestore, `payment-slots`)) as Observable<PaymentSlot[]>).pipe(
          map(paymentSlots => PaymentSlotAction.getPaymentSlotsSuccess({ paymentSlots })),
          catchError((error: HttpErrorResponse) => of(PaymentSlotAction.getPaymentSlotsFailed({ error })))
        )
      )
    )
  );

  public readonly createPaymentSlot$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PaymentSlotAction.createPaymentSlot),
      switchMap(({ paymentSlotCardControlValue }) => {
        const id = this.UUIDGeneratorService.generateId();
        const optimisticallyGeneratedPaymentSlot: PaymentSlot = {
          numberOfClasses: paymentSlotCardControlValue.numberOfClasses,
          price: paymentSlotCardControlValue.price,
          id: id,
          attendeeId: ''
        };

        return from(setDoc(doc(this.firestore, `payment-slots/${id}`), optimisticallyGeneratedPaymentSlot)).pipe(
          //! we are listening to firestore changes anyway, so no need to insert created slot into state
          switchMap(() => EMPTY),
          catchError((error: HttpErrorResponse) => of(PaymentSlotAction.createPaymentSlotFailed({ error })))
        );
      })
    )
  );
  public readonly deletePaymentSlot$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PaymentSlotAction.deletePaymentSlot),
      switchMap(({ id }) =>
        from(deleteDoc(doc(this.firestore, `payment-slots/${id}`))).pipe(
          map(() => PaymentSlotAction.deletePaymentSlotSuccess({ id })),
          catchError((error: HttpErrorResponse) => of(PaymentSlotAction.deletePaymentSlotFailded({ error })))
        )
      )
    )
  );

  public openCreatePaymentSlotDialog$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PaymentSlotAction.openCreatePaymentSlotDialog),
        switchMap(() => {
          const dialogRef: MatDialogRef<CreatePaymentSlotDialogComponent, CreatePaymentSlotDialogResponse> =
            this.dialog.open(CreatePaymentSlotDialogComponent);

          return dialogRef.afterClosed().pipe(
            map(result => {
              if (result) {
                this.store.dispatch(
                  PaymentSlotAction.createPaymentSlot({
                    paymentSlotCardControlValue: result.paymentSlotCardControlValue
                  })
                );
              }
            })
          );
        })
      ),
    { dispatch: false }
  );
  public readonly editPaymentSlot$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PaymentSlotAction.editPaymentSlot),
      switchMap(({ initialPaymentSlot, paymentSlotCardControlValue }) => {
        const optimisticallyGeneratedPaymentSlot: PaymentSlot = {
          numberOfClasses: paymentSlotCardControlValue.numberOfClasses,
          price: paymentSlotCardControlValue.price,
          id: initialPaymentSlot.id,
          attendeeId: ''
        };

        return from(
          setDoc(doc(this.firestore, `payment-slots/${initialPaymentSlot.id}`), optimisticallyGeneratedPaymentSlot)
        ).pipe(
          //! we are listening to firestore changes anyway, so no need to insert created slot into state
          switchMap(() => EMPTY),
          catchError((error: HttpErrorResponse) => of(PaymentSlotAction.editPaymentSlotFailed({ error })))
        );
      })
    )
  );
  public openEditPaymentSlotDialog$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PaymentSlotAction.openEditPaymentSlotDialog),
        switchMap(({ paymentSlot }) => {
          const dialogRef: MatDialogRef<EditPaymentSlotDialogComponent, EditPaymentSlotDialogResponse> =
            this.dialog.open(EditPaymentSlotDialogComponent, { data: { paymentSlot } });

          return dialogRef.afterClosed().pipe(
            map(result => {
              if (result) {
                this.store.dispatch(
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
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private store: Store<PaymentSlotsState>,
    private firestore: Firestore,
    private dialog: MatDialog,
    private UUIDGeneratorService: UUIDGeneratorService
  ) {}
}
