import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { ReactiveComponent } from '../../../core/classes/reactive';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-duration-select',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatOptionModule, MatSelectModule, TranslateModule, ReactiveFormsModule],
  templateUrl: './duration-select.component.html',
  styleUrls: ['./duration-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DurationSelectComponent), // tslint:disable-line
      multi: true
    }
  ]
})
export class DurationSelectComponent extends ReactiveComponent implements ControlValueAccessor, OnInit {
  public readonly durationOptions: number[] = [15, 30, 45, 60, 75, 90, 105, 120];

  public durationControl = new FormControl<number>(this.durationOptions[0]);

  protected onChangeFn!: (value: number) => void;
  protected onTouchedFn!: () => void;

  constructor(private cdr: ChangeDetectorRef) {
    super();
  }

  public ngOnInit() {
    this.durationControl.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(value => {
      this.onChangeFn(value!);
    });
  }

  public writeValue(value: number) {
    this.durationControl.setValue(value, { emitEvent: false });

    this.cdr.detectChanges();
  }

  public registerOnChange(fn: any) {
    this.onChangeFn = fn;
  }

  public registerOnTouched(fn: any) {
    this.onTouchedFn = fn;
  }
}
