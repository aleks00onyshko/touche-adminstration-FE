import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { ControlValueAccessor, FormControl, FormGroup } from '@angular/forms';
import { AvatarConfiguration } from 'src/app/shared/components/avatar/avatar.config';
import { Teacher } from 'src/app/core/model/entities/teacher';
import { TeacherSettingsState } from '../store/teacher-settings.reducer';
import { Store } from '@ngrx/store';
import { selectTeachers, selectLoading } from '../store/teacher-settings.selector';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
/**
 * @title Basic expansion panel
 */
@Component({
  selector: 'app-teacher-settings',
  templateUrl: './teacher-settings.component.html',
  styleUrls: ['./teacher-settings.component.scss'],
  standalone: true,
  imports: [MatExpansionModule, CommonModule, MatIconModule]
})
export class TeacherSettingsComponent implements OnInit {
  @Input() description!: string;
  @Input() number!: string;
  @Output() save = new EventEmitter<{ description: string, number: string }>();

  form: FormGroup = new FormGroup({
    description: new FormControl(''),
    number: new FormControl('')
  });

  isEditingDescription = false;
  isEditingNumber = false;

  ngOnInit(): void {
    this.form.setValue({
      description: this.description,
      number: this.number
    });
  }

  toggleEditDescription() {
    this.isEditingDescription = !this.isEditingDescription;
  }

  toggleEditNumber() {
    this.isEditingNumber = !this.isEditingNumber;
  }


}