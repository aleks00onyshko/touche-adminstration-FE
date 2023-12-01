import { Component, EventEmitter, Output, Self, WritableSignal, signal, effect } from '@angular/core';
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
  providers: [DaySelectListService]
})
export class DaySelectListComponent {
  @Output() public daySelected = new EventEmitter<DateId>();

  public readonly dayLabelBatches: WritableSignal<DayLabel[][]> = signal(
    this.daySelectListService.splitDayLabelsIntoBatches(this.daySelectListService.generateDaysList())
  );

  public readonly selectedDay: WritableSignal<undefined | null | DayLabel> = signal(
    this.dayLabelBatches()
      .flat()
      .find(label => label.isToday())
  );

  constructor(@Self() private daySelectListService: DaySelectListService) {
    effect(
      () => {
        this.daySelected.emit(this.selectedDay()!.id);
      },
      { allowSignalWrites: true }
    );
  }
}
