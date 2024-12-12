// src/app/app.config.ts

import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { routes } from './app.routes';
import { AuthInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    // Provide the AuthInterceptor to attach JWT tokens to HTTP requests
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    // Import HttpClientModule for making HTTP requests
    importProvidersFrom(HttpClientModule),
  ],
};
