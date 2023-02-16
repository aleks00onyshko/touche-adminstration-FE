import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnChanges,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-drag-and-drop-container',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './drag-and-drop-container.component.html',
  styleUrls: ['./drag-and-drop-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DragAndDropContainerComponent<T> implements OnChanges {
  @Input()
  public dataSource!: T[];
  @Input() public itemTemplateRef!: TemplateRef<T>;
  @Input() public gap: number = 1;

  @ViewChild('listsContainer') listsContainer!: ElementRef<HTMLElement>;

  public draggableDataSource!: T[][];

  constructor(private cdr: ChangeDetectorRef) {}

  public ngOnChanges(): void {
    this.draggableDataSource = this.generateDraggableDataSource(this.dataSource, 5);

    this.cdr.detectChanges();
  }

  private generateDraggableDataSource<T>(dataSource: T[], listCapacity: number): T[][] {
    const matrix: T[][] = [];

    for (let i = 0, k = -1; i < dataSource.length; i++) {
      if (i % listCapacity === 0) {
        k++;
        matrix[k] = [];
      }
      matrix[k].push(dataSource[i]);
    }

    return matrix;
  }
}
