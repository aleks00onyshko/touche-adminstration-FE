import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { Teacher } from 'src/app/core/model/entities/teacher';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReactiveComponent } from 'src/app/core/classes/reactive';
import { debounceTime, takeUntil } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { SimpleChangesGeneric } from 'src/app/core/model/simple-changes-generic.model';
import { ImageUploadComponent } from '../teacher-settings/image-upload/image-upload.component';
import { FirebaseStorage } from '@firebase/storage';
import { Storage } from '@angular/fire/storage';

export interface TeacherSettingsControlValue {
  description: string | null;
  number: string | null;
  displayName: string | null;
  imageUrl: string | null;
}

export type TeacherSettingsControlStructure = {
  description: FormControl<string | null>;
  number: FormControl<string | null>;
  imageUrl: FormControl<string | null>;
  displayName: FormControl<string | null>;
};

@Component({
  selector: 'app-teacher-settings',
  templateUrl: './teacher-settings.component.html',
  styleUrls: ['./teacher-settings.component.scss'],
  standalone: true,
  imports: [MatExpansionModule, CommonModule, MatIconModule, ReactiveFormsModule, MatInputModule, ImageUploadComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeacherSettingsComponent extends ReactiveComponent implements OnInit, OnChanges {
  @Input({ required: true }) teacher!: Teacher;
  @Output() teacherUpdated = new EventEmitter<Teacher>();

  public readonly teacherSettingsForm = new FormGroup<TeacherSettingsControlStructure>({
    description: new FormControl(null, [Validators.required]),
    number: new FormControl(null, [Validators.required]),
    imageUrl: new FormControl(null, [Validators.required]),
    displayName: new FormControl(null, [Validators.required])
  });

  public readonly controls: TeacherSettingsControlStructure = {
    description: this.teacherSettingsForm.controls.description,
    number: this.teacherSettingsForm.controls.number,
    imageUrl: this.teacherSettingsForm.controls.imageUrl,
    displayName: this.teacherSettingsForm.controls.displayName
  };

  constructor(private cdr: ChangeDetectorRef, public storage: Storage) {
    super();
  }

  ngOnInit(): void {
    this.teacherSettingsForm.valueChanges.pipe(takeUntil(this.unsubscribe$), debounceTime(3000)).subscribe(value => {
      if (this.teacherSettingsForm.valid) {
        console.log(value);
        this.teacherUpdated.emit({
          ...this.teacher,
          description: value.description!,
          number: value.number!,
          imageUrl: value.imageUrl!,
          displayName: value.displayName!
        });
      }
    });
  }

  ngOnChanges({ teacher: { currentValue: currentTeacher } }: SimpleChangesGeneric<TeacherSettingsComponent>): void {
    if (currentTeacher !== null) {
      this.teacherSettingsForm.patchValue({
        description: currentTeacher.description,
        number: currentTeacher.number,
        imageUrl: currentTeacher.imageUrl,
        displayName: currentTeacher.displayName
      }, { emitEvent: false });
      this.cdr.detectChanges();
    }
  }

  onImageUrlChange(newImageUrl: string): void {
    this.teacherSettingsForm.patchValue({ imageUrl: newImageUrl });
  }
}
