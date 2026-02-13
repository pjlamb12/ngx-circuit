import {
  EnvironmentProviders,
  InjectionToken,
  makeEnvironmentProviders,
  Provider,
} from '@angular/core';

export enum CircuitType {
  Boolean = 'BOOLEAN',
  TimeBased = 'TIME_BASED',
  Percentage = 'PERCENTAGE',
  Group = 'GROUP',
  Environment = 'ENVIRONMENT',
  Device = 'DEVICE',
  Composite = 'COMPOSITE',
}

export interface TimeBasedConfig {
  type: CircuitType.TimeBased;
  startDate: string;
  endDate?: string;
}

export interface PercentageConfig {
  type: CircuitType.Percentage;
  percentage: number;
}

export interface GroupConfig {
  type: CircuitType.Group;
  groups: string[];
}

export interface EnvironmentConfig {
  type: CircuitType.Environment;
  environments: string[];
}

export interface DeviceConfig {
  type: CircuitType.Device;
  devices: string[];
}

export interface CompositeConfig {
  type: CircuitType.Composite;
  conditions: CircuitFlagConfig[];
}

export type CircuitFlagConfig =
  | boolean
  | TimeBasedConfig
  | PercentageConfig
  | GroupConfig
  | EnvironmentConfig
  | DeviceConfig
  | CompositeConfig;

export type CircuitConfig = Record<string, CircuitFlagConfig>;

export type CircuitLoader = string | CircuitConfig;

export const CIRCUIT_CONFIG = new InjectionToken<CircuitLoader>(
  'CIRCUIT_CONFIG',
);

export function provideCircuitConfig(
  config: CircuitLoader,
): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: CIRCUIT_CONFIG,
      useValue: config,
    },
  ]);
}
