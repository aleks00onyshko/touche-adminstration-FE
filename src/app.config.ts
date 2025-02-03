import {
  ApplicationConfig,
  importProvidersFrom, inject,
  provideAppInitializer,
  Provider
} from '@angular/core';

import { environment } from './environments/environment';
import { Auth, getAuth, provideAuth, user } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app/components/app/app.routes';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import {
  AUTHENTICATION_FEATURE_NAME,
  authenticationReducer
} from './app/components/authentication/store/authentication.reducer';
import { PROJECT_SETTINGS_FEATURE_NAME, projectSettingsReducer } from './styles/store/projectSettings.reducer';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { LocalStorageService } from './app/core/services/local-storage.service';
import { catchError, of, take } from 'rxjs';
import { FileExtractor, ToucheFileExtractor } from './app/core/model/file-extractor/file-extract.service';
import { FileUpload, ToucheFileUpload } from './app/core/model/file-upload/file-upload.service';
import {
  AvatarConfigurationBuilderFactory,
  ToucheAvatarConfigurationBuilderFactory
} from './app/shared/components/avatar/models/avatar-configuration-builder';
import * as authEffects from './app/components/authentication/store/authentication.effects';

import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { DateManager } from './app/core/services/date-service/date-manager';
import { DateService } from './app/core/services/date-service/date.service';
import { AvatarFactory, ToucheAvatarFactory } from './app/shared/components/avatar/models/avatar-factory';

const ABSTRACTIONS: Provider[] = [
  {
    provide: FileExtractor,
    useClass: ToucheFileExtractor
  },
  {
    provide: FileUpload,
    useClass: ToucheFileUpload
  },
  {
    provide: AvatarConfigurationBuilderFactory,
    useClass: ToucheAvatarConfigurationBuilderFactory
  },
  {
    provide: AvatarFactory,
    useClass: ToucheAvatarFactory
  },
  {
    provide: DateManager,
    useClass: DateService
  }
];

export const applicationConfig: ApplicationConfig = {
  providers: [
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    provideHttpClient(),
    importProvidersFrom(
      BrowserAnimationsModule,
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: (http: HttpClient) => new TranslateHttpLoader(http),
          deps: [HttpClient]
        }
      })
    ),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: environment.production,
      autoPause: true
    }),
    provideStore({
      [AUTHENTICATION_FEATURE_NAME]: authenticationReducer,
      [PROJECT_SETTINGS_FEATURE_NAME]: projectSettingsReducer
    }),
    provideStoreDevtools({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
      autoPause: true, // Pauses recording actions and state changes when the extension window is not open
      trace: false, //  If set to true, will include stack trace for every dispatched action, so you can see it in trace tab jumping directly to that part of code
      traceLimit: 75, // maximum stack trace frames to be stored (in case trace option was provided as true)
      connectInZone: true // If set to true, the connection is established within the Angular zone
    }),
    provideEffects(authEffects),
    provideRouter(appRoutes),
    MatSnackBarModule,
    provideAppInitializer(() => {
      const auth = inject(Auth);
      const matSnackBar = inject(MatSnackBar);
      const translateService = inject(TranslateService);
      const localStorageService = inject(LocalStorageService);

      translateService.addLangs(['en', 'uk']);
      translateService.setDefaultLang('en');
      translateService.use(localStorageService.get('language') ?? 'en');

      return user(auth).pipe(
        take(1),
        catchError((err: Error) => {
          matSnackBar.open(err.message);
          return of(null);
        })
      );
    }),
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: { verticalPosition: 'bottom', horizontalPosition: 'left', duration: 2000 }
    },
    ...ABSTRACTIONS
  ]
};
