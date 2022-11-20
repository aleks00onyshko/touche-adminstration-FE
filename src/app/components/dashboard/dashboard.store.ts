import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, doc, DocumentReference, Firestore, setDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { catchError, from, Observable, of, pipe, switchMap, take, tap } from 'rxjs';
import { Shop } from '../../core/model/entities/shop.entity';
import { BotFunctionsService } from '../../core/services/firebase/functions/bot-functions.service';
import { CreateShopDialogResult } from './create-store-dialog/create-store-dialog.component';
import { v4 as uuid } from 'uuid';
import { UUIDGeneratorService } from '../../core/services/id-generator.service';

export interface DashboardState {
  shops: Pick<Shop, 'name' | 'id'>[];
  loading: boolean;
}

export const initialState: DashboardState = {
  shops: [],
  loading: true
};

@Injectable()
export class DashboardStore extends ComponentStore<DashboardState> {
  public readonly shops$: Observable<Pick<Shop, 'name' | 'id'>[]> = this.select(state => state.shops);
  public readonly loading$: Observable<boolean> = this.select(state => state.loading);

  private readonly addShops = this.updater((state, shops: Shop[]) => ({
    ...state,
    shops: shops.map(({ name, id }) => ({ name, id }))
  }));
  private readonly setLoading = this.updater((state, loading: boolean) => ({ ...state, loading }));

  constructor(
    private firestore: Firestore,
    private router: Router,
    private botFunctionsService: BotFunctionsService,
    private UUIDGeneratorService: UUIDGeneratorService
  ) {
    super(initialState);
  }

  public readonly getShops = this.effect<void>(
    pipe(
      switchMap(() =>
        (collectionData(collection(this.firestore, 'shops'), { idField: 'id' }) as Observable<Shop[]>).pipe(
          take(1),
          tap(() => this.setLoading(true)),
          tapResponse(
            shops => {
              this.addShops(shops);
              this.setLoading(false);
            },
            (err: HttpErrorResponse) => console.error(err.message)
          )
        )
      )
    )
  );

  public readonly createShop = this.effect((res$: Observable<CreateShopDialogResult>) =>
    res$.pipe(
      tap(() => this.setLoading(true)),
      switchMap(({ botToken, shopName }) =>
        this.botFunctionsService.createBot(botToken).pipe(
          switchMap(() => {
            const id = this.UUIDGeneratorService.generateId();

            return from(setDoc(doc(this.firestore, 'shops', id), { name: shopName, id, botToken })).pipe(
              tapResponse(
                () => this.router.navigate(['shop', id]),
                (err: HttpErrorResponse) => console.error(err.message)
              )
            );
          }),
          catchError((err: HttpErrorResponse) => {
            this.setLoading(false);
            return of(err);
          })
        )
      )
    )
  );
}
