import { HttpErrorResponse } from '@angular/common/http';
import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Teacher } from 'src/app/core/model/entities/teacher';
import { DateId, TimeSlot } from 'src/app/core/model/entities/time-slot';
import { TimeSlotCardControlValue } from '../components/time-slot/time-slot-card.component';
import { Location } from 'src/app/core/model/entities/location';
import { User } from 'src/app/core/model/entities/user';

export const TIMESLOTS_FEATURE_KEY = 'timeSlots';

export const TimeSlotsActions = createActionGroup({
  source: 'Time Slots',
  events: {
    'Select day': props<{ dateId: DateId }>(),
    'Get Time Slots': emptyProps(),
    'Get Time Slots Success': props<{ timeSlots: TimeSlot[] }>(),
    'Get Time Slots Failed': props<{ error: HttpErrorResponse }>(),
    'Open Create Time Slot Dialog': emptyProps(),
    'Open Edit Time Slot Dialog': props<{ timeSlot: TimeSlot }>(),
    'Delete Time Slot': props<{ id: string }>(),
    'Delete Time Slot Success': props<{ id: string }>(),
    'Delete Time Slot Failded': props<{ error: HttpErrorResponse }>(),
    'Create Time Slot': props<{ timeSlotCardControlValue: TimeSlotCardControlValue }>(),
    'Create Time Slot Success': props<{ timeSlot: TimeSlot }>(),
    'Create Time Slot Failed': props<{ error: HttpErrorResponse }>(),
    'Edit Time Slot': props<{ initialTimeSlot: TimeSlot; timeSlotCardControlValue: TimeSlotCardControlValue }>(),
    'Edit Time Slot Success': props<{ timeSlot: TimeSlot }>(),
    'Edit Time Slot Failed': props<{ error: HttpErrorResponse }>(),
    'Get Teachers': emptyProps(),
    'Get Teachers Success': props<{ teachers: Teacher[] }>(),
    'Get Teachers Failed': props<{ error: HttpErrorResponse }>(),
    'Get Users': emptyProps(),
    'Get Users Success': props<{ users: User[] }>(),
    'Get Users Failed': props<{ error: HttpErrorResponse }>(),
    'Get Locations': emptyProps(),
    'Get Locations Success': props<{ locations: Location[] }>(),
    'Get Locations Failed': props<{ error: HttpErrorResponse }>(),
    'Set Current Location': props<{ location: Location }>()
  }
});
