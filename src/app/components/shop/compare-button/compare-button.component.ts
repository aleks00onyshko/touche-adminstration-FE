import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-compare-button',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './compare-button.component.html',
  styleUrls: ['./compare-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompareButtonComponent {
  @Input() compareMode!: boolean;

  @Output() compareModeToggled = new EventEmitter<boolean>();

  public togglecompareMode(): void {
    this.compareModeToggled.emit(!this.compareMode);
  }
}
