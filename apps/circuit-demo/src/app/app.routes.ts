import { Route } from '@angular/router';
import { circuitGuard } from 'ngx-circuit';

export const appRoutes: Route[] = [
  {
    path: 'protected',
    loadComponent: () =>
      import('./protected.component').then((m) => m.ProtectedComponent),
    canActivate: [circuitGuard],
    data: {
      circuit: 'protectedFeature',
      circuitRedirectUrl: '/',
    },
  },
];
