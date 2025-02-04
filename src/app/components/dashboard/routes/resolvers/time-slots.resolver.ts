import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, combineLatest, filter, map, take } from 'rxjs';
import { TimeSlotsState } from '../../components/time-slots/store/time-slots.reducer';
import { TimeSlotsActions } from '../../components/time-slots/store/time-slots.actions';
import { selectLocations, selectTables } from '../../components/time-slots/store/time-slots.selectors';
import { Location } from 'src/app/core/model/entities/location';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { DateManager } from '../../../../core/services/date-service/date-manager';

export const timeSlotsResolver: ResolveFn<Observable<boolean>> = () => {
  const store = inject(Store<TimeSlotsState>);
  const localstorageService = inject(LocalStorageService);
  const dateManager = inject(DateManager);

  store.dispatch(TimeSlotsActions.getLocations());
  store.dispatch(TimeSlotsActions.getTables());

  return combineLatest([store.select(selectLocations), store.select(selectTables)]).pipe(
    filter(([locations, tables]) => (locations ?? []).length > 0 && (tables ?? []).length > 0),
    map(([locations]) => {
      const storedLocation = (localstorageService.get('location') as Location) ?? locations![0];
      const locationsHaveStoredLocation = locations!.some(location => location.id === storedLocation.id);
      const currentLocation: Location = locationsHaveStoredLocation ? storedLocation : locations![0];

      store.dispatch(TimeSlotsActions.setCurrentLocation({ location: currentLocation }));
      store.dispatch(TimeSlotsActions.selectDay({ dateId: dateManager.getCurrentDateId() }));
      store.dispatch(TimeSlotsActions.getTimeSlots({}));

      return true;
    }),
    take(1)
  );
};
