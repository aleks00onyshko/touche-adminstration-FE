import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation
} from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TranslateModule } from '@ngx-translate/core';

import { ReactiveComponent } from 'src/app/core/classes/reactive';
import { takeUntil } from 'rxjs';
import { Table } from '../../../../../../../core/model/entities/table';
import { TableMultipleSelectDropdown } from '../../../../../../../shared/components/table-multiple-select-dropdown/table-multiple-select-dropdown';

export interface FilterTimeSlotCardControlValue {
  booked: boolean | null;
  tables: Table[] | null;
}
export type FilterTimeSlotCardControlStructure = {
  booked: FormControl<boolean | null>;
  tables: FormControl<Table[] | null>;
};
@Component({
  selector: 'app-filter-time-slot',
  standalone: true,
  templateUrl: './filter-time-slot.component.html',
  styleUrls: ['./filter-time-slot.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatMenuModule,
    MatButtonModule,
    ReactiveFormsModule,
    TranslateModule,
    MatProgressSpinnerModule,
    MatIconModule,
    FormsModule,
    MatCheckboxModule,
    TableMultipleSelectDropdown
  ],
  encapsulation: ViewEncapsulation.None
})
export class FilterTimeSlotsComponent extends ReactiveComponent implements OnInit {
  @Input({ required: true }) public tables!: Table[];

  @Output() public filterChange = new EventEmitter<FilterTimeSlotCardControlValue>();
  @Output() public resetFilter = new EventEmitter<void>();

  public readonly filterTimeSlotForm = new FormGroup<FilterTimeSlotCardControlStructure>({
    booked: new FormControl(null),
    tables: new FormControl(null)
  });
  public readonly controls: FilterTimeSlotCardControlStructure = {
    booked: this.filterTimeSlotForm.controls.booked,
    tables: this.filterTimeSlotForm.controls.tables
  };

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.filterTimeSlotForm.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(value => {
      const filter: FilterTimeSlotCardControlValue = {
        booked: value.booked ?? null,
        tables: value.tables ?? null
      };

      this.filterChange.emit(filter);
    });
  }

  protected reset(): void {
    this.filterTimeSlotForm.reset();
    this.resetFilter.emit();
  }
}
