import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, signal, WritableSignal } from '@angular/core';
import { catchError, of, tap } from 'rxjs';
import { CIRCUIT_CONFIG, CircuitConfig, CircuitLoader } from './circuit.config';

@Injectable({
  providedIn: 'root',
})
export class CircuitService {
  private _flags: WritableSignal<CircuitConfig> = signal({});
  readonly flags = this._flags.asReadonly();

  private _loading = signal(false);
  readonly loading = this._loading.asReadonly();

  private _error = signal<string | null>(null);
  readonly error = this._error.asReadonly();

  constructor(
    @Inject(CIRCUIT_CONFIG) private configLoader: CircuitLoader,
    private http: HttpClient,
  ) {
    this.loadConfig();
  }

  private loadConfig(): void {
    if (typeof this.configLoader === 'string') {
      this._loading.set(true);
      // We need to subscribe to the observable to trigger the HTTP request
      this.http
        .get<CircuitConfig>(this.configLoader)
        .pipe(
          tap((config) => {
            this._flags.set(config);
            this._loading.set(false);
            this._error.set(null);
          }),
          catchError((err) => {
            this._error.set('Failed to load circuit config');
            this._loading.set(false);
            console.error(err);
            // Return an empty object to keep the stream alive if needed,
            // though here we are just subscribing once.
            return of({});
          }),
        )
        .subscribe();
    } else {
      this._flags.set(this.configLoader);
    }
  }

  isEnabled(feature: string): boolean {
    const flags = this.flags();
    const flag = flags[feature];

    if (flag === undefined) {
      return false;
    }

    if (typeof flag === 'boolean') {
      return flag;
    }

    return false;
  }
}
