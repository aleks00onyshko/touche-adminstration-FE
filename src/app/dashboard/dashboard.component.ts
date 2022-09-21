import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth } from '@angular/fire/auth';
import { AuthenticationState } from '../store/authentication/authentication.reducer';
import { Store } from '@ngrx/store';
import { AuthenticationActions } from '../store/authentication/authentication.action';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  constructor(private store: Store<AuthenticationState>) {}

  ngOnInit(): void {}

  logout() {
    this.store.dispatch(AuthenticationActions.logout());
  }
}
