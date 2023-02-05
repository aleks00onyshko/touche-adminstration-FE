import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';
import { ReactiveFormsModule } from '@angular/forms';
import { EditableInputComponent } from '../../shared/components/editable-input/editable-input.component';
import { Category } from '../../core/model/entities/category.entity';
import { CategoryFilterNameComponent } from './category-filter-name/category-filter-name.component';
import { MatIconModule } from '@angular/material/icon';
import { initialState, ShopStore, TEMP_CATEGORY_ID } from './shop.store';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductComponent } from './product/product.component';
import { ProductFallbackComponent } from './product-fallback/product-fallback.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Product } from '../../core/model/entities/product.entity';
import { CdkDragDrop, DragDropModule, DragRef, moveItemInArray, Point } from '@angular/cdk/drag-drop';
import { DragAndDropContainerComponent } from '../../shared/components/drag-and-drop-container/drag-and-drop-container.component';

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
    MatDialogModule,
    DragDropModule,
    DragAndDropContainerComponent
  ],
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
  providers: [ShopStore],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShopComponent implements OnInit {
  public TEMP_CATEGORY_ID = TEMP_CATEGORY_ID;

  constructor(private route: ActivatedRoute, public shopStore: ShopStore) {}

  public ngOnInit(): void {
    this.shopStore.setState({ ...initialState, id: this.route.snapshot.paramMap.get('id') ?? '' });
    this.shopStore.state$.subscribe(state => console.log(state));

    this.shopStore.getCategories$();
  }

  public categoryNameChanged({ name, id }: Pick<Category, 'id' | 'name'>): void {
    id === this.TEMP_CATEGORY_ID
      ? this.shopStore.createCategory$(name)
      : this.shopStore.updateCategoryName$({ name, id });
  }
}
