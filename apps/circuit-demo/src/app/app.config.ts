import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import {
  provideCircuitConfig,
  provideCircuitContext,
  CircuitType,
} from 'ngx-circuit';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
    provideHttpClient(),
    provideCircuitConfig({
      welcomeBanner: true,
      promoBanner: {
        type: CircuitType.TimeBased,
        startDate: '2023-01-01',
        endDate: '2025-12-31',
      },
      betaFeature: {
        type: CircuitType.Group,
        groups: ['beta-testers'],
      },
      experimentalFeature: {
        type: CircuitType.Percentage,
        percentage: 50,
      },
      protectedFeature: true,
      disabledFeature: false,
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
