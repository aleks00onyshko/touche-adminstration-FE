import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { collection, collectionData, deleteDoc, Firestore, setDoc, updateDoc } from '@angular/fire/firestore';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { doc } from '@firebase/firestore';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { EMPTY, from, mergeMap, Observable, pipe, switchMap, take, tap, withLatestFrom } from 'rxjs';
import { Category } from '../../core/model/entities/category.entity';
import { Product } from '../../core/model/entities/product.entity';
import { UUIDGeneratorService } from '../../core/services/id-generator.service';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';

export interface ShopState {
  name: string | null;
  id: string;
  selectedCategoryId: string | null;
  loading: boolean;
  categories: Category[];
}

export const initialState: ShopState = {
  name: null,
  id: '',
  selectedCategoryId: null,
  loading: true,
  categories: []
};

export const TEMP_CATEGORY_ID = 'TEMP_CATEGORY_ID';

@Injectable()
export class ShopStore extends ComponentStore<ShopState> {
  public readonly loading$: Observable<boolean> = this.select(state => state.loading);
  public readonly shopId$: Observable<string> = this.select(state => state.id);
  public readonly categories$: Observable<Category[]> = this.select(state => state.categories);
  public readonly selectedCategory$: Observable<Category | undefined> = this.select(state =>
    state.categories.find(el => el.id === state.selectedCategoryId)
  );

  public readonly addCategory = this.updater((state, category: Category) => ({
    ...state,
    categories: [...state.categories, category]
  }));
  public readonly setLoading = this.updater((state, loading: boolean) => ({ ...state, loading }));
  public readonly setCategories = this.updater((state, categories: Category[]) => ({ ...state, categories }));
  public readonly setSelectedCategoryId = this.updater((state, id: string) => ({
    ...state,
    selectedCategoryId: id
  }));
  public readonly updateCategoryName = this.updater((state, { name, id }: Pick<Category, 'id' | 'name'>) => {
    const categoryIndex = state.categories.findIndex(el => el.id === id);

    state.categories[categoryIndex] = { ...state.categories[categoryIndex], name };

    return { ...state, categories: [...state.categories] };
  });
  public readonly replaceTempCategory = this.updater((state, newCategory: Category) => {
    const categoryIndex = state.categories.findIndex(el => el.id === TEMP_CATEGORY_ID);

    state.categories[categoryIndex] = { ...state.categories[categoryIndex], ...newCategory };

    return { ...state, categories: [...state.categories] };
  });
  public readonly addProductToCategory = this.updater(
    (state, { product, categoryId }: { product: Product; categoryId: string }) => {
      const categoryIndex = state.categories.findIndex(el => el.id === categoryId);

      state.categories[categoryIndex] = {
        ...state.categories[categoryIndex],
        products: [product, ...state.categories[categoryIndex].products]
      };

      return { ...state, categories: [...state.categories] };
    }
  );
  public readonly updateProductInCategory = this.updater(
    (state, { product, categoryId }: { product: Product; categoryId: string }) => {
      const categoryIndex = state.categories.findIndex(el => el.id === categoryId);
      const productIndex = state.categories[categoryIndex].products.findIndex(el => el.id === product.id);

      if (state.categories[categoryIndex]) {
        state.categories[categoryIndex].products[productIndex] = { ...product };
      }

      return { ...state, categories: [...state.categories] };
    }
  );
  public readonly deleteProductFromCategory = this.updater(
    (state, { productId, categoryId }: { productId: string; categoryId: string }) => {
      const categoryIndex = state.categories.findIndex(el => el.id === categoryId);

      state.categories[categoryIndex] = {
        ...state.categories[categoryIndex],
        products: state.categories[categoryIndex].products.filter(el => el.id !== productId)
      };

      return { ...state, categories: [...state.categories] };
    }
  );
  public readonly setProductsToCategory = this.updater(
    (state, { products, categoryId }: { products: Product[]; categoryId: string }) => {
      const categoryIndex = state.categories.findIndex(el => el.id === categoryId);

      state.categories[categoryIndex] = {
        ...state.categories[categoryIndex],
        products: [...products]
      };

      return { ...state, categories: [...state.categories] };
    }
  );

  constructor(
    private firestore: Firestore,
    private UUIDGeneratorService: UUIDGeneratorService,
    private matDialog: MatDialog
  ) {
    super();
  }

  public readonly getCategories$ = this.effect<void>(
    pipe(
      withLatestFrom(this.shopId$),
      switchMap(([_, shopId]) =>
        (collectionData(collection(this.firestore, 'shops', shopId, 'categories')) as Observable<Category[]>).pipe(
          take(1),
          tap(() => this.setLoading(true)),
          tapResponse(
            categories => {
              this.setCategories(categories);
              this.setSelectedCategoryId(categories[0].id);
              this.setLoading(false);
              this.getProductsForCategory$(categories[0].id);
            },
            (err: HttpErrorResponse) => console.error(err.message)
          )
        )
      )
    )
  );

  public readonly getProductsForCategory$ = this.effect((categoryId$: Observable<string>) =>
    categoryId$.pipe(
      withLatestFrom(this.shopId$),
      switchMap(([categoryId, shopId]) =>
        (
          collectionData(collection(this.firestore, `shops/${shopId}/categories/${categoryId}/products`)) as Observable<
            Product[]
          >
        ).pipe(
          take(1),
          tap(() => this.setLoading(true)),
          tapResponse(
            products => {
              this.setProductsToCategory({ products, categoryId });
              this.setLoading(false);
            },
            (err: HttpErrorResponse) => console.error(err.message)
          )
        )
      )
    )
  );

  public readonly updateCategoryName$ = this.effect((categoryNameAndId$: Observable<Pick<Category, 'id' | 'name'>>) =>
    categoryNameAndId$.pipe(
      tap(categoryNameAndId => this.updateCategoryName(categoryNameAndId)),
      withLatestFrom(this.shopId$),
      switchMap(([{ id, name }, shopId]) =>
        from(updateDoc(doc(this.firestore, `shops/${shopId}/categories/${id}`), { name })).pipe(
          tapResponse(
            () => EMPTY,
            (err: HttpErrorResponse) => console.error(err.message)
          )
        )
      )
    )
  );

  public readonly createTempCategory$ = this.effect<void>(
    pipe(tap(() => this.addCategory({ name: '', id: TEMP_CATEGORY_ID, products: [] })))
  );

  public readonly createCategory$ = this.effect((name$: Observable<string>) =>
    name$.pipe(
      withLatestFrom(this.shopId$, this.categories$),
      switchMap(([name, shopId, categories]) => {
        const id = this.UUIDGeneratorService.generateId();

        return from(setDoc(doc(this.firestore, `shops/${shopId}/categories/${id}`), { id, name, products: [] })).pipe(
          tapResponse(
            () => {
              this.replaceTempCategory({ id, name, products: [] });
              this.setSelectedCategoryId(id);
            },
            (err: HttpErrorResponse) => console.error(err.message)
          )
        );
      })
    )
  );

  public readonly categorySelected$ = this.effect((category$: Observable<Category>) =>
    category$.pipe(
      tap(category => {
        this.setSelectedCategoryId(category.id);

        if (category.products.length === 0) {
          this.getProductsForCategory$(category.id);
        }
      })
    )
  );

  public readonly createProduct$ = this.effect((product$: Observable<Omit<Product, 'id'>>) =>
    product$.pipe(
      withLatestFrom(this.selectedCategory$, this.shopId$),
      switchMap(([product, selectedCategory, shopId]) => {
        const id = this.UUIDGeneratorService.generateId();

        return from(
          setDoc(doc(this.firestore, `shops/${shopId}/categories/${selectedCategory!.id}/products/${id}`), {
            id,
            ...product
          })
        ).pipe(
          tapResponse(
            () => this.addProductToCategory({ product: { ...product, id }, categoryId: selectedCategory!.id }),
            (err: HttpErrorResponse) => console.error(err.message)
          )
        );
      })
    )
  );

  public readonly deleteProduct$ = this.effect((id$: Observable<string>) =>
    id$.pipe(
      switchMap(productId =>
        this.matDialog
          .open(ConfirmDialogComponent, { data: 'Do you want to delete this product?' })
          .afterClosed()
          .pipe(
            withLatestFrom(this.shopId$, this.selectedCategory$),
            mergeMap(([confirmed, shopId, category]) =>
              confirmed
                ? from(
                    deleteDoc(doc(this.firestore, `shops/${shopId}/categories/${category!.id}/products/${productId}`))
                  ).pipe(
                    tap(() => this.deleteProductFromCategory({ productId, categoryId: category!.id })),
                    tapResponse(
                      () => EMPTY,
                      (err: HttpErrorResponse) => console.error(err.message)
                    )
                  )
                : EMPTY
            )
          )
      )
    )
  );

  public readonly updateProduct$ = this.effect((product$: Observable<Product>) =>
    product$.pipe(
      withLatestFrom(this.shopId$, this.selectedCategory$),
      switchMap(([product, shopId, category]) =>
        from(
          updateDoc(doc(this.firestore, `shops/${shopId}/categories/${category!.id}/products/${product.id}`), {
            ...product
          })
        ).pipe(
          tapResponse(
            () => this.updateProductInCategory({ product, categoryId: category!.id }),
            (err: HttpErrorResponse) => console.error(err.message)
          )
        )
      )
    )
  );
}
