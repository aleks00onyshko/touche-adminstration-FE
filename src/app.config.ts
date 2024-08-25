import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from './environments/environment';
import { Auth, getAuth, provideAuth, user } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getFunctions, provideFunctions } from '@angular/fire/functions';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { RouterModule } from '@angular/router';
import { appRoutes } from './app/components/app/app.routes';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import {
  AUTHENTICATION_FEATURE_NAME,
  authenticationReducer
} from './app/components/authentication/store/authentication.reducer';
import { PROJECT_SETTINGS_FEATURE_NAME, projectSettingsReducer } from './styles/store/projectSettings.reducer';
import { EffectsModule } from '@ngrx/effects';
import { AuthenticationEffects } from './app/components/authentication/store/authentication.effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { LocalStorageService } from './app/core/services/local-storage.service';
import { catchError, of, take } from 'rxjs';
import { FileExtractor, ToucheFileExtractor } from './app/core/model/file-extractor/file-extract.service';
import { FileUpload, ToucheFileUpload } from './app/core/model/file-upload/file-upload.service';
import {
  AvatarConfigurationBuilder,
  AvatarConfigurationBuilderFactory,
  ToucheAvatarConfigurationBuilder,
  ToucheAvatarConfigurationBuilderFactory
} from './app/shared/components/avatar/models/avatar-configuration-builder';
import { AvatarBuilder, ToucheAvatarBuilder } from './app/shared/components/avatar/models/avatar-builder';

import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export const applicationConfig: ApplicationConfig = {
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
          useFactory: (http: HttpClient) => new TranslateHttpLoader(http),
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
    },
    {
      provide: FileExtractor,
      useClass: ToucheFileExtractor
    },
    {
      provide: FileUpload,
      useClass: ToucheFileUpload
    },
    {
      provide: AvatarConfigurationBuilder,
      useClass: ToucheAvatarConfigurationBuilder
    },
    {
      provide: AvatarConfigurationBuilderFactory,
      useClass: ToucheAvatarConfigurationBuilderFactory
    },
    {
      provide: AvatarBuilder,
      useClass: ToucheAvatarBuilder
    }
  ]
};
