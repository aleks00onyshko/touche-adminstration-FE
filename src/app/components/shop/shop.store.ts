import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { collection, collectionData, deleteDoc, Firestore, setDoc, updateDoc } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { doc } from '@firebase/firestore';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { List, Map } from 'immutable';
import {
  EMPTY,
  filter,
  from,
  map,
  mergeMap,
  Observable,
  pipe,
  retry,
  switchMap,
  take,
  tap,
  withLatestFrom
} from 'rxjs';
import { Category } from '../../core/model/entities/category.entity';
import { Product } from '../../core/model/entities/product.entity';
import { UUIDGeneratorService } from '../../core/services/id-generator.service';
import { UploadService } from '../../core/services/upload.service';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';

export type CategoryWithoutProducts = Omit<Category, 'products'>;
export interface ShopState {
  id: string;
  name: string | null;
  selectedCategoryId: string | null;
  loading: boolean;
  compareMode: boolean;
  categories: List<CategoryWithoutProducts>;
  products: Map<string, List<Product>>;
}

export const initialState: ShopState = {
  id: '',
  name: null,
  selectedCategoryId: null,
  loading: true,
  compareMode: false,
  categories: List(),
  products: Map({})
};

export const TEMP_CATEGORY_ID = 'TEMP_CATEGORY_ID';

@Injectable()
export class ShopStore extends ComponentStore<ShopState> {
  public readonly loading$: Observable<boolean> = this.select(state => state.loading);
  public readonly shopId$: Observable<string> = this.select(state => state.id);
  public readonly categories$: Observable<CategoryWithoutProducts[]> = this.select(state => state.categories.toArray());
  public readonly products$: Observable<Map<string, List<Product>>> = this.select(state => state.products);
  public readonly selectedCategory$: Observable<CategoryWithoutProducts | undefined> = this.select(state =>
    state.categories.find(el => el.id === state.selectedCategoryId)
  );
  public readonly productsOfSelectedCategory$: Observable<Product[]> = this.select(
    state => state.products.get(state.selectedCategoryId ?? '')?.toArray() ?? []
  );
  public readonly compareMode$: Observable<boolean> = this.select(state => state.compareMode);

  public readonly addCategory = this.updater((state, category: Category) => ({
    ...state,
    categories: state.categories.push(category)
  }));
  public readonly setLoading = this.updater((state, loading: boolean) => ({ ...state, loading }));
  public readonly setCategories = this.updater((state, categories: Category[]) => ({
    ...state,
    categories: List(categories),
    products: categories.reduce((acc, category) => {
      return acc.set(category.id, List());
    }, Map<string, List<Product>>({}))
  }));
  public readonly setSelectedCategoryId = this.updater((state, id: string) => ({
    ...state,
    selectedCategoryId: id
  }));
  public readonly updateCategoryName = this.updater((state, { name, id }: Pick<Category, 'id' | 'name'>) => {
    const categoryIndex = state.categories.findIndex(el => el.id === id);

    if (state.categories.has(categoryIndex)) {
      return {
        ...state,
        categories: state.categories.update(
          categoryIndex,
          category => ({ ...category, name } as CategoryWithoutProducts)
        )
      };
    }

    return { ...state };
  });
  public readonly replaceTempCategory = this.updater((state, newCategory: CategoryWithoutProducts) => {
    const categoryIndex = state.categories.findIndex(el => el.id === TEMP_CATEGORY_ID);

    if (state.categories.has(categoryIndex)) {
      return {
        ...state,
        categories: state.categories.delete(categoryIndex).push(newCategory)
      };
    }

    return { ...state };
  });
  public readonly addProductToCategory = this.updater(
    (state, { product, categoryId }: { product: Product; categoryId: string }) => {
      if (state.products.has(categoryId)) {
        return {
          ...state,
          products: state.products.update(categoryId, products => products!.push(product))
        };
      }

      return { ...state };
    }
  );
  public readonly updateProductInCategory = this.updater(
    (state, { product, categoryId }: { product: Product; categoryId: string }) => {
      if (state.products.has(categoryId)) {
        return {
          ...state,
          products: state.products.update(categoryId, products =>
            products!.update(
              products!.findIndex(el => el.id === product.id),
              () => product
            )
          )
        };
      }

      return { ...state };
    }
  );
  public readonly deleteProductFromCategory = this.updater(
    (state, { productId, categoryId }: { productId: string; categoryId: string }) => {
      if (state.products.has(categoryId)) {
        return {
          ...state,
          products: state.products.update(categoryId, products =>
            products!.delete(products!.findIndex(el => el.id === productId))
          )
        };
      }

      return { ...state };
    }
  );
  public readonly setCategoryProducts = this.updater(
    (state, { products, categoryId }: { products: Product[]; categoryId: string }) => ({
      ...state,
      products: state.products.set(categoryId, List(products))
    })
  );
  public readonly setCompareMode = this.updater((state, mode: boolean) => ({ ...state, compareMode: mode }));

  constructor(
    private firestore: Firestore,
    private UUIDGeneratorService: UUIDGeneratorService,
    private uploadService: UploadService,
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
              if (categories.length > 0) {
                this.setCategories(categories);
                this.setSelectedCategoryId(categories[0].id);
                this.getProductsForCategory$(categories[0].id);
              }

              this.setLoading(false);
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
      tap(() => this.setLoading(true)),
      switchMap(([categoryId, shopId]) =>
        (
          collectionData(collection(this.firestore, `shops/${shopId}/categories/${categoryId}/products`)) as Observable<
            Product[]
          >
        ).pipe(
          take(1),
          tapResponse(
            products => {
              this.setCategoryProducts({ products, categoryId });
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
    pipe(
      tap(() => {
        this.addCategory({ name: '', id: TEMP_CATEGORY_ID, products: [] });
        this.setSelectedCategoryId(TEMP_CATEGORY_ID);
      })
    )
  );

  public readonly createCategory$ = this.effect((name$: Observable<string>) =>
    name$.pipe(
      withLatestFrom(this.shopId$),
      switchMap(([name, shopId]) => {
        const id = this.UUIDGeneratorService.generateId();

        return from(setDoc(doc(this.firestore, `shops/${shopId}/categories/${id}`), { id, name, products: [] })).pipe(
          tapResponse(
            () => {
              this.replaceTempCategory({ id, name });
              this.setSelectedCategoryId(id);
            },
            (err: HttpErrorResponse) => console.error(err.message)
          )
        );
      })
    )
  );

  public readonly categorySelected$ = this.effect((category$: Observable<CategoryWithoutProducts>) =>
    category$.pipe(
      withLatestFrom(this.products$),
      tap(([category, products]) => {
        this.setSelectedCategoryId(category.id);

        if (products.get(category.id)?.size === 0) {
          this.getProductsForCategory$(category.id);
        }
      })
    )
  );

  public readonly createProduct$ = this.effect(
    (productAndImage$: Observable<{ product: Omit<Product, 'id'>; image: File }>) =>
      productAndImage$.pipe(
        withLatestFrom(this.selectedCategory$, this.shopId$),
        switchMap(([{ product, image }, selectedCategory, shopId]) => {
          const id = this.UUIDGeneratorService.generateId();

          this.addProductToCategory({ product: { ...product, id }, categoryId: selectedCategory!.id });
          this.uploadFileToStorageAndUpdateProduct$({ product: { ...product, id }, image });

          return from(
            setDoc(doc(this.firestore, `shops/${shopId}/categories/${selectedCategory!.id}/products/${id}`), {
              id,
              ...product
            })
          ).pipe(
            tapResponse(
              () => EMPTY,
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
      tap(([product, _, category]) => this.updateProductInCategory({ product, categoryId: category!.id })),
      switchMap(([product, shopId, category]) =>
        from(
          updateDoc(doc(this.firestore, `shops/${shopId}/categories/${category!.id}/products/${product.id}`), {
            ...product
          })
        ).pipe(
          tapResponse(
            () => EMPTY,
            (err: HttpErrorResponse) => console.error(err.message)
          )
        )
      )
    )
  );

  public readonly uploadImageForProduct$ = this.effect((product$: Observable<Product>) =>
    product$.pipe(
      switchMap(product =>
        this.uploadService.getFiles(true, ['.png', '.jpeg', '.svg']).pipe(
          filter(images => images.length > 0),
          withLatestFrom(this.shopId$),
          tap(([images]) => {
            this.updateProduct$({ ...product, image: URL.createObjectURL(images[0]) });
            this.uploadFileToStorageAndUpdateProduct$({ image: images[0], product });
          })
        )
      )
    )
  );

  public uploadFileToStorageAndUpdateProduct$ = this.effect(
    (fileAndProductToUpdate$: Observable<{ image: File; product: Product }>) =>
      fileAndProductToUpdate$.pipe(
        withLatestFrom(this.shopId$),
        switchMap(([{ image, product }, shopId]) =>
          this.uploadService
            .uploadFileToStorage(image, shopId)
            .pipe(map(downloadUrl => downloadUrl && this.updateProduct$({ ...product, image: downloadUrl })))
        )
      )
  );
}
