import { ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { Table } from '../../../core/model/entities/table';

@Component({
  selector: 'app-table-multiple-select-dropdown',
  imports: [CommonModule, MatSelectModule, ReactiveFormsModule],
  templateUrl: './table-multiple-select-dropdown.html',
  styleUrls: ['./table-multiple-select-dropdown.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TableMultipleSelectDropdown), // tslint:disable-line
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => TableMultipleSelectDropdown), // tslint:disable-line
      multi: true
    }
  ],
  encapsulation: ViewEncapsulation.None
})
export class TableMultipleSelectDropdown extends ReactiveComponent implements OnInit, ControlValueAccessor, Validator {
  @Input({ required: true }) public tables!: Table[];
  @Input({ required: true }) public label!: string;
  @Input() public bookedTableIds: string[] = [];

  public control = new FormControl<Table[] | null>(null, [Validators.required]);
  public onTouchFn!: () => void;
  public onChangeFn!: (tables: Table[]) => void;

  public ngOnInit(): void {
    this.control.valueChanges.pipe(takeUntil(this.unsubscribe$), filter(Boolean)).subscribe(tables => {
      this.onChangeFn(tables);
    });
  }

  public registerOnChange(fn: (table: Table[]) => void): void {
    this.onChangeFn = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouchFn = fn;
  }

  public writeValue(tables: Table[]): void {
    this.control.setValue(tables, { emitEvent: false });
  }

  public validate(): ValidationErrors | null {
    return Validators.required(this.control);
  }

  protected compareWith(a1: Table, a2: Table): boolean {
    return a1?.id === a2?.id;
  }
}
