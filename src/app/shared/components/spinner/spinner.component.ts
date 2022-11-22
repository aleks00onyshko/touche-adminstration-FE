import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  template: `<mat-spinner></mat-spinner>`,
  styleUrls: ['spinner.component.scss']
})
export class SpinnerComponent {}
