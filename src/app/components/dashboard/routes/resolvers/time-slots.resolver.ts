import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, combineLatest, filter, map, take, tap } from 'rxjs';
import { TimeSlotsState } from '../../components/time-slots/store/time-slots.reducer';
import { TimeSlotsActions } from '../../components/time-slots/store/time-slots.actions';
import { selectLocations, selectTeachers } from '../../components/time-slots/store/time-slots.selectors';
import { Location } from 'src/app/core/model/entities/location';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { Teacher } from 'src/app/core/model/entities/teacher';

export const timeSlotsResolver: ResolveFn<Observable<void>> = () => {
  const store = inject(Store<TimeSlotsState>);
  const localstorageService = inject(LocalStorageService);

  store.dispatch(TimeSlotsActions.getLocations());
  store.dispatch(TimeSlotsActions.getTeachers());

  return combineLatest([
    store.select(selectLocations),
    store.select(selectTeachers),
  ]).pipe(
    filter(([locations, teachers]) => !!locations && locations?.length > 0 && (teachers ?? []).length > 0),
    map(([locations]) => {
      if (locations) {
        const storedLocation = locations.find(
          location => location.id === (localstorageService.get('location') ?? ({} as any))?.id
        );
        store.dispatch(TimeSlotsActions.setCurrentLocation({ location: storedLocation ?? locations[0] }));
      }
    }),
    take(1)
  );
};
