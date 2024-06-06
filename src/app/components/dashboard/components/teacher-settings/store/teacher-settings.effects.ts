import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, of, Observable } from 'rxjs';

import { TeacherSettingsAction } from './teacher-settings.actions';
import { Firestore, collection, collectionData, deleteDoc, doc, setDoc } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import { TeacherSettingsState } from './teacher-settings.reducer';
import { Teacher } from 'src/app/core/model/entities/teacher';

@Injectable()
export class TeacherSettingsEffects {
  public getTeachers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TeacherSettingsAction.getTeachers),
      switchMap(() =>
        (collectionData(collection(this.firestore, `teachers`)) as Observable<Teacher[]>).pipe(
          map(teachers => TeacherSettingsAction.getTeachersSuccess({ teachers })),
          catchError((error: HttpErrorResponse) => of(TeacherSettingsAction.getTeachersFailed({ error })))
        )
      )
    )
  );
  constructor(private actions$: Actions, private store: Store<TeacherSettingsState>, private firestore: Firestore) {}
}
