import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { DateId, TimeSlot } from 'src/app/core/model/entities/time-slot';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import {
  selectTeacherById,
  selectUserById
} from 'src/app/components/dashboard/components/time-slots/store/time-slots.selectors';
import { TimeSlotsState } from 'src/app/components/dashboard/components/time-slots/store/time-slots.reducer';

@Component({
  selector: 'app-calendar-component',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    TranslateModule

    // Ці імпорти можуть бути непотрібні, оскільки компонент не повинен включати інші компоненти в імпорти
  ]
})
export class CalendarComponent {
  @Output() public daySelected = new EventEmitter<DateId>();
  @Output() public slotDeleted = new EventEmitter<string>();

  @Input() public timeSlots: TimeSlot[] = [];

  public readonly teacherById$ = (id: string) => this.store.select(selectTeacherById(id));
  public readonly userById$ = (id: string) => this.store.select(selectUserById(id));

  hours: string[] = [
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00',
    '20:00'
  ];

  constructor(private store: Store<TimeSlotsState>) {}
  shouldDisplayEventBlock(timeSlots: TimeSlot[], hour: string): boolean {
    return timeSlots.some(timeSlot => this.isTimeSlotInHour(timeSlot, hour));
  }
  isTimeSlotInHour(timeSlot: TimeSlot, hour: string): boolean {
    const startTime = this.formatTime(timeSlot.startTime).split(':')[0];
    return startTime === hour.split(':')[0];
  }

  formatTime(time: number[]): string {
    return `${('0' + time[0]).slice(-2)}:${('0' + time[1]).slice(-2)}`;
  }

}
