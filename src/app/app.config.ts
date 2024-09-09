import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { ErrorInterceptorService } from './services/auth/error-interceptor.service';
import { authInterceptor } from './services/auth/auth-interceptor';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideClientHydration(),

    provideHttpClient(withInterceptors([authInterceptor])),
    importProvidersFrom(HttpClient, ErrorInterceptorService),
  ]
};
