import { ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { selectLoading, selectTeachers } from './store/teacher-settings.selector';
import { TeacherSettingsState } from './store/teacher-settings.reducer';
import { TeacherSettingsComponent } from './teacher-settings/teacher-settings.component';
import { MatIconModule } from '@angular/material/icon';
import { Teacher } from 'src/app/core/model/entities/teacher';
import { TeacherSettingsAction } from './store/teacher-settings.actions';
import { FilterTimeSlotCardControlStructure } from '../time-slots/components/time-slots/filter-time-slot/filter-time-slot.component';


export interface TeacherSettingsControlValue {
  description: string;
  number: string;
}
export type TeacherSettingsControlStructure = {
  description: FormControl<string | null>;
  number: FormControl<string | null>;
};
@Component({
  selector: 'app-teachers-settings',
  templateUrl: './teachers-settings.component.html',
  styleUrls: ['./teachers-settings.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    MatListModule,
    ReactiveFormsModule,
    TeacherSettingsComponent,
    MatIconModule
  ]
})
export class TeachersSettingsComponent {
  protected readonly teachers$ = this.store.select(selectTeachers);
  protected readonly loading$ = this.store.select(selectLoading);
  trackByTeacherId(index: number, teacher: Teacher): string {
    return teacher.id;
  }

  public readonly filterTeacherSlotForm = new FormGroup<TeacherSettingsControlStructure>({
    description: new FormControl(null),
    number: new FormControl(null)
  });

  public readonly controls: TeacherSettingsControlStructure = {
  description: this.filterTeacherSlotForm.controls.description,
  number: this.filterTeacherSlotForm.controls.number
  };

  constructor(private store: Store<TeacherSettingsState>) {}

  saveTeacher(updatedData: { description: string; number: string }, teacherId: string) {
    this.store.dispatch(
      TeacherSettingsAction.updateTeacher({
        teacher: {
          id: teacherId,
          ...updatedData,
          imageUrl: '',
          subjects: '',
          displayName: null,
          email: null,
          uid: ''
        }
      })
    );
  }
}
