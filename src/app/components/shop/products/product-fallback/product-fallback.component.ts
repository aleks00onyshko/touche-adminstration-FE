import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Output
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { animate, AnimationEvent, state, style, transition, trigger } from '@angular/animations';
import { EditableInputComponent } from '../../../../shared/components/editable-input/editable-input.component';
import { EditableTextareaComponent } from '../../../../shared/components/editable-textarea/editable-textarea.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Product } from '../../../../core/model/entities/product.entity';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { UploadService } from '../../../../core/services/upload.service';
import { take } from 'rxjs';
import { SanitizePipe } from '../../../../shared/pipes/sanitize.pipe';
import { ConvertImageToUrlPipe } from '../../../../shared/pipes/convert-image-to-url.pipe';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

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
    MatCardModule,
    SanitizePipe,
    ConvertImageToUrlPipe,
    MatTooltipModule,
    TranslateModule
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
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductFallbackComponent {
  @Output() onCreateProduct = new EventEmitter<{ product: Omit<Product, 'id'>; image: File }>();

  public image: File | null = null;
  public defaultImagePath = './assets/no-product-image-fallback.png';
  public collapsed = true;
  public showPlusButton = true;
  public showContent = false;

  public createProductForm = new FormGroup({
    name: new FormControl<string>('', [Validators.required]),
    description: new FormControl<string>('', [Validators.required]),
    price: new FormControl<number | null>(null, [Validators.required])
  });

  @HostListener('document:click', ['$event'])
  clickedOutside(event: PointerEvent) {
    if (
      !this.eRef.nativeElement.contains(event.target) &&
      !this.collapsed &&
      (event.target as any).localName !== 'input'
    ) {
      this.discardChanges();
    }
  }

  constructor(
    private eRef: ElementRef,
    private cdr: ChangeDetectorRef,
    private uploadService: UploadService,
    private translateService: TranslateService
  ) {}

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

  public uploadImage(): void {
    this.uploadService
      .getFiles(true, ['.png', '.jpeg', '.svg'])
      .pipe(take(1))
      .subscribe(images => {
        this.image = images[0];
        this.cdr.detectChanges();
      });
  }

  public discardChanges(): void {
    this.createProductForm.reset();
    this.collapsed = true;
    this.image = null;
  }

  public createProduct(): void {
    this.onCreateProduct.emit({
      product: {
        name: this.createProductForm.value.name!,
        description: this.createProductForm.value.description!,
        price: this.createProductForm.value.price!,
        image: URL.createObjectURL(this.image as File)
      },
      image: this.image as File
    });

    this.discardChanges();
  }
}
