import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../core/model/entities/product.entity';
import { MatCardModule } from '@angular/material/card';
import { EditableInputComponent } from '../../../shared/components/editable-input/editable-input.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { EditableTextareaComponent } from '../../../shared/components/editable-textarea/editable-textarea.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    EditableInputComponent,
    EditableTextareaComponent,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  @Input() product!: Product;

  @Output() delete = new EventEmitter<string>();

  public productFormGroup!: FormGroup;
  public amount: number = 0;

  public ngOnInit(): void {
    const { name, description, price } = this.product;

    this.productFormGroup = new FormGroup({
      name: new FormControl<string>(name ?? 'Sample Name'),
      description: new FormControl<string>(description ?? 'Sample Description'),
      price: new FormControl<number>(price ?? 10)
    });
  }

  public deleteProduct(): void {
    this.delete.emit(this.product.id);
  }

  public add(): void {
    this.amount += 1;
  }

  public remove(): void {
    this.amount -= 1;
  }
}
