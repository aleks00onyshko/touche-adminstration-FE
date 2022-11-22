import { Component, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { animate, AnimationEvent, state, style, transition, trigger } from '@angular/animations';
import { EditableInputComponent } from '../../../shared/components/editable-input/editable-input.component';
import { EditableTextareaComponent } from '../../../shared/components/editable-textarea/editable-textarea.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { Product } from '../../../core/model/entities/product.entity';

@Component({
  selector: 'app-product-fallback',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    EditableInputComponent,
    EditableTextareaComponent,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './product-fallback.component.html',
  styleUrls: ['./product-fallback.component.scss'],
  animations: [
    trigger('collapseExpand', [
      state(
        'expanded',
        style({
          width: '17rem'
        })
      ),
      state(
        'collapsed',
        style({
          width: '4rem'
        })
      ),
      transition('expanded <=> collapsed', animate(200))
    ])
  ]
})
export class ProductFallbackComponent {
  @Output() onCreateProduct = new EventEmitter<Omit<Product, 'id'>>();

  public collapsed = true;
  public showPlusButton = true;
  public showContent = false;

  public initialFormValue = { name: 'Sample Name', description: 'Sample description', price: 200 };
  public createProductForm = new FormGroup({
    name: new FormControl<string>(this.initialFormValue.name, [Validators.required]),
    description: new FormControl<string>(this.initialFormValue.description, [Validators.required]),
    price: new FormControl<number>(this.initialFormValue.price, [Validators.required])
  });

  @HostListener('document:click', ['$event'])
  clickedOutside(event: PointerEvent) {
    if (!this.eRef.nativeElement.contains(event.target) && !this.collapsed) {
      this.discardChanges();
    }
  }

  constructor(private eRef: ElementRef) {}

  public animationEnded(event: AnimationEvent): void {
    if (event.fromState === 'expanded') {
      this.showPlusButton = true;
    }

    if (event.fromState === 'collapsed') {
      this.showContent = true;
    }
  }
  public animationStarted(event: AnimationEvent): void {
    if (event.fromState === 'collapsed') {
      this.showPlusButton = false;
    }

    if (event.fromState === 'expanded') {
      this.showContent = false;
    }
  }

  public open(event: MouseEvent): void {
    event.stopImmediatePropagation();
    this.collapsed = false;
  }

  public discardChanges(): void {
    this.createProductForm.reset(this.initialFormValue);
    this.collapsed = true;
  }

  public createProduct(): void {
    this.onCreateProduct.emit({
      name: this.createProductForm.value.name!,
      description: this.createProductForm.value.description!,
      price: this.createProductForm.value.price!,
      image: './assets/pizza-final3.svg'
    });

    this.discardChanges();
  }
}
