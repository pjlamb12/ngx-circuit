import {
  InjectionToken,
  makeEnvironmentProviders,
  EnvironmentProviders,
  Provider,
} from '@angular/core';

export interface CircuitContext {
  userId?: string;
  sessionId?: string;
  groups?: string[];
  environment?: string;
  platform?: string;
  [key: string]: unknown;
}

export const CIRCUIT_CONTEXT = new InjectionToken<
  CircuitContext | (() => CircuitContext)
>('CIRCUIT_CONTEXT');

export function provideCircuitContext(
  context: CircuitContext | (() => CircuitContext),
): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: CIRCUIT_CONTEXT,
      useValue: context,
    },
  ]);
}
