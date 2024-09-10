import { enableProdMode } from '@angular/core';

import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/components/app/app.component';
import { environment } from './environments/environment';
import { applicationConfig } from './app.config';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, applicationConfig).catch(err => console.error(err));
