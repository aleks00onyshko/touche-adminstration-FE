import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CanActivate, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, Observable, take, tap } from 'rxjs';
import { AuthenticationState } from '../../store/authentication/authentication.reducer';
import { selectUser } from '../../store/authentication/authentication.selectors';

@Injectable({ providedIn: 'root' })
export class AuthenticationGuard implements CanActivate {
  constructor(private store: Store<AuthenticationState>, private router: Router, private snackbar: MatSnackBar) {}

  public canActivate(): Observable<boolean> {
    return this.store.select(selectUser).pipe(
      take(1),
      tap(user => {
        if (!user) {
          this.snackbar.open('You are not authenticated!');
          this.router.navigate(['authentication', 'login']);
        }
      }),
      map(user => !!user)
    );
  }
}
