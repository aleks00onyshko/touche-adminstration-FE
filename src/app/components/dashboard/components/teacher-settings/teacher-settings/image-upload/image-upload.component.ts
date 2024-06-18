import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule as MatIcon } from '@angular/material/icon';
import { ImageUploadService } from './service/image-upload.service';

@Component({
    selector: 'app-image-upload',
    templateUrl: './image-upload.component.html',
    styleUrls: ['./image-upload.component.scss'],
    standalone: true,
    imports: [
        ReactiveFormsModule,
        CommonModule,
        MatIcon,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageUploadComponent {
    @Input() imageUrl: string | null = null;
    @Output() imageUrlChange = new EventEmitter<string>();

    uploadForm: FormGroup;
    imgSrc: string = '/assets/img/image_placeholder.jpg';
    selectedFile: File | null = null;
    isSubmitted: boolean = false;
    forms: FormGroup[] = [];
    @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement> | undefined;

    constructor(
        private fb: FormBuilder,
        private imageUploadService: ImageUploadService
    ) {
        this.uploadForm = this.fb.group({
            imageUrl: ['', Validators.required]
        });
    }

    ngOnInit(): void {
        if (this.imageUrl) {
            this.imgSrc = this.imageUrl;
            this.uploadForm.patchValue({ imageUrl: this.imageUrl });
        }
    }

    get formControls() {
        return this.uploadForm.controls;
    }

    triggerFileInput(): void {
        this.fileInput!.nativeElement.click();
    }

    showPreview(event: any): void {
        if (event.target.files && event.target.files[0]) {
            const file: File = event.target.files[0];
            this.imageUploadService.uploadImage(file).then(url => {
                this.imgSrc = url; 
                this.imageUrlChange.emit(url);
                this.uploadForm.reset();  // Очистка форми після завантаження фото
            }).catch(error => {
                console.error('Error uploading image:', error);
            });
        } else {
            this.imgSrc = '/assets/img/image_placeholder.jpg';
            this.selectedFile = null;
        }
    }

    onSubmit(): void {
        this.isSubmitted = true;
        if (this.uploadForm.valid) {
            console.log('Form Submitted', this.uploadForm.value);
        }
    }
}
