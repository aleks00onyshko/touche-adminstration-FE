import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { EditableInputComponent } from '../../shared/components/editable-input/editable-input.component';
import { Category } from '../../core/model/entities/category.entity';
import { CategoryFilterNameComponent } from './category-filter-name/category-filter-name.component';
import { MatIconModule } from '@angular/material/icon';
import { initialState, ShopStore, TEMP_CATEGORY_ID } from './shop.store';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductComponent } from './product/product.component';
import { ProductFallbackComponent } from './product-fallback/product-fallback.component';
import { Product } from '../../core/model/entities/product.entity';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatButtonModule,
    MatCardModule,
    SpinnerComponent,
    EditableInputComponent,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    CategoryFilterNameComponent,
    MatIconModule,
    RouterModule,
    ProductComponent,
    ProductFallbackComponent,
    MatDialogModule
  ],
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
  providers: [ShopStore]
})
export class ShopComponent implements OnInit {
  public TEMP_CATEGORY_ID = TEMP_CATEGORY_ID;

  constructor(private route: ActivatedRoute, public shopStore: ShopStore) {
    this.shopStore.setState({ ...initialState, id: route.snapshot.paramMap.get('id') ?? '' });
  }

  public ngOnInit(): void {
    this.shopStore.state$.subscribe(state => console.log(state));

    this.shopStore.getCategories$();
  }

  public categoryNameChanged({ name, id }: Pick<Category, 'id' | 'name'>): void {
    id === this.TEMP_CATEGORY_ID
      ? this.shopStore.createCategory$(name)
      : this.shopStore.updateCategoryName$({ name, id });
  }

  public createTempCategory(): void {
    this.shopStore.createTempCategory$();
  }

  public createProduct(product: Omit<Product, 'id'>): void {
    this.shopStore.createProduct$(product);
  }
}
