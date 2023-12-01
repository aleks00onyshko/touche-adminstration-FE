import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Store, StoreModule } from '@ngrx/store';
import { map, Observable } from 'rxjs';
import { SystembarComponent } from '../shared/components/systembar/systembar.component';
import { AuthenticationState } from './authentication/store/authentication.reducer';
import { selectUser } from './authentication/store/authentication.selectors';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, SystembarComponent, StoreModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  public isAuthenticated$!: Observable<boolean>;

  constructor(private store: Store<AuthenticationState>) {}

  public ngOnInit(): void {
    this.isAuthenticated$ = this.store.select(selectUser).pipe(map(user => !!user));
  }
}
