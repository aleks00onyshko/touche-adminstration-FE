import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { collection, collectionData, doc, Firestore, setDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { catchError, from, Observable, of, pipe, switchMap, take, tap } from 'rxjs';
import { Shop } from '../../core/model/entities/shop.entity';
import { BotFunctionsService } from '../../core/services/firebase/functions/bot-functions.service';
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
}
