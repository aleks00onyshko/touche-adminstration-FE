import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { EditableInputComponent } from '../../../../shared/components/editable-input/editable-input.component';

@Component({
  selector: 'app-category-filter-name',
  standalone: true,
  imports: [CommonModule, EditableInputComponent, ReactiveFormsModule],
  templateUrl: './category-filter-name.component.html',
  styleUrls: ['./category-filter-name.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryFilterNameComponent implements OnChanges {
  @Input() public name!: string;
  @Input() public id!: string;
  @Input() public autofocus: boolean = false;
  @Input() public selected: boolean = false;

  @Output() private nameChanged = new EventEmitter<{ name: string; id: string }>();

  public nameControl = new FormControl(this.name, [Validators.required]);

  public ngOnChanges(): void {
    this.nameControl.setValue(this.name);
  }

  public changeName(): void {
    if (this.nameControl.valid && this.name !== this.nameControl.value) {
      this.nameChanged.emit({ name: this.nameControl.value as string, id: this.id });
    }

    this.nameControl.setValue(this.name);
  }
}
