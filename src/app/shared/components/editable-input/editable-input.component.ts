import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-editable-input',
  standalone: true,
  imports: [CommonModule, MatInputModule, MatFormFieldModule, ReactiveFormsModule],
  templateUrl: './editable-input.component.html',
  styleUrls: ['./editable-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditableInputComponent implements AfterViewInit {
  @Input() control!: FormControl;
  @Input() placeholder: string = '';
  @Input() align: 'left' | 'center' | 'right' = 'left';
  @Input() autofocus: boolean = false;

  @ViewChild('input') input!: ElementRef;

  @Output() onFocusLost = new EventEmitter<void>();
  @Output() onEnterPressed = new EventEmitter<void>();

  public ngAfterViewInit(): void {
    if (this.autofocus) {
      setTimeout(() => this.input.nativeElement.focus());
    }
  }
}
