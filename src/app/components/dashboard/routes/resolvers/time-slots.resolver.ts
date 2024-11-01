import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, combineLatest, filter, map, take } from 'rxjs';
import { TimeSlotsState } from '../../components/time-slots/store/time-slots.reducer';
import { TimeSlotsActions } from '../../components/time-slots/store/time-slots.actions';
import { selectLocations, selectTeachers } from '../../components/time-slots/store/time-slots.selectors';
import { Location } from 'src/app/core/model/entities/location';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import moment from 'moment/moment';
import { DateId } from '../../../../core/model/entities/time-slot';

export const timeSlotsResolver: ResolveFn<Observable<boolean>> = () => {
  const store = inject(Store<TimeSlotsState>);
  const localstorageService = inject(LocalStorageService);

  store.dispatch(TimeSlotsActions.getLocations());
  store.dispatch(TimeSlotsActions.getTeachers());

  return combineLatest([store.select(selectLocations), store.select(selectTeachers)]).pipe(
    filter(([locations, teachers]) => (locations ?? []).length > 0 && (teachers ?? []).length > 0),
    map(([locations]) => {
      const storedLocation = (localstorageService.get('location') as Location) ?? locations![0];
      const locationsHaveStoredLocation = locations!.some(location => location.id === storedLocation.id);
      const currentLocation: Location = locationsHaveStoredLocation ? storedLocation : locations![0];

      store.dispatch(TimeSlotsActions.setCurrentLocation({ location: currentLocation }));
      store.dispatch(TimeSlotsActions.selectDay({ dateId: getTodayDateId() }));
      store.dispatch(TimeSlotsActions.getTimeSlots({}));

      return true;
    }),
    take(1)
  );
};

function getTodayDateId(): DateId {
  const currentDate = moment();
  const currentMonthNumber = currentDate.format('MM');
  const currentDayNumber = currentDate.date();
  const year = currentDate.year();

  return `${currentDayNumber}-${currentMonthNumber}-${year}`;
}
