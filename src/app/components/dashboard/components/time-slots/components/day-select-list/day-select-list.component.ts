import {
  Component,
  EventEmitter,
  Output,
  Self,
  WritableSignal,
  signal,
  effect,
  ChangeDetectionStrategy,
  Input
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { DayLabel } from './day-label';
import { DaySelectListService } from './day-select-list.service';
import { DateId } from 'src/app/core/model/entities/time-slot';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-day-select-list',
  standalone: true,
  imports: [CommonModule, ScrollingModule, TranslateModule],
  templateUrl: './day-select-list.component.html',
  styleUrls: ['./day-select-list.component.scss'],
  providers: [DaySelectListService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DaySelectListComponent {
  @Input() public dayLabelBatches: DayLabel[][] = []; // Вхідні дані для dayLabelBatches
  @Input() public selectedDay: DayLabel | null | undefined = null; // Вхідні дані для selectedDay
  @Output() public daySelected = new EventEmitter<DateId>();

  constructor(private daySelectListService: DaySelectListService) {}

  public onDaySelect(dayLabel: DayLabel): void {
    this.selectedDay = dayLabel;
    this.daySelected.emit(this.selectedDay.id);
  }
}
