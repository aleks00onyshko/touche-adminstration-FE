import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeSlot } from 'src/app/core/model/entities/time-slot';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

import { Table } from '../../../../../../../core/model/entities/table';

@Component({
  selector: 'app-time-slot-card-readonly',
  standalone: true,
  templateUrl: './time-slot-card-readonly.component.html',
  styleUrls: ['./time-slot-card-readonly.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, TranslateModule],
  providers: []
})
export class TimeSlotCardReadonlyComponent {
  @Input({ required: true }) public timeSlot!: TimeSlot;
  @Input({ required: true }) public tables!: Table[];

  @Output() public slotDeleted = new EventEmitter<string>();

  public deleteTimeSlot(id: string): void {
    this.slotDeleted.emit(id);
  }

  public getTablesAssignedToSlot(): Table[] {
    return this.tables.filter(table => this.timeSlot.tableIds.includes(table.id));
  }
}
