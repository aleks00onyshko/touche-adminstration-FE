import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryFilterNameComponent } from './category-filter-name/category-filter-name.component';
import { MatIconModule } from '@angular/material/icon';
import { CategoryWithoutProducts, TEMP_CATEGORY_ID } from '../shop.store';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, CategoryFilterNameComponent, MatIconModule],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent {
  @Input() categories!: CategoryWithoutProducts[];
  @Input() selectedCategory!: CategoryWithoutProducts | null;

  @Output() selectCategory = new EventEmitter<CategoryWithoutProducts>();
  @Output() changeCategoryName = new EventEmitter<{ name: string; id: string }>();
  @Output() createCategory = new EventEmitter<string>();
  @Output() createTempCategory = new EventEmitter<void>();

  public TEMP_CATEGORY_ID = TEMP_CATEGORY_ID;

  public categoryNameWasChanged({ name, id }: CategoryWithoutProducts): void {
    id === this.TEMP_CATEGORY_ID ? this.createCategory.emit(name) : this.changeCategoryName.emit({ name, id });
  }
}
