import { Directive, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Directive()
export abstract class ReactiveComponent implements OnDestroy {
  protected unsubscribe$: Subject<void> = new Subject();

  public ngOnDestroy(): void {
    this.unsubscribe$.next();
  }
}
