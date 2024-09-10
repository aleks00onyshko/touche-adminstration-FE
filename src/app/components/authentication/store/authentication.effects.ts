import { inject, Injectable } from '@angular/core';
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
import { Actions, createEffect, ofType, OnInitEffects, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { catchError, EMPTY, from, map, of, switchMap, tap } from 'rxjs';
import { AuthenticationActions } from './authentication.action';
import { doc, Firestore, setDoc, getDoc } from '@angular/fire/firestore';
import { Teacher } from 'src/app/core/model/entities/teacher';

export const getUser$ = createEffect(
  (actions$ = inject(Actions), auth = inject(Auth)) =>
    actions$.pipe(
      ofType(AuthenticationActions.getUser),
      switchMap(() => user(auth)),
      map((user: User | null) =>
        user
          ? AuthenticationActions.authenticated({ user: user.toJSON() as User })
          : AuthenticationActions.notAuthenticated()
      ),
      catchError((error: Error) => of(AuthenticationActions.error({ error: error.message })))
    ),
  { functional: true }
);

export const registerViaEmail$ = createEffect(
  (actions$ = inject(Actions), auth = inject(Auth)) =>
    actions$.pipe(
      ofType(AuthenticationActions.emailRegister),
      switchMap(({ email, password }) => from(createUserWithEmailAndPassword(auth, email, password))),
      map(() => AuthenticationActions.getUser()),
      catchError((error: Error) => of(AuthenticationActions.error({ error: error.message })))
    ),
  { functional: true }
);

export const loginViaEmail$ = createEffect(
  (actions$ = inject(Actions), auth = inject(Auth)) =>
    actions$.pipe(
      ofType(AuthenticationActions.emailLogin),
      switchMap(({ email, password }) => from(signInWithEmailAndPassword(auth, email, password))),
      map(() => AuthenticationActions.getUser()),
      catchError((error: Error) => of(AuthenticationActions.error({ error: error.message })))
    ),
  { functional: true }
);

export const loginViaGoogle$ = createEffect(
  (actions$ = inject(Actions), auth = inject(Auth)) =>
    actions$.pipe(
      ofType(AuthenticationActions.googleLogin),
      switchMap(() => from(signInWithPopup(auth, new GoogleAuthProvider()))),
      map(() => AuthenticationActions.getUser()),
      catchError((error: Error) => of(AuthenticationActions.error({ error: error.message })))
    ),
  { functional: true }
);

export const logout$ = createEffect(
  (actions$ = inject(Actions), auth = inject(Auth)) =>
    actions$.pipe(
      ofType(AuthenticationActions.logout),
      switchMap(() => from(auth.signOut())),
      map(() => AuthenticationActions.notAuthenticated()),
      catchError((error: Error) => of(AuthenticationActions.error({ error: error.message })))
    ),
  { functional: true }
);

export const authenticated$ = createEffect(
  (actions$ = inject(Actions), router = inject(Router)) =>
    actions$.pipe(
      ofType(AuthenticationActions.authenticated),
      tap(({ user }) => {
        void router.navigate(['dashboard']);

        return AuthenticationActions.onboardTeacher({ user });
      })
    ),
  { dispatch: false, functional: true }
);

export const onboardTeacher$ = createEffect(
  (actions$ = inject(Actions), firestore = inject(Firestore)) =>
    actions$.pipe(
      ofType(AuthenticationActions.onboardTeacher),
      switchMap(async ({ user }) => {
        const teacherSnapshot = await getDoc(doc(firestore, `teachers`, user.uid));

        if (teacherSnapshot.exists()) {
          return EMPTY;
        }

        const teacher: Teacher = {
          number: '',
          description: '',
          backgroundImageUrl: '',
          id: user.uid,
          displayName: user.displayName ?? user.email!,
          email: user.email,
          uid: user.uid
        };

        return from(setDoc(doc(firestore, `teachers`, user.uid), teacher)).pipe(map(() => EMPTY));
      })
    ),
  { dispatch: false, functional: true }
);

export const notAuthenticated$ = createEffect(
  (actions$ = inject(Actions), router = inject(Router)) =>
    actions$.pipe(
      ofType(AuthenticationActions.notAuthenticated),
      tap(() => void router.navigate(['authentication', 'login']))
    ),
  { dispatch: false, functional: true }
);

export const error$ = createEffect(
  (actions$ = inject(Actions), snackbar = inject(MatSnackBar)) =>
    actions$.pipe(
      ofType(AuthenticationActions.error),
      tap(({ error }) => snackbar.open(error))
    ),
  { dispatch: false, functional: true }
);

export const init$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(ROOT_EFFECTS_INIT),
      map(action => AuthenticationActions.getUser())
    ),
  { functional: true }
);
