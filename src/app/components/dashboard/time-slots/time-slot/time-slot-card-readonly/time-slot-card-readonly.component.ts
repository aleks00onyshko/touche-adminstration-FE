import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeSlot } from 'src/app/core/model/entities/time-slot';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-time-slot-card-readonly',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './time-slot-card-readonly.component.html',
  styleUrls: ['./time-slot-card-readonly.component.scss']
})
export class TimeSlotCardReadonlyComponent {
  @Input({ required: true }) public timeSlot!: TimeSlot;

  @Output() public slotDeleted = new EventEmitter<string>();

  public deleteTimeSlot(id: string): void {
    this.slotDeleted.emit(id);
  }
}