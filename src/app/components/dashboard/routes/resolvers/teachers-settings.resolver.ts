import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, filter, take } from 'rxjs';
import { PaymentSlotAction } from '../../components/payment-slots/store/payment-slots.actions';
import { Teacher } from 'src/app/core/model/entities/teacher';
import { TeacherSettingsState } from '../../components/teacher-settings/store/teacher-settings.reducer';
import { selectTeachers } from '../../components/teacher-settings/store/teacher-settings.selector';
import { TeacherSettingsAction } from '../../components/teacher-settings/store/teacher-settings.actions';

export const teachersSettingsResolver: ResolveFn<Observable<Teacher[] | null>> = () => {
    const store = inject(Store<TeacherSettingsState>);
    store.dispatch(TeacherSettingsAction.getTeachers());

    return store.select(selectTeachers).pipe(
        filter(teachers => !!teachers),
        take(1)
    );
};
