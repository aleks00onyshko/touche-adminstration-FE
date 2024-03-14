import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Store, StoreModule } from '@ngrx/store';
import { map, Observable } from 'rxjs';
import { SystembarComponent } from '../shared/components/systembar/systembar.component';
import { AuthenticationState } from './authentication/store/authentication.reducer';
import { selectUser } from './authentication/store/authentication.selectors';
import { MatSelectModule } from '@angular/material/select';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatCardModule} from '@angular/material/card'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,MatCardModule, RouterModule,MatToolbarModule,MatToolbarModule,MatIconModule,MatButtonModule, SystembarComponent, StoreModule, MatSelectModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {


  public isAuthenticated$!: Observable<boolean>;

  constructor(
    private store: Store<AuthenticationState>,
    
  ) {}
  public ngOnInit(): void {
    this.isAuthenticated$ = this.store.select(selectUser).pipe(map(user => !!user));
  }

}
