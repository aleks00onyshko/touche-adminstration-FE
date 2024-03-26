import { APP_INITIALIZER, enableProdMode, importProvidersFrom } from '@angular/core';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth, Auth, user } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideFunctions, getFunctions } from '@angular/fire/functions';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/components/app/app.component';

import { environment } from './environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { appRoutes } from './app/components/app/app.routes';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { catchError, of, take } from 'rxjs';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LocalStorageService } from './app/core/services/local-storage.service';
import { MatSnackBarModule, MatSnackBar, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { AuthenticationEffects } from './app/components/authentication/store/authentication.effects';
import {
  AUTHENTICATION_FEATURE_NAME,
  authenticationReducer
} from './app/components/authentication/store/authentication.reducer';
import { PROJECT_SETTINGS_FEATURE_NAME, projectSettingsReducer } from './styles/store/projectSettings.reducer';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

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
      RouterModule.forRoot(appRoutes, { useHash: true }),
      BrowserAnimationsModule,
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      }),
      HttpClientModule,
      StoreModule.forRoot({
        [AUTHENTICATION_FEATURE_NAME]: authenticationReducer,
        [PROJECT_SETTINGS_FEATURE_NAME]: projectSettingsReducer
      }),
      EffectsModule.forRoot([AuthenticationEffects]),
      StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production, autoPause: true }),
      MatSnackBarModule
    ),
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [Auth, MatSnackBar, TranslateService, LocalStorageService],
      useFactory:
        (
          auth: Auth,
          matSnackBar: MatSnackBar,
          translateService: TranslateService,
          localStorageService: LocalStorageService
        ) =>
        () => {
          translateService.addLangs(['en', 'uk']);
          translateService.setDefaultLang('uk');
          translateService.use(localStorageService.get('language') ?? 'uk');

          return user(auth).pipe(
            take(1),
            catchError((err: Error) => {
              matSnackBar.open(err.message);
              return of(null);
            })
          );
        }
    },
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: { verticalPosition: 'bottom', horizontalPosition: 'left', duration: 2000 }
    }
  ]
}).catch(err => console.error(err));
