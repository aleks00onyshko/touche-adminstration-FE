import { Component, Input, WritableSignal, forwardRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';
import { ReactiveFormsModule, FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { Concat } from 'src/app/core/utility/concat';

@Component({
  selector: 'app-time-picker',
  standalone: true,
  imports: [
    CommonModule,
    NgxMatTimepickerModule,
    MatInputModule,
    MatButtonModule,
    NgxMatMomentModule,
    MatCardModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TimePickerComponent), // tslint:disable-line
      multi: true
    }
  ]
})
export class TimePickerComponent implements ControlValueAccessor {
  @Input() public label: string | undefined;

  public timeKeeperValueSignal: WritableSignal<[number, number] | null> = signal(null);
  public timeKeeperDisabledSignal: WritableSignal<boolean> = signal(false);

  public onChangeFn!: (value: [number, number]) => void;
  public onTouchFn!: () => void;

  public writeValue(value: [number, number] | null): void {
    if (value) {
      this.timeKeeperValueSignal.set(value);
    }
  }

  public registerOnChange(fn: (value: [number, number]) => void): void {
    this.onChangeFn = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouchFn = fn;
  }

  public setDisabledState(disabled: boolean): void {
    this.timeKeeperDisabledSignal.set(disabled);
  }

  // comes in a '12:13' format
  public timeChanged(value: Concat<[string, string]>): void {
    this.onChangeFn((value.split(':') as [string, string]).map(half => Number(half)) as [number, number]);
  }
}
