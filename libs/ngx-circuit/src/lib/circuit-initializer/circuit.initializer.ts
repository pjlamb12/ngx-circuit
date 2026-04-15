import {
  EnvironmentProviders,
  inject,
  provideAppInitializer,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, firstValueFrom } from 'rxjs';
import { CircuitService } from '../circuit-service/circuit.service';

/**
 * Creates an Angular app initializer that blocks bootstrap until the remote
 * circuit config has finished loading (success or error).
 *
 * This ensures that components reading feature flags at construction time
 * (e.g. via field initializers or in the constructor) receive the correct
 * flag values rather than empty defaults.
 */
export function provideCircuitInitializer(): EnvironmentProviders {
  return provideAppInitializer(() => {
    const circuit = inject(CircuitService);
    return firstValueFrom(
      toObservable(circuit.loading).pipe(filter((loading) => !loading)),
      { defaultValue: false },
    );
  });
}
