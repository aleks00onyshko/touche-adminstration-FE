import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { OnChange, SimpleChange } from 'property-watch-decorator';

@Component({
  selector: 'app-drag-and-drop-container',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './drag-and-drop-container.component.html',
  styleUrls: ['./drag-and-drop-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DragAndDropContainerComponent<T> implements AfterViewInit {
  @OnChange<T[]>(function (this: DragAndDropContainerComponent<T>, newDataSource: T[], change?: SimpleChange<T[]>) {
    if (!change?.firstChange) {
      this.draggableDataSource = this.generateDraggableDataSource(
        newDataSource,
        this.calculateListCapacity(this.listsContainer, this.item)
      );

      this.cdr.detectChanges();
    }
  })
  @Input()
  public dataSource!: T[];
  @Input() public itemTemplateRef!: TemplateRef<T>;
  @Input() public placeholder!: TemplateRef<HTMLElement>;
  @Input() public gap: number = 1;

  @ViewChild('listsContainer') listsContainer!: ElementRef<HTMLElement>;
  @ViewChild('item') item!: ElementRef<HTMLElement>;

  public draggableDataSource!: T[][];

  constructor(private cdr: ChangeDetectorRef) {}

  public ngAfterViewInit(): void {
    this.draggableDataSource = this.generateDraggableDataSource(
      this.dataSource,
      this.calculateListCapacity(this.listsContainer, this.item)
    );

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

  private calculateListCapacity(list: ElementRef<HTMLElement>, item: ElementRef<HTMLElement>): number {
    return Math.floor(list.nativeElement.offsetWidth / item.nativeElement.offsetWidth);
  }
}
