import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';
import { Teacher } from 'src/app/core/model/entities/teacher';


export const TEACHERS_SETTINGS_FEATURE_KEY = 'teachers';

export const TeacherSettingsAction = createActionGroup({
  source: 'Teacher Settings',
  events: {
    'Get Teachers Failed': props<{ error: HttpErrorResponse }>(),
    'Get Teachers Success': props<{ teachers: Teacher[] }>(),
    'Get Teachers': emptyProps(),
    'Update Teacher': props<{ teacher: Teacher }>(),
    //     'Delete Payment Slot': props<{ id: string }>(),
    //     'Delete Payment Slot Success': props<{ id: string }>(),
    //     'Delete Payment Slot Failded': props<{ error: HttpErrorResponse }>(),
    //     'Open Create Payment Slot Dialog': emptyProps(),
    //     'Open Edit Payment Slot Dialog': props<{ paymentSlot: PaymentSlot }>(),
    //     'Edit Payment Slot': props<{ initialPaymentSlot: PaymentSlot; paymentSlotCardControlValue: PaymentSlotCardControlValue }>(),
    //     'Edit Payment Slot Success': props<{ paymentSlot: PaymentSlot }>(),
    //     'Edit Payment Slot Failed': props<{ error: HttpErrorResponse }>(),
    //     'Create Payment Slot': props<{ paymentSlotCardControlValue: PaymentSlotCardControlValue }>(),
    //     'Create Payment Slot Failed': props<{ error: HttpErrorResponse }>(),
    //     'Create Payment Slot Success': props<{ timeSlot: PaymentSlot }>()
    //   }
  }
});
