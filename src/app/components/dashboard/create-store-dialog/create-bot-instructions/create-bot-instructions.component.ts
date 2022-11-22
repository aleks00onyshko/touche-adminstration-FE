import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';

@Component({
  selector: 'app-create-bot-instructions',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './create-bot-instructions.component.html',
  styleUrls: ['./create-bot-instructions.component.scss']
})
export class CreateBotInstructionsComponent {}
