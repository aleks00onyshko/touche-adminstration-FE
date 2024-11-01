import { Component, EventEmitter, Output, Self, ChangeDetectionStrategy, Input } from '@angular/core';
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
  @Input({ required: true }) public currentDateId!: DateId;

  @Output() public daySelected = new EventEmitter<DateId>();

  public readonly dayLabelBatches: DayLabel[][] = this.daySelectListService.splitDayLabelsIntoBatches(
    this.daySelectListService.generateDaysList()
  );

  constructor(@Self() private daySelectListService: DaySelectListService) {}
}
