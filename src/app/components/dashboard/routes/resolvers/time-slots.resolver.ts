import { Injectable, inject } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, filter, take, tap } from 'rxjs';
import { TimeSlotsState } from '../../components/time-slots/store/time-slots.reducer';
import { TimeSlot } from 'src/app/core/model/entities/time-slot';
import { TimeSlotsActions } from '../../components/time-slots/store/time-slots.actions';
import { selectLocations } from '../../components/time-slots/store/time-slots.selectors';
import { Location } from 'src/app/core/model/entities/location';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';

export const timeSlotsResolver: ResolveFn<Observable<Location[] | null>> = (route: ActivatedRouteSnapshot) => {
  const store = inject(Store<TimeSlotsState>);
  const localstorageService = inject(LocalStorageService);

  store.dispatch(TimeSlotsActions.getLocations());

  return store.select(selectLocations).pipe(
    filter(locations => !!locations),
    tap(locations => {
      if (locations) {
        const storedLocation = locations.find(
          location => location.id === JSON.parse(localstorageService.get('location'))?.id
        );

        store.dispatch(TimeSlotsActions.setCurrentLocation({ location: storedLocation ?? locations[0] }));
      }
    }),
    take(1)
  );
};
