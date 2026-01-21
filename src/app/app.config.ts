import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { PreloadAllModules, provideRouter, withComponentInputBinding, withPreloading } from '@angular/router';
import { provideSignalFormsConfig } from '@angular/forms/signals';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { baseUrlInterceptor } from './shared/interceptors/base-url-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([baseUrlInterceptor])),
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes, withComponentInputBinding(), withPreloading(PreloadAllModules)),
    provideSignalFormsConfig({
      classes: {
        'ng-valid': ({ state }) => state().valid(),
        'ng-invalid': ({ state }) => state().invalid(),
        'ng-touched': ({ state }) => state().touched(),
        'ng-dirty': ({ state }) => state().dirty(),
        'ng-pristine': ({ state }) => !state().dirty(),
      },
    }),
  ],
};
