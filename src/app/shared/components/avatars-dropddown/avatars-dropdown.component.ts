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

@Component({
  selector: 'app-avatars-dropdown',
  standalone: true,
  imports: [CommonModule, AvatarComponent, MatSelectModule, ReactiveFormsModule],
  templateUrl: './avatars-dropdown.component.html',
  styleUrls: ['./avatars-dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AvatarsDropdownComponent), // tslint:disable-line
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AvatarsDropdownComponent), // tslint:disable-line
      multi: true
    }
  ],
  encapsulation: ViewEncapsulation.None
})
export class AvatarsDropdownComponent extends ReactiveComponent implements OnInit, ControlValueAccessor, Validator {
  @Input({ required: true }) public avatarConfigurations!: AvatarConfiguration[];
  @Input({ required: true }) public label!: string;

  public control = new FormControl<AvatarConfiguration | null>(null, [Validators.required]);
  public onTouchFn!: () => void;
  public onChangeFn!: (avatarConfiguration: AvatarConfiguration) => void;

  public ngOnInit(): void {
    this.control.valueChanges
      .pipe(takeUntil(this.unsubscribe$), filter(Boolean))
      .subscribe(avatarConfig => this.onChangeFn(avatarConfig));
  }

  public registerOnChange(fn: (avatarConfiguration: AvatarConfiguration) => void): void {
    this.onChangeFn = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouchFn = fn;
  }

  public writeValue(avatarConfiguration: AvatarConfiguration): void {
    this.control.setValue(avatarConfiguration, { emitEvent: false });
  }

  public validate(): ValidationErrors | null {
    return Validators.required(this.control);
  }

  protected compareWith(a1: AvatarConfiguration, a2: AvatarConfiguration): boolean {
    return a1?.id === a2?.id;
  }
}
