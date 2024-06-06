

import {Component, Input, OnInit} from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';
import { ControlValueAccessor } from '@angular/forms';
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
  imports: [MatExpansionModule, CommonModule,MatIconModule],
})
export class TeacherSettingsComponent implements OnInit, ControlValueAccessor {

    @Input({ required: true }) public teachers!: Teacher[];


    protected readonly teachers$ = this.store.select(selectTeachers);
    protected readonly loading$ = this.store.select(selectLoading);
  
    constructor(private store: Store<TeacherSettingsState>) {}
    writeValue(obj: any): void {
        throw new Error('Method not implemented.');
    }
    registerOnChange(fn: any): void {
        throw new Error('Method not implemented.');
    }
    registerOnTouched(fn: any): void {
        throw new Error('Method not implemented.');
    }
    setDisabledState?(isDisabled: boolean): void {
        throw new Error('Method not implemented.');
    }
  
    ngOnInit(): void {
      console.log(this.teachers);
    }

 
  }