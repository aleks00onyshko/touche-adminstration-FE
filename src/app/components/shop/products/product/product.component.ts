import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../../core/model/entities/product.entity';
import { EditableInputComponent } from '../../../../shared/components/editable-input/editable-input.component';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EditableTextareaComponent } from '../../../../shared/components/editable-textarea/editable-textarea.component';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { SanitizePipe } from '../../../../shared/pipes/sanitize.pipe';

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
    MatButtonModule,
    SanitizePipe
  ],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductComponent implements OnInit {
  @Input() product!: Product;

  @Output() update = new EventEmitter<Product>();
  @Output() delete = new EventEmitter<string>();
  @Output() uploadImage = new EventEmitter<Product>();

  public productFormGroup!: FormGroup;
  public controls!: { [key: string]: AbstractControl };

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
}
