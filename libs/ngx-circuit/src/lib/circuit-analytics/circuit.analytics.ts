import {
  EnvironmentProviders,
  InjectionToken,
  Provider,
  Type,
  makeEnvironmentProviders,
} from '@angular/core';

export abstract class CircuitTracker {
  abstract track(feature: string, enabled: boolean): void;
}

export const CIRCUIT_TRACKER = new InjectionToken<CircuitTracker>(
  'CIRCUIT_TRACKER',
);

export function provideCircuitTracker(
  tracker: Type<CircuitTracker>,
): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: CIRCUIT_TRACKER,
      useClass: tracker,
    },
  ]);
}
