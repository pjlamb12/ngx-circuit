import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { CircuitService } from '../circuit-service/circuit.service';

export const circuitGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
): boolean | UrlTree => {
  const circuitService = inject(CircuitService);
  const router = inject(Router);

  const feature = route.data['circuit'] as string;
  const redirectUrl = route.data['circuitRedirectUrl'] as string | undefined;

  if (!feature) {
    console.warn(
      'CircuitGuard: No "circuit" data property found on route. Allowing access.',
    );
    return true;
  }

  const isEnabled = circuitService.isEnabled(feature);

  if (isEnabled) {
    return true;
  }

  if (redirectUrl) {
    return router.createUrlTree([redirectUrl]);
  }

  return false;
};
