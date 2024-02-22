import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  User,
  user
} from '@angular/fire/auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { catchError, EMPTY, from, map, of, switchMap, tap } from 'rxjs';
import { AuthenticationActions } from './authentication.action';
import { doc, Firestore, setDoc } from '@angular/fire/firestore';
import { Teacher } from 'src/app/core/model/entities/teacher';

@Injectable()
export class AuthenticationEffects implements OnInitEffects {
  public getUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthenticationActions.getUser),
      switchMap(() => user(this.auth)),
      map((user: User | null) =>
        user
          ? AuthenticationActions.authenticated({ user: user.toJSON() as User })
          : AuthenticationActions.notAuthenticated()
      ),
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

  public authenticated$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthenticationActions.authenticated),
      map(({ user }) => {
        this.router.navigate(['dashboard']);

        return AuthenticationActions.onboardTeacher({ user });
      })
    )
  );

  public readonly onboardTeacher$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthenticationActions.onboardTeacher),
        switchMap(({ user }) => {
          const teacher: Teacher = {
            id: user.uid,
            displayName: user.displayName ?? user.email,
            email: user.email,
            uid: user.uid
          };

          return from(setDoc(doc(this.firestore, `teachers`, user.uid), teacher)).pipe(map(() => EMPTY));
        })
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

  constructor(
    private actions$: Actions,
    private auth: Auth,
    private router: Router,
    private snackbar: MatSnackBar,
    private firestore: Firestore
  ) {}

  public ngrxOnInitEffects(): Action {
    return AuthenticationActions.getUser();
  }
}
