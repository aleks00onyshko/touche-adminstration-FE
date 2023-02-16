import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';
import { ReactiveFormsModule } from '@angular/forms';
import { EditableInputComponent } from '../../shared/components/editable-input/editable-input.component';
import { Category } from '../../core/model/entities/category.entity';
import { CategoryFilterNameComponent } from './categories/category-filter-name/category-filter-name.component';
import { MatIconModule } from '@angular/material/icon';
import { initialState, ShopStore, TEMP_CATEGORY_ID } from './shop.store';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductComponent } from './products/product/product.component';
import { ProductFallbackComponent } from './products/product-fallback/product-fallback.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DragAndDropContainerComponent } from '../../shared/components/drag-and-drop-container/drag-and-drop-container.component';
import { CompareButtonComponent } from './compare-button/compare-button.component';
import { CategoriesComponent } from './categories/categories.component';
import { ProductsComponent } from './products/products.component';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatCardModule,
    SpinnerComponent,
    MatDialogModule,
    RouterModule,
    CompareButtonComponent,
    CategoriesComponent,
    ProductsComponent
  ],
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
  providers: [ShopStore],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShopComponent implements OnInit {
  constructor(private route: ActivatedRoute, public shopStore: ShopStore) {}

  public ngOnInit(): void {
    this.shopStore.setState({ ...initialState, id: this.route.snapshot.paramMap.get('id') ?? '' });
    this.shopStore.getCategories$();

    this.shopStore.state$.subscribe(state => console.log(state));
  }
}
