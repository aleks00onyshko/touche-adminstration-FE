import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, of, from, Observable } from 'rxjs';
import { Firestore, collection, collectionData, doc, setDoc } from '@angular/fire/firestore';
import { HttpErrorResponse } from '@angular/common/http';

import { TeacherSettingsAction } from './teacher-settings.actions';
import { Teacher } from 'src/app/core/model/entities/teacher';

export const getTeachers$ = createEffect(
  (actions$ = inject(Actions), firestore = inject(Firestore)) =>
    actions$.pipe(
      ofType(TeacherSettingsAction.getTeachers),
      switchMap(() =>
        (collectionData(collection(firestore, `teachers`)) as Observable<Teacher[]>).pipe(
          map(teachers => TeacherSettingsAction.getTeachersSuccess({ teachers })),
          catchError((error: HttpErrorResponse) => of(TeacherSettingsAction.getTeachersFailed({ error })))
        )
      )
    ),
  { functional: true }
);

export const updateTeacher$ = createEffect(
  (actions$ = inject(Actions), firestore = inject(Firestore)) =>
    actions$.pipe(
      ofType(TeacherSettingsAction.updateTeacher),
      switchMap(({ teacher }) => {
        const teacherDocRef = doc(firestore, `teachers/${teacher.id}`);

        return from(setDoc(teacherDocRef, teacher)).pipe(
          map(() => TeacherSettingsAction.updateTeacherSuccess({ teacher })),
          catchError((error: HttpErrorResponse) => of(TeacherSettingsAction.updateTeacherFailed({ error })))
        );
      })
    ),
  { functional: true }
);
