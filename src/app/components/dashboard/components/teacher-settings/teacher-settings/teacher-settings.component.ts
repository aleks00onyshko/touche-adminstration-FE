import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output
} from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { Teacher } from 'src/app/core/model/entities/teacher';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReactiveComponent } from 'src/app/core/classes/reactive';
import { debounceTime, takeUntil } from 'rxjs';
import { SimpleChangesGeneric } from 'src/app/core/model/simple-changes-generic.model';
import { ImageUploadComponent } from './image-upload/image-upload.component';
import { ConvertUsersToAvatarsPipe } from '../../../../../shared/components/avatar/pipes/convert-users-to-avatar-configs.pipe';
import { AVATAR_SIZE } from '../../../../../shared/components/avatar/models/avatar-configuration';
import { UploadAvatarComponent } from '../../../../../shared/components/avatar/components/upload-avatar/upload-avatar.component';

export type TeacherSettingsControlStructure = {
  description: FormControl<string | null>;
  number: FormControl<string | null>;
  backgroundImageUrl: FormControl<string | null>;
  displayName: FormControl<string | null>;
};

@Component({
  selector: 'app-teacher-settings',
  templateUrl: './teacher-settings.component.html',
  styleUrls: ['./teacher-settings.component.scss'],
  standalone: true,
  imports: [
    MatExpansionModule,
    CommonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatInputModule,
    ImageUploadComponent,
    UploadAvatarComponent,
    ConvertUsersToAvatarsPipe
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeacherSettingsComponent extends ReactiveComponent implements OnInit, OnChanges {
  @Input({ required: true }) teacher!: Teacher;
  @Output() teacherUpdated = new EventEmitter<Teacher>();

  public readonly teacherSettingsForm = new FormGroup<TeacherSettingsControlStructure>({
    description: new FormControl(null, [Validators.required]),
    number: new FormControl(null, [Validators.required]),
    backgroundImageUrl: new FormControl(null, [Validators.required]),
    displayName: new FormControl(null, [Validators.required])
  });
  public readonly controls: TeacherSettingsControlStructure = {
    description: this.teacherSettingsForm.controls.description,
    number: this.teacherSettingsForm.controls.number,
    backgroundImageUrl: this.teacherSettingsForm.controls.backgroundImageUrl,
    displayName: this.teacherSettingsForm.controls.displayName
  };
  public avatarSize = AVATAR_SIZE;

  constructor(private cdr: ChangeDetectorRef) {
    super();
  }

  ngOnInit(): void {
    this.teacherSettingsForm.valueChanges.pipe(takeUntil(this.unsubscribe$), debounceTime(3000)).subscribe(value => {
      if (this.teacherSettingsForm.valid) {
        this.teacherUpdated.emit({
          ...this.teacher,
          description: value.description!,
          number: value.number!,
          backgroundImageUrl: value.backgroundImageUrl!,
          displayName: value.displayName!
        });
      }
    });
  }

  public ngOnChanges({
    teacher: { currentValue: currentTeacher }
  }: SimpleChangesGeneric<TeacherSettingsComponent>): void {
    this.teacherSettingsForm.patchValue(
      {
        description: currentTeacher.description,
        number: currentTeacher.number,
        backgroundImageUrl: currentTeacher.backgroundImageUrl,
        displayName: currentTeacher.displayName
      },
      { emitEvent: false }
    );

    this.cdr.detectChanges();
  }

  protected updateTeacherWithNewImage(downloadImageUrl: string): void {
    this.teacherUpdated.emit({ ...this.teacher, backgroundImageUrl: downloadImageUrl });
  }
}
