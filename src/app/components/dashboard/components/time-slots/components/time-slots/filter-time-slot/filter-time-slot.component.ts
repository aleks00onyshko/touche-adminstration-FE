import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
  forwardRef
} from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import {
  FormControl,
  FormGroup,
  FormsModule,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule
} from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Teacher } from 'src/app/core/model/entities/teacher';
import { InteractiveAvatarsComponent } from '../../../../../../../shared/components/interective-avatars/interactive-avatars.component';
import { TranslateModule } from '@ngx-translate/core';

import { ConvertUsersToAvatarConfigsPipe } from '../../../../../../../shared/components/avatar/pipes/convert-users-to-avatar-configs.pipe';
import { ReactiveComponent } from 'src/app/core/classes/reactive';
import { takeUntil } from 'rxjs';
import { DurationSelectComponent } from '../../../../../../../shared/components/duration-select/duration-select.component';
import { AvatarMultipleSelectDropdown } from 'src/app/shared/components/avatar-multiple-select-dropdown/avatar-multiple-select-dropdown';
import { Avatar } from '../../../../../../../shared/components/avatar/models/avatar';

// TODO: naming here
export interface FilterTimeSlotCardControlValue {
  duration: number | null;
  booked: boolean | null;
  teachers: Avatar[] | null;
}
export type FilterTimeSlotCardControlStructure = {
  booked: FormControl<boolean | null>;
  duration: FormControl<number | null>;
  teachers: FormControl<Avatar[] | null>;
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
    InteractiveAvatarsComponent,
    AvatarMultipleSelectDropdown,
    ConvertUsersToAvatarConfigsPipe,
    DurationSelectComponent
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FilterTimeSlotsComponent), // tslint:disable-line
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => FilterTimeSlotsComponent), // tslint:disable-line
      multi: true
    }
  ],
  encapsulation: ViewEncapsulation.None
})
export class FilterTimeSlotsComponent extends ReactiveComponent implements OnInit {
  @Input({ required: true }) public teachers!: Teacher[];
  @Output() public filterChange = new EventEmitter<FilterTimeSlotCardControlValue>();
  @Output() public resetFilter = new EventEmitter<void>();

  public readonly filterTimeSlotForm = new FormGroup<FilterTimeSlotCardControlStructure>({
    booked: new FormControl(null),
    duration: new FormControl(null),
    teachers: new FormControl(null)
  });
  public readonly controls: FilterTimeSlotCardControlStructure = {
    booked: this.filterTimeSlotForm.controls.booked,
    duration: this.filterTimeSlotForm.controls.duration,
    teachers: this.filterTimeSlotForm.controls.teachers
  };

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.filterTimeSlotForm.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(value => {
      const filter: FilterTimeSlotCardControlValue = {
        booked: value.booked ?? null,
        duration: value.duration ?? null,
        teachers: value.teachers ?? null
      };
      this.filterChange.emit(filter);
    });
  }

  protected reset(): void {
    this.filterTimeSlotForm.reset();
    this.resetFilter.emit();
  }
}
