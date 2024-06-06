import { ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { selectLoading, selectTeachers } from './store/teacher-settings.selector';
import { TeacherSettingsState } from './store/teacher-settings.reducer';
import { TeacherSettingsComponent } from "./teacher-settings/teacher-settings.component";

@Component({
    selector: 'app-teachers-settings',
    templateUrl: './teachers-settings.component.html',
    styleUrls: ['./teachers-settings.component.scss'],
    standalone: true,
    imports: [CommonModule, MatExpansionModule, MatListModule, ReactiveFormsModule, TeacherSettingsComponent]
})
export class TeachersSettingsComponent {
  protected readonly teachers$ = this.store.select(selectTeachers);
  protected readonly loading$ = this.store.select(selectLoading);

  constructor(private store: Store<TeacherSettingsState>) {}
}
