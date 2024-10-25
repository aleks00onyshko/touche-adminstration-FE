import { ChangeDetectorRef, Component, OnInit, forwardRef } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { ReactiveComponent } from 'src/app/core/classes/reactive';
import { takeUntil } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-leson-name',
  standalone: true,
  imports: [MatInputModule, MatFormFieldModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './leson-name.component.html',
  styleUrls: ['./leson-name.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LesonNameComponent),
      multi: true
    }
  ]
})
export class LesonNameComponent extends ReactiveComponent implements ControlValueAccessor, OnInit {
  public lessonControl = new FormControl<string>('piano');
  protected onChangeFn: (value: string) => void = () => {};
  protected onTouchFn: () => void = () => {};

  constructor(private cdr: ChangeDetectorRef) {
    super();
  }

  ngOnInit(): void {
    this.lessonControl.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(val => {
      this.onChangeFn(val ?? '');
    });
  }

  writeValue(val: string): void {
    this.lessonControl.setValue(val, { emitEvent: false });
    this.cdr.detectChanges();
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchFn = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.lessonControl.disable({ emitEvent: false }) : this.lessonControl.enable({ emitEvent: false });
    this.cdr.detectChanges();
  }
}
