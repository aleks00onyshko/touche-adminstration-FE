import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../core/model/entities/product.entity';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { EditableInputComponent } from '../../../shared/components/editable-input/editable-input.component';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EditableTextareaComponent } from '../../../shared/components/editable-textarea/editable-textarea.component';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';

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

  @Output() update = new EventEmitter<Product>();
  @Output() delete = new EventEmitter<string>();

  public productFormGroup!: FormGroup;
  public controls!: { [key: string]: AbstractControl };
  public amount: number = 0;

  public ngOnInit(): void {
    const { name, description, price } = this.product;

    this.productFormGroup = new FormGroup({
      name: new FormControl<string>(name, [Validators.required]),
      description: new FormControl<string>(description, [Validators.required]),
      price: new FormControl<number>(price, [Validators.required])
    });
    this.controls = {
      name: this.productFormGroup.controls['name'],
      description: this.productFormGroup.controls['description'],
      price: this.productFormGroup.controls['price']
    };
  }

  public onFocusLost(changedProperties: Partial<Product>): void {
    this.update.emit({ ...this.product, ...changedProperties });
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
