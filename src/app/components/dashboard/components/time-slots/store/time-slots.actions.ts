import { HttpErrorResponse } from '@angular/common/http';
import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Teacher } from 'src/app/core/model/entities/teacher';
import { DateId, TimeSlot } from 'src/app/core/model/entities/time-slot';
import { TimeSlotCardControlValue } from '../components/time-slot/time-slot-card.component';
import { Location } from 'src/app/core/model/entities/location';

export const TIMESLOTS_FEATURE_KEY = 'timeSlots';

export const TimeSlotsActions = createActionGroup({
  source: 'Time Slots',
  events: {
    'Select day': props<{ dateId: DateId }>(),
    'Get Time Slots': emptyProps(),
    'Get Time Slots Success': props<{ timeSlots: TimeSlot[] }>(),
    'Get Time Slots Failed': props<{ error: HttpErrorResponse }>(),
    'Open Create Time Slot Dialog': emptyProps(),
    'Delete Time Slot': props<{ id: string }>(),
    'Delete Time Slot Success': props<{ id: string }>(),
    'Delete Time Slot Failded': props<{ error: HttpErrorResponse }>(),
    'Create Time Slot': props<{ timeSlotCardControlValue: TimeSlotCardControlValue }>(),
    'Create Time Slot Success': props<{ timeSlot: TimeSlot }>(),
    'Create Time Slot Failed': props<{ error: HttpErrorResponse }>(),
    'Get Teachers': emptyProps(),
    'Get Teachers Success': props<{ teachers: Teacher[] }>(),
    'Get Teachers Failed': props<{ error: HttpErrorResponse }>(),
    'Get Locations': emptyProps(),
    'Get Locations Success': props<{ locations: Location[] }>(),
    'Get Locations Failed': props<{ error: HttpErrorResponse }>(),
    'Set Current Location': props<{ location: Location }>()
  }
});
