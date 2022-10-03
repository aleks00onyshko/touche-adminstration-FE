import { state } from '@angular/animations';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, DocumentReference, Firestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { catchError, delay, from, map, Observable, of, pipe, switchMap, take, tap } from 'rxjs';
import { Shop } from '../../core/model/entities/shop.entity';
import { BotFunctionsService } from '../../core/services/firebase/functions/bot-functions.service';
import { CreateShopDialogResult } from './create-store-dialog/create-store-dialog.component';

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

  private readonly addShops = this.updater((state, shops: Shop[]) => ({ ...state, shops: shops.map(({ name, id }) => ({ name, id })) }));
  private readonly setLoading = this.updater((state, loading: boolean) => ({ ...state, loading }));

  constructor(private firestore: Firestore, private router: Router, private botFunctionsService: BotFunctionsService) {
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
          switchMap(() =>
            from(addDoc(collection(this.firestore, 'shops'), { name: shopName, botToken } as Shop)).pipe(
              tapResponse(
                (newShopRef: DocumentReference) => {
                  this.router.navigate(['shop', newShopRef.id]);
                },
                (err: HttpErrorResponse) => console.error(err.message)
              )
            )
          ),
          catchError((err: HttpErrorResponse) => {
            this.setLoading(false);
            return of(err);
          })
        )
      )
    )
  );
}
