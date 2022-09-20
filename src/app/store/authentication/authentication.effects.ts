import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, User, user } from '@angular/fire/auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, from, map, of, switchMap, tap } from 'rxjs';
import { AuthenticationActions } from './authentication.action';

@Injectable()
export class AuthenticationEffects {
  public getUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthenticationActions.getUser),
      switchMap(() => user(this.auth)),
      map((user: User | null) => (user ? AuthenticationActions.authenticated({ user: user.toJSON() as User }) : AuthenticationActions.notAuthenticated())),
      catchError((error: Error) => of(AuthenticationActions.error({ error: error.message })))
    )
  );

  public registerViaEmail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthenticationActions.emailRegister),
      switchMap(({ email, password }) => from(createUserWithEmailAndPassword(this.auth, email, password))),
      map(() => AuthenticationActions.getUser()),
      catchError((error: Error) => of(AuthenticationActions.error({ error: error.message })))
    )
  );

  public loginViaEmail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthenticationActions.emailLogin),
      switchMap(({ email, password }) => from(signInWithEmailAndPassword(this.auth, email, password))),
      map(() => AuthenticationActions.getUser()),
      catchError((error: Error) => of(AuthenticationActions.error({ error: error.message })))
    )
  );

  public loginViaGoogle$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthenticationActions.googleLogin),
      switchMap(() => from(signInWithPopup(this.auth, new GoogleAuthProvider()))),
      map(() => AuthenticationActions.getUser()),
      catchError((error: Error) => of(AuthenticationActions.error({ error: error.message })))
    )
  );

  public logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthenticationActions.logout),
      switchMap(() => from(this.auth.signOut())),
      map(() => AuthenticationActions.notAuthenticated()),
      catchError((error: Error) => of(AuthenticationActions.error({ error: error.message })))
    )
  );

  public authenticated$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthenticationActions.authenticated),
        tap(() => this.router.navigate(['dashboard']))
      ),
    { dispatch: false }
  );

  public notAuthenticated$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthenticationActions.notAuthenticated),
        tap(() => this.router.navigate(['authentication', 'login']))
      ),
    { dispatch: false }
  );

  public error$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthenticationActions.error),
        tap(({ error }) => this.snackbar.open(error))
      ),
    { dispatch: false }
  );

  constructor(private actions$: Actions, private auth: Auth, private router: Router, private snackbar: MatSnackBar) {}
}
