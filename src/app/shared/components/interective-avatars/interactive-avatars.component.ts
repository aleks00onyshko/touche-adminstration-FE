import { ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarComponent } from '../avatar/components/avatar/avatar.component';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
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
import { Avatar } from '../avatar/models/avatar';
import { ConvertUsersToAvatarsPipe } from '../avatar/pipes/convert-users-to-avatar-configs.pipe';

@Component({
  selector: 'app-interective-avatars',
  standalone: true,
  imports: [
    CommonModule,
    AvatarComponent,
    MatSelectModule,
    ReactiveFormsModule,
    ConvertUsersToAvatarsPipe,
    MatIconModule
  ],
  templateUrl: './interactive-avatars.component.html',
  styleUrls: ['./interactive-avatars.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InteractiveAvatarsComponent), // tslint:disable-line
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => InteractiveAvatarsComponent), // tslint:disable-line
      multi: true
    }
  ],
  encapsulation: ViewEncapsulation.None
})
export class InteractiveAvatarsComponent extends ReactiveComponent implements OnInit, ControlValueAccessor, Validator {
  @Input({ required: true }) public teachers: Teacher[] = [];
  @Input({ required: true }) public label!: string;

  public showAllTeachers = false;

  public control = new FormControl<Avatar[] | null>(null, [Validators.required]);
  public onTouchFn!: () => void;
  public onChangeFn!: (avatarConfigurations: Avatar[]) => void;

  constructor() {
    super();
  }

  public ngOnInit(): void {
    this.control.valueChanges
      .pipe(takeUntil(this.unsubscribe$), filter(Boolean))
      .subscribe(avatarConfigs => this.onChangeFn(avatarConfigs));
  }

  public registerOnChange(fn: (avatars: Avatar[]) => void): void {
    this.onChangeFn = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouchFn = fn;
  }

  public writeValue(avatars: Avatar[]): void {
    this.control.setValue(avatars, { emitEvent: false });
  }

  public validate(): ValidationErrors | null {
    return Validators.required(this.control);
  }

  protected compareWith(a1: Avatar, a2: Avatar): boolean {
    return a1?.configuration?.id === a2?.configuration?.id;
  }

  public toggleShowAll(event: Event): void {
    event.stopPropagation();
    this.showAllTeachers = !this.showAllTeachers;
  }
}
