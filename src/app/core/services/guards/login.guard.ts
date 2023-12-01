import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, Observable, tap } from 'rxjs';
import { AuthenticationState } from 'src/app/components/authentication/store/authentication.reducer';
import { selectUser } from 'src/app/components/authentication/store/authentication.selectors';

@Injectable({ providedIn: 'root' })
export class LoginGuard implements CanActivate {
  constructor(private store: Store<AuthenticationState>, private router: Router) {}

  public canActivate(): Observable<boolean> {
    return this.store.select(selectUser).pipe(
      tap(user => {
        if (user) void this.router.navigate(['dashboard']);
      }),
      map(user => !user)
    );
  }
}
