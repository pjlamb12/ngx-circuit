import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideRemoteCircuitConfig, provideCircuitContext } from 'ngx-circuit';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
    provideHttpClient(),
    provideRemoteCircuitConfig('http://localhost:3000/api/client/config', {
      apiKey: 'ckt_715f0816e9722dd0109005381db4e6e0',
    }),
    provideCircuitContext({
      userId: 'user-123',
      sessionId: 'session-abc',
      groups: ['beta-testers'],
      environment: 'production',
      platform: 'web',
    }),
  ],
};
