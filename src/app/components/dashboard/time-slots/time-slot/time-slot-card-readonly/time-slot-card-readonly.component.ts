import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeSlot } from 'src/app/core/model/entities/time-slot';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-time-slot-card-readonly',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './time-slot-card-readonly.component.html',
  styleUrls: ['./time-slot-card-readonly.component.scss']
})
export class TimeSlotCardReadonlyComponent {
  @Input() public timeSlot!: TimeSlot;
}
