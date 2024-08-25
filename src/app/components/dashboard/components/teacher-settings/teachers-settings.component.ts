import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { selectLoading, selectSelectedTeacherId, selectTeachers } from './store/teacher-settings.selector';
import { TeacherSettingsState } from './store/teacher-settings.reducer';
import { TeacherSettingsComponent } from './teacher-settings/teacher-settings.component';
import { MatIconModule } from '@angular/material/icon';
import { Teacher } from 'src/app/core/model/entities/teacher';
import { TeacherSettingsAction } from './store/teacher-settings.actions';
import { AvatarComponent } from '../../../../shared/components/avatar/components/avatar/avatar.component';
import { ConvertUsersToAvatarsPipe } from '../../../../shared/components/avatar/pipes/convert-users-to-avatar-configs.pipe';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-teachers-settings',
  templateUrl: './teachers-settings.component.html',
  styleUrls: ['./teachers-settings.component.scss'],
  standalone: true,
  imports: [
    TranslateModule,
    CommonModule,
    MatExpansionModule,
    MatListModule,
    ReactiveFormsModule,
    TeacherSettingsComponent,
    MatIconModule,
    AvatarComponent,
    ConvertUsersToAvatarsPipe
  ]
})
export class TeachersSettingsComponent {
  protected readonly teachers$ = this.store.select(selectTeachers);
  protected readonly loading$ = this.store.select(selectLoading);
  protected readonly selectedTeacherId$ = this.store.select(selectSelectedTeacherId);

  constructor(private store: Store<TeacherSettingsState>) {}

  public updateTeacher(teacher: Teacher): void {
    this.store.dispatch(TeacherSettingsAction.updateTeacher({ teacher }));
  }

  public selectTeacher(teacherId: string): void {
    this.store.dispatch(TeacherSettingsAction.selectTeacher({ teacherId }));
  }

  public trackByTeacherId(index: number, teacher: Teacher): string {
    return teacher.id;
  }
}
