import { ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarConfiguration } from '../avatar/avatar.config';
import { AvatarComponent } from '../avatar/avatar.component';
import { MatSelectModule } from '@angular/material/select';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ValidationErrors,
  Validator,
  Validators
} from '@angular/forms';
import { ReactiveComponent } from 'src/app/core/classes/reactive';
import { filter, takeUntil } from 'rxjs';
import { Teacher } from 'src/app/core/model/entities/teacher';
import { ConvertUsersToAvatarConfigsPipe } from '../avatar/convert-users-to-avatar-configs.pipe';

@Component({
  selector: 'app-interective-avatars',
  standalone: true,
  imports: [CommonModule, AvatarComponent, MatSelectModule, ReactiveFormsModule, ConvertUsersToAvatarConfigsPipe],
  templateUrl: './interective-avatars.component.html',
  styleUrls: ['./interective-avatars.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InterectiveAvatarsComponent), // tslint:disable-line
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => InterectiveAvatarsComponent), // tslint:disable-line
      multi: true
    },
    ConvertUsersToAvatarConfigsPipe // Додаємо тут
  ],
  encapsulation: ViewEncapsulation.None
})
export class InterectiveAvatarsComponent extends ReactiveComponent implements OnInit, ControlValueAccessor, Validator {
  @Input({ required: true }) public teachers: Teacher[] = [];
  @Input({ required: true }) public label!: string;

  public showAllTeachers = false;
  public avatarConfigurations: AvatarConfiguration[] = [];
  public showAll = false;

  public control = new FormControl<AvatarConfiguration[] | null>(null, [Validators.required]);
  public onTouchFn!: () => void;
  public onChangeFn!: (avatarConfigurations: AvatarConfiguration[]) => void;

  constructor(private convertUsersToAvatarConfigsPipe: ConvertUsersToAvatarConfigsPipe) {
    super();
  }

  public ngOnInit(): void {
    this.avatarConfigurations = this.convertUsersToAvatarConfigsPipe.transform(this.teachers);
    this.control.valueChanges
      .pipe(takeUntil(this.unsubscribe$), filter(Boolean))
      .subscribe(avatarConfigs => this.onChangeFn(avatarConfigs));
  }

  public registerOnChange(fn: (avatarConfiguration: AvatarConfiguration[]) => void): void {
    this.onChangeFn = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouchFn = fn;
  }

  public writeValue(avatarConfigurations: AvatarConfiguration[]): void {
    this.control.setValue(avatarConfigurations, { emitEvent: false });
  }

  public validate(): ValidationErrors | null {
    return Validators.required(this.control);
  }

  protected compareWith(a1: AvatarConfiguration, a2: AvatarConfiguration): boolean {
    return a1?.id === a2?.id;
  }

  public toggleShowAll(event: Event , showAll: boolean): void {
    event.stopPropagation();
    this.showAllTeachers = !this.showAllTeachers;
  }
 
}
