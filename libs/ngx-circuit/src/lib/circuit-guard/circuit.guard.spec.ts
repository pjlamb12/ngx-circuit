import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { CircuitService } from '../circuit-service/circuit.service';
import { circuitGuard } from './circuit.guard';

describe('circuitGuard', () => {
  let mockCircuitService: any;
  let mockRouter: any;

  beforeEach(() => {
    mockCircuitService = {
      isEnabled: (feature: string) => feature === 'enabledFeature',
    };

    mockRouter = {
      createUrlTree: (commands: any[]) => ({
        toString: () => commands.join('/'),
      }),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: CircuitService, useValue: mockCircuitService },
        { provide: Router, useValue: mockRouter },
      ],
    });
  });

  const executeGuard = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ) => TestBed.runInInjectionContext(() => circuitGuard(route, state));

  it('should allow activation when feature is enabled', () => {
    const route = {
      data: { circuit: 'enabledFeature' },
    } as unknown as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;

    expect(executeGuard(route, state)).toBe(true);
  });

  it('should block activation when feature is disabled', () => {
    const route = {
      data: { circuit: 'disabledFeature' },
    } as unknown as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;

    expect(executeGuard(route, state)).toBe(false);
  });

  it('should redirect when redirectUrl is provided and feature is disabled', () => {
    const route = {
      data: {
        circuit: 'disabledFeature',
        circuitRedirectUrl: '/fallback',
      },
    } as unknown as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;

    const result = executeGuard(route, state);
    expect((result as any).toString()).toBe('/fallback');
  });

  it('should warn and allow activation when no circuit feature is provided', () => {
    const consoleSpy = vi
      .spyOn(console, 'warn')
      .mockImplementation(() => undefined);
    const route = {
      data: {},
    } as unknown as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;

    expect(executeGuard(route, state)).toBe(true);
    expect(consoleSpy).toHaveBeenCalledWith(
      'CircuitGuard: No "circuit" data property found on route. Allowing access.',
    );
  });
});
