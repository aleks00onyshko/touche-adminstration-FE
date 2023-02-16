import { Component, EventEmitter, Input, Output, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DragAndDropContainerComponent } from '../../../shared/components/drag-and-drop-container/drag-and-drop-container.component';
import { ProductFallbackComponent } from './product-fallback/product-fallback.component';
import { ProductComponent } from './product/product.component';
import { Product } from '../../../core/model/entities/product.entity';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    ProductComponent,
    ProductFallbackComponent,
    DragDropModule,
    DragAndDropContainerComponent,
    MatIconModule
  ],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent {
  @Input() products!: Product[];
  @Input() compareMode!: boolean;

  @Output() createProduct = new EventEmitter<{ product: Omit<Product, 'id'>; image: File }>();
  @Output() uploadImageForProduct = new EventEmitter<Product>();
  @Output() updateProduct = new EventEmitter<Product>();
  @Output() deleteProduct = new EventEmitter<string>();
}
