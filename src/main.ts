import { APP_INITIALIZER, enableProdMode, importProvidersFrom, InjectionToken } from '@angular/core';
import { MatSnackBar, MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth, Auth, user } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideFunctions, getFunctions } from '@angular/fire/functions';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/components/app.component';

import { environment } from './environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { appRoutes } from './app/components/app.routes';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { authenticationReducer, AUTHENTICATION_FEATURE_NAME } from './app/store/authentication/authentication.reducer';
import { AuthenticationEffects } from './app/store/authentication/authentication.effects';
import { catchError, of, take } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      provideFirebaseApp(() => initializeApp(environment.firebase)),
      provideAuth(() => getAuth()),
      provideFirestore(() => getFirestore()),
      provideFunctions(() => getFunctions()),
      provideStorage(() => getStorage()),
      RouterModule.forRoot(appRoutes),
      BrowserAnimationsModule,
      HttpClientModule,
      StoreModule.forRoot({ [AUTHENTICATION_FEATURE_NAME]: authenticationReducer }),
      EffectsModule.forRoot([AuthenticationEffects]),
      StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production, autoPause: true }),
      MatSnackBarModule
    ),
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [Auth, MatSnackBar],
      useFactory: (auth: Auth, matSnackBar: MatSnackBar) => () =>
        user(auth).pipe(
          take(1),
          catchError((err: Error) => {
            matSnackBar.open(err.message);
            return of(null);
          })
        )
    },
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: { verticalPosition: 'bottom', horizontalPosition: 'left', duration: 2000 }
    }
  ]
}).catch(err => console.error(err));
