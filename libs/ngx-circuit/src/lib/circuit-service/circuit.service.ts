import { HttpClient } from '@angular/common/http';
import { Injectable, signal, WritableSignal, inject } from '@angular/core';
import { catchError, of, tap } from 'rxjs';
import {
  CIRCUIT_CONFIG,
  CircuitConfig,
  CircuitLoader,
  CircuitFlagConfig,
  CircuitType,
  TimeBasedConfig,
  PercentageConfig,
  GroupConfig,
  EnvironmentConfig,
  DeviceConfig,
  CompositeConfig,
  CIRCUIT_OPTIONS,
  CircuitOptions,
} from '../circuit.config';
import {
  CIRCUIT_CONTEXT,
  CircuitContext,
} from '../circuit-context/circuit.context';
import {
  CIRCUIT_TRACKER,
  CircuitTracker,
} from '../circuit-analytics/circuit.analytics';

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

  private configLoader = inject<CircuitLoader>(CIRCUIT_CONFIG);
  private http = inject(HttpClient);
  private context = inject<CircuitContext | (() => CircuitContext)>(
    CIRCUIT_CONTEXT,
    { optional: true },
  );
  private options = inject<CircuitOptions>(CIRCUIT_OPTIONS, { optional: true });
  private tracker = inject<CircuitTracker>(CIRCUIT_TRACKER, { optional: true });

  constructor() {
    this.loadConfig();
  }

  private loadConfig(): void {
    if (typeof this.configLoader === 'string') {
      const headers: Record<string, string> = {};
      if (this.options?.apiKey) {
        headers['x-api-key'] = this.options.apiKey;
      }

      this._loading.set(true);
      // We need to subscribe to the observable to trigger the HTTP request
      this.http
        .get<CircuitConfig>(this.configLoader, { headers })
        .pipe(
          tap((config) => {
            this._flags.set(this.applyOverrides(config));
            this._loading.set(false);
            this._error.set(null);
          }),
          catchError((err) => {
            this._error.set('Failed to load circuit config');
            this._loading.set(false);
            console.error(err);
            // Return an empty object to keep the stream alive if needed
            return of({});
          }),
        )
        .subscribe();
    } else {
      this._flags.set(this.applyOverrides(this.configLoader));
    }
  }

  private applyOverrides(config: CircuitConfig): CircuitConfig {
    if (!this.options?.enableUrlOverrides) {
      return config;
    }

    try {
      const searchParams = new URLSearchParams(window.location.search);
      const circuitParam = searchParams.get('circuit');

      if (!circuitParam) {
        return config;
      }

      const overrides = circuitParam.split(',').reduce((acc, part) => {
        const [key, value] = part.split(':');
        if (key && value) {
          acc[key.trim()] = value.trim() === 'true';
        }
        return acc;
      }, {} as CircuitConfig);

      return {
        ...config,
        ...overrides,
      };
    } catch (e) {
      console.warn('Failed to parse circuit URL overrides', e);
      return config;
    }
  }

  isEnabled(feature: string): boolean {
    const flags = this.flags();
    const flag = flags[feature];

    if (flag === undefined) {
      this.tracker?.track(feature, false);
      return false;
    }

    const enabled = this.checkFlag(flag, feature);
    this.tracker?.track(feature, enabled);
    return enabled;
  }

  private checkFlag(flag: CircuitFlagConfig, featureName: string): boolean {
    if (typeof flag === 'boolean') {
      return flag;
    }

    switch (flag.type) {
      case CircuitType.TimeBased:
        return this.checkTimeBased(flag);
      case CircuitType.Percentage:
        return this.checkPercentage(flag, featureName);
      case CircuitType.Group:
        return this.checkGroup(flag);
      case CircuitType.Environment:
        return this.checkEnvironment(flag);
      case CircuitType.Device:
        return this.checkDevice(flag);
      case CircuitType.Composite:
        return this.checkComposite(flag, featureName);
      default:
        return false;
    }
  }

  private getContext(): CircuitContext {
    if (!this.context) {
      return {};
    }
    return typeof this.context === 'function' ? this.context() : this.context;
  }

  private checkTimeBased(flag: TimeBasedConfig): boolean {
    const now = new Date();
    const startDate = new Date(flag.startDate);
    const endDate = flag.endDate ? new Date(flag.endDate) : null;

    if (now < startDate) {
      return false;
    }

    if (endDate && now > endDate) {
      return false;
    }

    return true;
  }

  private checkPercentage(
    flag: PercentageConfig,
    featureName: string,
  ): boolean {
    const context = this.getContext();
    const sessionId = context.sessionId || this.getOrCreateSessionId();
    const hash = this.hashString(sessionId + featureName);
    return hash % 100 < flag.percentage;
  }

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }

  private getOrCreateSessionId(): string {
    const STORAGE_KEY = 'circuit_session_id';
    let sessionId = sessionStorage.getItem(STORAGE_KEY);
    if (!sessionId) {
      sessionId = Math.random().toString(36).substring(2, 15);
      sessionStorage.setItem(STORAGE_KEY, sessionId);
    }
    return sessionId;
  }

  private checkGroup(flag: GroupConfig): boolean {
    const context = this.getContext();
    const userGroups = context.groups || [];
    return flag.groups.some((g: string) => userGroups.includes(g));
  }

  private checkEnvironment(flag: EnvironmentConfig): boolean {
    const context = this.getContext();
    return flag.environments.includes(context.environment || '');
  }

  private checkDevice(flag: DeviceConfig): boolean {
    const context = this.getContext();
    return flag.devices.includes(context.platform || '');
  }

  private checkComposite(flag: CompositeConfig, featureName: string): boolean {
    return flag.conditions.every((condition: CircuitFlagConfig) =>
      this.checkFlag(condition, featureName),
    );
  }
}
